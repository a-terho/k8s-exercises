# todo-app

To run the application, make sure the Kubernetes cluster (like local `k3d` cluster) is up and running.  
Make sure that cluster exposes port 8080 that maps to port 80 for HTTP requests and has access to `/tmp/volume1` folder, like by using these commands:

```bash
k3d cluster create --port 8080:80@loadbalancer --agents 2 && \
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/volume1/todo-app && echo 'Created!'
```

In addition with `kubectl` installed, initialize namespace and local persistent volume in your `k3d` cluster with:

```bash
kubectl create namespace project && \
kubectl apply -f ../pvs && kubectl apply -f ../pvcs/project.yml
```

Then, apply all manifests (deployment, service and ingress) with:

```bash
kubectl apply -f manifests
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

Connect to the service locally from [http://localhost:8080/](http://localhost:8080/)

The app receives todos from **todo-backend** service which needs to be started seperately. Otherwise app will display error messages about service not being available and will not work properly. To start the service, use:

```bash
kubectl apply -f ../todo-backend/manifests
```

To check that the service is running, use:

```bash
kubectl logs -f deployment/todo-backend-dep --namespace=project
```

The logs should say: `Server running at http://localhost:3000`. Database might not be reachable immediately. The backend runs database migrations as a seperate job. You can check whether migrations ran successfully from the logs with the following command. Todo list functionality is not available before that.

```bash
kubectl logs -f jobs/db-migrate --all-containers --namespace=project
```

By default, a cronjob will post a new todo list item automatically every hour if the backend service is available. To access the backend enpoint locally at http://localhost:3001/todos, use port forwarding:

```bash
kubectl port-forward --namespace project svc/todo-backend-svc 3001:1234
```

Dropping database connection can be simulated by stopping the PostgreSQL StatefulSet resource.

```bash
kubectl delete -f ../todo-backend/manifests/postgres-ss.yml
```
