# log-output

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.

Then with `kubectl` installed, create deployment with:

```bash
kubectl create deployment log-output-dep --image=alterho/log-ouput
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/log-output-dep
```
