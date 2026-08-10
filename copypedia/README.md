# copypedia

Copypedia uses Kubernetes init containers and sidecar containers to update the single HTML file that `nginx` serves. The page is exposed through a LoadBalancer service from port 80. Depending on the cluster setup it can be accessed from an external IP or directly with port forwarding:

```bash
kubectl port-forward svc/copypedia 3000:80
```

Follow the updates of the sidecar container from the logs. It shows how long the sidecar sleeps and when it fetches a new page.

```bash
kubectl logs -f deployment/copypedia-dep --container=sidecar-get-random-page
```
