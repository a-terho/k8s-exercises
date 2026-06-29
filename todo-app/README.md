# todo-app

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.

Then with `kubectl` installed, create deployment with:

```bash
kubectl apply -f manifests/deployment.yml
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/todo-app-dep
```

Deployment manifest sets environment variable PORT to 3003.  
The logs should have printed: Server started in port 3003

Connect to it locally from [http://localhost:3003/](http://localhost:3003/) with:

```bash
kubectl port-forward deployment/todo-app-dep 3003:3003
```
