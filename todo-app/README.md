# todo-app

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.  
Make sure that cluster exposes port 8080 that maps to port 80 for HTTP requests, like by using this command:

```bash
k3d cluster create --port 8080:80@loadbalancer --agents 2
```

In addition with `kubectl` installed, initialize local persistent volume in your `k3d` cluster with:

```bash
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/volume1/todo-app
kubectl apply -f ../pvs
```

Then, apply all manifests (deployment, service and ingress) with:

```bash
kubectl apply -f manifests
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/todo-app-dep
```

The logs should have printed:

```plaintext
▲ Next.js *.*.*
- Local:         http://localhost:3000
- Network:       http://0.0.0.0:3000
✓ Ready in *ms
```

Connect to the service locally from [http://localhost:8080/](http://localhost:8080/)
