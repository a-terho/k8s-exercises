# todo-app

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.

Then with `kubectl` installed, create deployment with:

```bash
kubectl create deployment todo-app-dep --image=alterho/todo-app:1.2
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/todo-app-dep
```

The logs should have printed by default: Server started in port 3000
