# 0x Running your own Docker image

Minikube (and kubernetes) automatically uses dockerHub to pull docker images for deployments. Of course, you can always build and deploy a local/custom built image. This step details how.


## Setup

Make sure that Docker is installed on your system.

Minikube uses its own docker engine to pull images, which means that images built locally won't be available to it.
You can make your local docker build for minikube's engine by running the following in a terminal:

```
    eval $(minikube docker-env)
```

**Note**: this needs to be run every time you open a new terminal, it will set some environment variables needed to make your local docker talk to minikube's docker.

## Build the image

Once your docker is setup, head over to the directory containing the Dockerfile you want to build (the one provided in this repo can be used as a working example).

In the same terminal window where you set up the docker-env, run: 

```
    docker build . -t <image-name>:<tag>
```

**Note**: It's recommended to provide a tag like so: `helloworld-app:1.0`. This way, updating the deployment will be clearer!

## Deploy your application

The default option for deploying via kubectl will try to always pull the image from the internet. That's a good general behaviour for real-world deployments, but in our case, we want to make sure to use our own locally built and available image.

Fill in the fields surrounded by {} and save the following snippet as a yaml file: 

```
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: {app-name}
  namespace: default
spec:
  replicas: 1
  template:
    metadata:
      labels:
        # you can specify any labels you want here
        app: {app-name}
    spec:
      containers:
      - name: {app-name}
        # image must be the same as you built before (name:tag)
        image: {image-name:image-tag}
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        imagePullPolicy: Never
      terminationGracePeriodSeconds: 60
```

You can run the yaml file directly from the dashboard or by running:

```
kubectl apply -f <filename>
```

You can edit the deployment by changing the yaml file and applying it again, alternatively, it can be edited on the fly via the dashboard, kubernetes will take care to deploy the relevant changes.

Finally, the deployment can be permanently deleted by using `kubectl delete -f <filename>`.

## Next step

Creating a new deployment and pods is pretty easy, but these are actually only visible to containers inside of the cluster. The next step will be exposing your containers by using Services.
