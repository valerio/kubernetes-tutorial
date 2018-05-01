# [Optional] Manually deploy an ingress controller

Before you can add Ingresses, you need to deploy an ingress controller. Any controller implementation will do, in this case, we will deploy the nginx ingress controller using the files in the [ingress](../deployments/ingress) directory.

The files should be applied in order: 
1. namespace.yaml
2. configmaps.yaml
3. default-backend.yaml
4. rbac.yaml
5. controller.yaml

A description of what exactly will be created follows.

#### Namespace and ConfigMaps

```yaml
# define a namespace for ingress-related elements
apiVersion: v1
kind: Namespace
metadata:
  name: ingress-nginx

---

# add a few ConfigMaps for the namespace
kind: ConfigMap
apiVersion: v1
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
  labels:
    app: ingress-nginx

# ...more ConfigMaps omitted
```

This sections simply adds a namespace to hold all ingress related resources, plus a few ConfigMaps to hold some names/labels.
ConfigMaps are simple key-value maps that can be referenced in resources created on the cluster. They can be used to define environment variables and some settings and avoiding duplication.

#### Default Backend

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: default-http-backend
  labels:
    app: default-http-backend
  namespace: ingress-nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: default-http-backend
  template:
    metadata:
      labels:
        app: default-http-backend
    spec:
      terminationGracePeriodSeconds: 60
      containers:
      - name: default-http-backend
        # Any image is permissible as long as:
        # 1. It serves a 404 page at /
        # 2. It serves 200 on a /healthz endpoint
        image: gcr.io/google_containers/defaultbackend:1.4
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 30
          timeoutSeconds: 5
        ports:
        - containerPort: 8080
        # resources dedicated to this Pod in terms of guaranteed (requests) and maximum (limits) of CPU/memory
        resources:
          limits:
            cpu: 10m
            memory: 20Mi
          requests:
            cpu: 10m
            memory: 20Mi
---

apiVersion: v1
kind: Service
metadata:
  name: default-http-backend
  namespace: ingress-nginx
  labels:
    app: default-http-backend
spec:
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: default-http-backend

```

This is a simple Deployment and Service definition. The `defaultbackend` image will simply send a 404 for any request and a 200 for `/healthz` requests.

Compared to a deployment definition we saw in the previous steps, this adds a health check (`livenessProbe` section and /healthz endpoint) and resources dedicated to it (`resources` section). The service simply makes it available inside the cluster.

#### RBAC

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nginx-ingress-serviceaccount
  namespace: ingress-nginx

# permissions omitted for brevity
```

This section defines an account for the ingress controller and its permissions. This is usually required as, by default, kubernetes clusters have RBAC (Role Based Access Control) enabled.

#### Ingress controller

Finally, the controller itself. The image and arguments it is launched with are these:

```yaml
        - name: nginx-ingress-controller
          image: quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.14.0
          args:
            - /nginx-ingress-controller
            - --default-backend-service=$(POD_NAMESPACE)/default-http-backend
            - --configmap=$(POD_NAMESPACE)/nginx-configuration
            - --tcp-services-configmap=$(POD_NAMESPACE)/tcp-services
            - --udp-services-configmap=$(POD_NAMESPACE)/udp-services
            - --annotations-prefix=nginx.ingress.kubernetes.io
```

The args reference the resources previously created in the file (configmaps and default-backend).

Once every part is deployed, you can proceed to add ingresses.
