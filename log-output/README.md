# log-output

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.  
Make sure that cluster exposes port 8081 that maps to port 80 for HTTP requests and has access to `/tmp/volume1` folder, like, by using these commands:

```bash
k3d cluster create --port 8081:80@loadbalancer --agents 2 && \
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/volume1/ping-pong && echo 'Created!'
```

In addition with `kubectl` installed, initialize namespace and local persistent volume in your `k3d` cluster with:

```bash
kubectl create namespace exercises && \
kubectl apply -f ../pvs && kubectl apply -f ../pvcs/exercises.yml
```

Then, apply all manifests (deployment, service and ingress) with:

```bash
kubectl apply -f manifests
```

To check that the pod is running all containers, use:

```bash
kubectl logs -f deployment/log-output-dep --all-containers=true --namespace=exercises
```

The logs should have printed: "Server started in port 3000" and there should a stream of timestamps.

Show the temporary log file the pod creates at [http://localhost:8081/log](http://localhost:8081/log)

Path [http://localhost:8081/](http://localhost:8081/) displays the amount of pongs sent by **ping-pong** application along with timestamp-string header. If the application is not running, the page will display `<service unavailable>`.

---

**ping-pong** application shares the same ingress as **log-output**. The application can be started with:

```bash
kubectl apply -f ../ping-pong/manifests
```

To check its status, use:

```bash
kubectl logs -f deployment/ping-pong-dep --namespace=exercises
```

Check its response from [http://localhost:8081/pingpong](http://localhost:8081/pingpong)
