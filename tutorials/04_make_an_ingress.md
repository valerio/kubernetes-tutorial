# 04 - Adding Ingresses to your cluster

We've seen how to make your Pods reachable by using a Service. Normally, a Service and Pods have IP addresses that are only routable via the cluster network.

An Ingress is a collection of rules that allow inbound connections to reach the cluster services. It can be configured to give services externally reachable URLs, load balance traffic, terminate SSL, offer name based virtual hosting, and more.

Ingresses are handled by an Ingress Controller, which is usually implemented by common reverse proxies such as [nginx](https://github.com/kubernetes/ingress-nginx) or [traefik](https://github.com/containous/traefik/blob/master/docs/user-guide/kubernetes.md).

## Deploying the controller

The latest minikube versions can easily add an nginx based ingress with a simple command:

```
minikube addons enable ingress
```

Which will deploy an [ingress controller](https://github.com/kubernetes/minikube/blob/master/deploy/addons/ingress/ingress-rc.yaml), [configmaps](https://github.com/kubernetes/minikube/blob/master/deploy/addons/ingress/ingress-configmap.yaml) and [a service](https://github.com/kubernetes/minikube/blob/master/deploy/addons/ingress/ingress-svc.yaml) to expose a default backend.

Alternatively, if you'd like to understand a bit more of what exactly is being deployed, you can check how to [manually deploy the nginx ingress controller](./optional_manual_ingress_controller.md).

**Note:** multiple ingress controller implementations exist and are generally equivalent, if the deployment doesn't work for you, feel free to check the deployment guides provided by the implementation you wish to use. [Helm](https://helm.sh) is also an option for deploying a controller easily.

## Creating an Ingress

Once the controller is deployed, we can finally add the desired Ingresses.
Path will be `/`, so our selected service will be reached as the index when visiting our cluster's external IP.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  namespace: default
  annotations:
    ingress.kubernetes.io/rewrite-target: / 
    nginx.org/ssl-services: hello-world-service
spec:
  rules:
  - host: # empty in this case, but you could fill in the host here (we use the minikube IP instead)
    http:
      paths:
      - path: /
        backend:
          serviceName: hello-world-service
          servicePort: 80
```

Once deployed, head over to your minikube IP, and you should see your application (pointed at by the `hello-world-service` Service) running!

**Note**: the guide skips setting a certificate for the controller, which means you'll likely get a security warning from your browser.

## Next step

In the next step, we'll [spruce up our deployment](./05_update_and_scale_up.md) by adding a few key kubernetes features to it.