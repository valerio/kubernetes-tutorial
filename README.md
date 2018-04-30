# kubernetes-tutorial

A simple guide for running a local kubernetes cluster (using minikube), dockerizing and deploying a simple web application.

## Prerequisites

This tutorial assumes that the following tools are installed on the system:
- [minikube](https://github.com/kubernetes/minikube), for running a local kubernetes (k8s) cluster.
- a [virtualization driver](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md) for minikube (details in the minikube page).
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), for managing the cluster, can be installed via homebrew.
- [docker](https://www.docker.com/), for creating a containerized application.
- [node.js](https://nodejs.org/en/), version 8+, for running the sample application.

Any application that can be dockerized can be used for this tutorial, as long as the docker image is available.

## Setting up the cluster

Install a virtualization driver and minikube. Then run `minikube start`, it should look like this:

```
➜  ~ minikube start --vm-driver=hyperkit
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

Cluster is now ready to be used with `kubectl`. You can verify so by running:

```
➜  ~ kubectl get all
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   3m
```

You can also open the Kubernetes dashboard by running `minikube dashboard`, which will open a new browser window.

The Kubernetes dashboard gives information about the cluster at a quick glance, it also allows to run many of the actions that 
can be run via `kubectl`.