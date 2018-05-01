# 05 - Update and scale up your app

Now that we have deployed an application and exposed it via an Ingress, we can finally start looking at how to improve deployments and scale it up, so it can handle more traffic.

We will use the following deployment as a base for the next few steps, make sure to use the right name and image:

```yaml
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: hello-world
  namespace: default
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: hello-world
        image: k8stutorial-helloworld:v1
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        imagePullPolicy: Never
      terminationGracePeriodSeconds: 60
```

It's a good idea to save this file locally, so you can update and add some features little by little.

## Scaling up

Scaling up (or down) your pods is extremely simple, you simply edit the `replicas` parameter.

```yaml
#...
spec:
  replicas: 2
#...
```

This can be applied via `kubectl apply -f filename.yaml` or via the dashboard, by editing directly the parameter in the dashboard (in this case, make sure you are editing the **Deployment** and **NOT** the ReplicaSet, otherwise your change won't stick).

This will automatically create new replicas to reach the desired number. The cluster might not be able to provision more, depending on the amount of resources.

By default, updating a deployment will use a `RollingUpdate` strategy, which will gradually create new pods and gradually remove old ones. To make this transition seamless, we should also add a ready/health check, so that pods will be used only after they are actually running.

## Deploying a new version

Let's say you have a new version of your application you want to deploy, updating the one running in the cluster is quite easy!

This is where tagging your docker images comes in handy, once you update your application, build a new image with a new tag, for example:

```
docker build . -t k8stutorial-helloworld:v2 
```

Then, it's just a matter of applying again your yaml file, with the updated image name (and tag):

```yaml
#...
- name: hello-world
  image: k8stutorial-helloworld:v2
#...
```

Make sure the names of the deployment and specs are the same, this will generate a new ReplicaSet and deploy the new version.

## Readiness and Liveness probes

Adding an health and a ready check will improve our uptime when a deployment or crash happens. As with most things, adding these to a deployment is really simple.

First of all, make sure your app has a health check endpoint available. By convention, these endpoints are usually called `/healthz` and simply return a 200 response. You can add one to the hello-world app by adding this snippet in `server.js`:

```javascript
app.get('/healthz', (req, res) => {
    res.status(200).send();
});
```

Build your new image and then you can update your deployment spec by adding:

```yaml
spec:
    #...
    livenessProbe:
        httpGet:
        path: /healthz
        port: 8080
        initialDelaySeconds: 15
        periodSeconds: 10
    readinessProbe:
        httpGet:
        path: /healthz
        port: 8080
        initialDelaySeconds: 5
        periodSeconds: 10
```

The `readinessProbe` will be used when launching the application, after waiting for 5 seconds, it will poll the `/healthz` endpoint. The Pod will be considered ready only if 3 consecutive health checks return a 200 response (it will poll every 10 seconds).

This prevents deploying broken images, as the old version of the Pod will be kept until a new image will respond correctly to the ready check.

The `livenessProbe` works similarly: it will poll the endpoint every 10 seconds. If there are 3 consecutive failures, the Pod will be considered "unhealthy" and will be restarted automatically.

Try adding these without a health check endpoint and see what happens! Is your app still reachable?
