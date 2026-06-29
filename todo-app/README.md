# todo-app

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.  
Make sure that cluster exposes port 8080 that maps to port 80 for HTTP requests, like by using this command:

```bash
k3d cluster create --port 8080:80@loadbalancer --agents 2
```

Then with `kubectl` installed, apply all manifests (deployment, service and ingress) with:

```bash
kubectl apply -f manifests
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/todo-app-dep
```

Deployment manifest sets environment variable PORT to 3003.  
The logs should have printed: Server started in port 3003

Connect to the service locally from [http://localhost:8080/](http://localhost:8080/)
