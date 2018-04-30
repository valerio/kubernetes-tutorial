# 01 - Running your first Pod

Once the cluster is ready, you can run any docker image by executing:

```
kubectl run <name> --image=<image-name>
```

For example, running an nginx image is as simple as this:

```
➜  ~ kubectl run nginx-pod --image=nginx
deployment.apps "nginx-pod" created
```

You can then verify it is running via the dashboard, or with kubectl:

```
➜  ~ kubectl get all
NAME                             READY     STATUS    RESTARTS   AGE
pod/nginx-pod-5f885d67ff-nbg2q   1/1       Running   0          10s

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   23m

NAME                        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-pod   1         1         1            1           10s

NAME                                   DESIRED   CURRENT   READY     AGE
replicaset.apps/nginx-pod-5f885d67ff   1         1         1         10s
```

You can interact with your newly created Pod (and deployment/replicaset) via `kubectl`, some things you can try out:

- Read logs from the container (stdout)
- Execute commands inside the pod (e.g. you can run a bash shell via `kubectl exec -it <pod> /bin/bash`)
- Scale up (or down) the number of replicas in the deployment
- Deploy a few different public images
- Experiment by editing the deployment on the fly (via the kubernetes dashboard)


## Cleaning up

The deployment (and all pods related to it) can be deleted via:

```
➜  ~ kubectl delete deployment nginx-pod
deployment.extensions "nginx-pod" deleted
```

**Important**: deleting a *deployment* will completely remove your application from the cluster, while deleting a *pod* will cause the cluster to restart it, according to the number of replicas desired/available.

## Next step

Creating a new deployment and pods is pretty easy, but these are actually only visible to containers inside of the cluster. The next step will be exposing your containers by using Services.