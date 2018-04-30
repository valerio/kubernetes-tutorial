# 03 Exposing Services

Running a pod via a deployment doesn't make it reachable from the outside world. This is fine for worker services that don't need to be reachable (message bus processors, cron jobs, etc.), but for servers it's necessary to specify and add a Service.

## Add a ClusterIP Service

The simplest Service to add is a clusterIP Service, this can be done via the following yaml snippet:

```
kind: Service
apiVersion: v1
metadata:
  labels:
    # these labels can be anything
    name: {service-name}
  name: {service-name}
spec:
  selector:
    app: {name of your deployment's app tag}
  ports:
    - protocol: TCP
      port: 80
      # target is the port exposed by your containers (in our example 8080)
      targetPort: 8080
```

As always, this can be applied via the dashboard or by using `kubectl apply -f <filename>`. It's important to note that **the `app` tag** we defined on the deployment is used to select which deployments this service will expose.

Suppose we add an `hello-world-service` for our `hello-world` deployment, we then can check that the service is running via:

```
➜  ~ kubectl get services
NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
hello-world-service   ClusterIP   10.102.99.30   <none>        80/TCP    17s
```

This means that our deployment is now accessible via the internal cluster IP shown, but not externally (no external-IP) is provided.

We can verify this by executing a command from inside our cluster (you can use `kubectl exec` or the dashboard for this):
```
root@hello-world-856869c669-7s6hq:/usr/src/app# getent hosts hello-world-service
10.102.99.30    hello-world-service.default.svc.cluster.local
root@hello-world-856869c669-7s6hq:/usr/src/app# 
```

This is fine, as long as we only want to expose the specific pods to other pods running in the cluster.

## Expose the service to outside of the cluster

There are two ways of exposing services to the outside world: `NodePort` and `LoadBalancer`. Unfortunately, minikube only supports NodePort services, as LoadBalancer services are meant to be run on cloud providers (and automatically provision a LB on creation).

We can deploy a NodePort service by changing its `spec.type` to `NodePort`, like in the following yaml descriptor:

```
kind: Service
apiVersion: v1
metadata:
  labels:
    name: {service-name}
  name: {service-name}
spec:
  # this will make the service a NodePort service
  type: NodePort
  selector:
    app: {name of your deployment's app tag}
  ports:
    - protocol: TCP
      # new -> this will be the port used to reach it from outside
      # if not specified, a random port will be used from a specific range (default: 30000-32767)
      nodePort: 32555
      port: 80
      targetPort: 8080
```

If you deploy this service, you should see something like this:

```
➜ ~ kubectl get services
NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
hello-world-service   NodePort    10.105.114.168   <none>        80:32555/TCP   10s
```

Then, find out what's your local cluster IP by using:

```
➜ ~ minikube ip
192.168.64.4
```

Then you can just navigate to `IP:PORT` (192.168.64.4:32555 based on the example values shown here) from your browser, and you should see the default web handler for your service!

## Next up

The next steps will cover exposing services via Ingresses and fancying up our deployments, adding rolling deployments, configMaps and secrets, so they become (almost) production ready.