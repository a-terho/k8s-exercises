These instructions are for deploying the **ping-pong** application on the Google Kubernetes Engine (GKE). To deploy both **log-output** and **ping-pong** into a local `k3d` cluster, [follow the instructions here](../log-output/).

---

First make sure the Kubernetes cluster is running on GKE and `kubectl` points to its context.

Initialize namespace in the cluster and apply the manifests with:

```bash
kubectl create namespace exercises && \
kubectl apply -k . && \
kubectl apply -f loadbalancer.yml
```

To check application status, use:

```bash
kubectl logs -f deployment/ping-pong-dep --namespace=exercises
```

Check the application's address that is printed with this command. If it says `<pending>` you need to wait and try again.

```bash
echo http://$(kubectl get svc --namespace=exercises | grep ping-pong-svc | awk '{print $4}')
```

By default, applying the kustomization does not start the database service. The application is unreachable if the database is not available. In order to actually reach the page, you need to also start the database with:

```bash
kubectl apply manifests-gke/postgres-ss.yml
```

For any consecutive new release, a canary rollout will take place. Analysis is done right after the deployment and if the CPU usage rate sum over 5 minutes gets too high, the rollout will be cancelled and the update is reverted.
