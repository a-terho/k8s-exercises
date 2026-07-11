# todo-app

These instructions are for deploying the application on the Google Kubernetes Engine (GKE). To deploy it into a local `k3d` cluster instead, [follow the instructions here](./README-k3d.md).

---

First make sure the Kubernetes cluster is running on GKE and `kubectl` points to its context. Then apply manifests from the `kustomization.yaml` file with:

```bash
kubectl apply -k .
```

To check that the pod is running, use:

```bash
kubectl logs -f deployment/todo-app-dep --namespace=project
```

The logs should have printed:

```plaintext
▲ Next.js *.*.*
- Local:         http://localhost:3000
- Network:       http://0.0.0.0:3000
✓ Ready in *ms
```

The ingress setup may take up to 10 minutes. Once it's ready, you can connect to the address that is printed with the following command. If it does not print an address, you need to wait and try again in a few minutes. And even when the IP is available, it might still take a while before it works.

```bash
echo http://$(kubectl get ing | grep todo-app-ingress | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}')
```

The app receives todos from **todo-backend** service which needs to be started seperately. Otherwise app will display error messages about service not being available and will not work properly. To start the service, use:

```bash
kubectl apply -k ../todo-backend
```

Please note that **todo-backend** does not initialize the namespace it uses. This is not an issue when **todo-app** is started first. To check that the service is running, use:

```bash
kubectl logs -f deployment/todo-backend-dep --namespace=project
```

The logs should say: `Server running at http://localhost:3000`. Database might not be reachable immediately. The backend runs database migrations as a seperate job. You can check whether migrations ran successfully from the logs with the following command. Todo list functionality is not available before that.

```bash
kubectl logs -f jobs/db-migrate --all-containers --namespace=project
```

By default, a cronjob will post a new todo list item automatically every hour if the backend service is available. Backend enpoint is only available within the Kubernetes cluster. To access the backend enpoint locally at http://localhost:3001/todos, use port forwarding:

```bash
kubectl port-forward --namespace project svc/todo-backend-svc 3001:1234
```

Dropping database connection can be simulated by stopping the PostgreSQL StatefulSet resource.

```bash
kubectl delete -f ../todo-backend/manifests-gke/postgres-ss.yml
```
