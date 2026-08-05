# log-output

To run the application, make sure local `k3d` cluster is up and running and prepared properly. Make sure that cluster exposes port 8080 that maps to port 80 for HTTP requests. Also, as the cluster uses Istio and its implementation of Gateway API, the default `k3d` provided Traefik Ingress controller must to be disabled. Both `kubectl` and [`istioctl`](https://istio.io/latest/docs/ops/diagnostic-tools/istioctl) need to be installed. `k3s` image needs to be old enough (in this case v1.32.2) to support the `istioctl install` with `k3d`.

```bash
# Create k3d cluster
k3d cluster create k3s-istio --port 8080:80@loadbalancer --agents 2 --k3s-arg '--disable=traefik@server:*' --image docker.io/rancher/k3s:v1.32.2-k3s1

# Enable Gateway API in the cluster
kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.5.1/experimental-install.yaml

# Install Istio in ambient into the k3d cluster
istioctl install --set profile=ambient --set values.global.platform=k3d
```

Initialize namespace in your `k3d` cluster and apply the manifests (deployment, service and gateway) with:

```bash
kubectl create namespace exercises && \
kubectl apply -f manifests
```

To check that the pod is running all containers, use:

```bash
kubectl logs -f deployment/log-output-dep --all-containers=true --namespace=exercises
```

The logs should have printed `Server running at port 3000` and there should a stream of timestamps. The endpoint displays the amount of pongs sent by **ping-pong** application along with timestamp-string header and values loaded from ConfigMaps. If the **ping-pong** is not running, the page will display `<service unavailable>`. [http://localhost:8080/log](http://localhost:8080/log) shows the temporary log file the pod creates.

---

**ping-pong** application shares the same gateway as **log-output**. The application can be started with:

```bash
kubectl apply -f ../ping-pong/manifests
```

To check its status, use:

```bash
kubectl logs -f deployment/ping-pong-dep --namespace=exercises
```

Check its response from [http://localhost:8080/pingpong](http://localhost:8080/pingpong).

**ping-pong** application currently responds to any GET request under `http://localhost:8080/pingpong` subroutes due to splat route handling in the backend code. Current configuration maps `/pingpong` route prefix to `/` for the backend. That is why you can access the `/pings` route at [http://localhost:8080/pingpong/pings](http://localhost:8080/pingpong/pings) which was originally meant to be accessed only within Kubernetes cluster. You can also access [http://localhost:8080/pingpong/readyz](http://localhost:8080/pingpong/readyz) to see whether database is running (is should print `ok`).

If the database connection is not for some reason established, you can try connecting again by restarting the deployment with:

```bash
kubectl rollout restart deployment/ping-pong-dep --namespace=exercises
```
