# log-output

These instructions are for deploying the **log-output** and **ping-pong** applications on the Google Kubernetes Engine (GKE). To deploy them into a local `k3d` cluster instead, [follow the instructions here](./README-k3d.md).

To see how to setup deployment system using ArgoCD, check [argocd](./argocd/) folder.

---

First make sure the Kubernetes cluster is running on GKE, Gateway API is enabled in the cluster and `kubectl` points to cluster context.

Initialize namespace in the cluster and apply the manifests with:

```bash
kubectl create namespace exercises && \
kubectl apply -k .
```

To check that the pods are running all containers, use:

```bash
kubectl logs -f deployment/log-output-dep --all-containers=true --namespace=exercises
```

The logs should have printed `Server running at port 3000` and there should a stream of timestamps. The endpoint displays the amount of pongs sent by **ping-pong** application along with timestamp-string header. Route `/log` shows the temporary log file the pod creates.

The gateway setup may take a few minutes. Once it's ready, you can connect to the address that is printed with the following command. If it does not print an address, you need to wait and try again in a few minutes. And even when the IP is available, it might still say something like `fault filter abort` and take a while before it works. **ping-pong** application is routed through the same gateway as **log-output**. With the current configuration, the endpoint is not marked ready if the **ping-pong** application is not available. This could cause the endpoint not to be reachable in some clusters even when the app is otherwise working properly (debug readiness probe with `kubectl describe pods/log-output-dep-<pod id>`). GKE Gateway API, however, does not acknowledge this readiness probe when routing traffic.

```bash
echo http://$(kubectl get gateway --namespace=exercises | grep log-output-gateway | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}')
```

If **ping-pong** application is not ready, the page will display `<connection error>`. The application can be started with:

```bash
kubectl apply -k ../ping-pong
```

To check its status, use:

```bash
kubectl logs -f -l app=ping-pong --all-containers=true --namespace=exercises
```

By default, applying the kustomization does not start the database service. The application will work but it does not persist data before starting the database. The endpoint will only display what is saved into RAM. The database can be started with:

```bash
kubectl apply -f ../ping-pong/manifests-gke/postgres-ss.yml
```

**ping-pong** application currently responds to any GET request under `/pingpong` subroutes due to splat route handling in the backend code. Current configuration maps `/pingpong` route prefix to `/` for the backend. That is why you can access the `/pings` route at `/pingpong/pings` which was originally meant to be accessed only within Kubernetes cluster. To actually check the readiness on the backend, you can access `/pingpong/readyz` which will print `ok` when the database is running.

GKE sends a lot of internal health check requests to `/` endpoints which will increase the ping count continously and thus will flood the request log. You can check that your requests are mapped correctly by accessing ie. `/pingpong/asd` which should print `GET /asd pong *` to the logs.
