# log-output

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.  
Make sure that cluster exposes port 8081 that maps to port 80 for HTTP requests, like by using this command:

```bash
k3d cluster create --port 8081:80@loadbalancer --agents 2
```

Then with `kubectl` installed, apply all manifests (deployment, service and ingress) with:

```bash
kubectl apply -f manifests
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/log-output-dep
```

Deployment manifest sets environment variable PORT to 3003.  
The logs should have printed: Server started in port 3003

Check the service status with from [http://localhost:8081/status](http://localhost:8081/status)

---

**ping-pong** application shares the same ingress as **log-output**. The application can be started with:

```bash
kubectl apply -f ../ping-pong/manifests
```

To check its status, use:

```bash
kubectl logs -f deployment/ping-pong-dep
```

Check its response from [http://localhost:8081/pingpong](http://localhost:8081/pingpong)
