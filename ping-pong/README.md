These instructions are for deploying the **ping-pong** application on the Google Kubernetes Engine (GKE). To deploy both **log-output** and **ping-pong** into a local `k3d` cluster, [follow the instructions here](../log-output/).

---

First make sure the Kubernetes cluster is running on GKE and `kubectl` points to its context.

Initialize namespace in the cluster and apply the manifests with:

```bash
kubectl create namespace exercises && \
kubectl apply -f manifests-gke
```

To check application status, use:

```bash
kubectl logs -f deployment/ping-pong-dep --namespace=exercises
```

At the moment file system is used as a seperate storage in case database connection is not available within reasonable delay after app starts. Logs will tell you where the information is stored. If the database connection is not established, you can try connecting again by restarting the deployment with:

```bash
kubectl rollout restart deployment/ping-pong-dep --namespace=exercises
```

Check the application's response from address that is printed with this command. If it says `<pending>` you need to wait an try again.

```bash
echo http://$(kubectl get svc | grep ping-pong-svc | awk '{print $4}')
```
