# log-output

These instructions are for deploying the **log-output** and **ping-pong** applications on the Google Kubernetes Engine (GKE). To deploy them into a local `k3d` cluster instead, [follow the instructions here](./README-k3d.md).

---

First make sure the Kubernetes cluster is running on GKE and `kubectl` points to its context.

Initialize namespace in the cluster and apply the manifests with:

```bash
kubectl create namespace exercises && \
kubectl apply -f manifests-gke
```

To check that the pod is running all containers, use:

```bash
kubectl logs -f deployment/log-output-dep --all-containers=true --namespace=exercises
```

The logs should have printed `Server running at port 3000` and there should a stream of timestamps. The gateway setup may take a few minutes. Once it's ready, you can connect to the address that is printed with the following command. If it does not print an address, you need to wait and try again in a few minutes. And even when the IP is available, it might still say something like `fault filter abort` and take a while before it works.

```bash
echo http://$(kubectl get gateway | grep log-output-gateway | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}')
```

The endpoint displays the amount of pongs sent by **ping-pong** application along with timestamp-string header. If the application is not running, the page will display `<connection error>`. Route `/log` shows the temporary log file the pod creates.

**ping-pong** application is routed through the same gateway as **log-output**. As the route is defined in the manifests, accessing `/pingpong` without starting the application will print `unconditional drop overload`. The application can be started with:

```bash
kubectl apply -f ../ping-pong/manifests-gke
```

To check its status, use:

```bash
kubectl logs -f deployment/ping-pong-dep --namespace=exercises
```

At the moment file system is used as a seperate storage in case database connection is not available within reasonable delay after app starts. Logs will tell you where the information is stored. If the database connection is not established, you can try connecting again by restarting the deployment with:

```bash
kubectl rollout restart deployment/ping-pong-dep --namespace=exercises
```

Check its response at `/pingpong` route.
