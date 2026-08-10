# ping-pong as a Knative Service

Follow the instruction in [knative-demo folder](../knative-demo#section-1-prepare-knative) to prepare Knative in the `k3d` cluster.

Then deploy **ping-pong** application.

```bash
kubectl create namespace exercises && \
kubectl apply -f manifests-knative

# Check the service is running
kubectl get ksvc --namespace=exercises
```

Connect to it at [http://ping-pong-svc.exercises.127.0.0.1.sslip.io](http://ping-pong-svc.exercises.127.0.0.1.sslip.io).

Observe autoscaling in action while accessing the page.

```bash
kubectl get pods -l serving.knative.dev/service=ping-pong-svc --namespace=exercises --watch
```
