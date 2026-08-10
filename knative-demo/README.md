# Knative

## Section 1: Prepare Knative

Rundown of preparation steps for [exercise 5.6](https://courses.mooc.fi/org/uh-cs/courses/devops-with-kubernetes-2026/chapter-6/beyond-kubernetes#eed28841-4bc5-5f24-a96f-fdefe99a092f).

Prepare `k3d` cluster. Notice port forwarding from localhost:80 to loadbalancer:80.

```bash
k3d cluster create knative --port 8082:30080@agent:0 -p 80:80@loadbalancer --agents 2 --k3s-arg "--disable=traefik@server:0" --image rancher/k3s:v1.34.1-k3s1
```

Install Knative Serving.

```bash
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.23.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.23.0/serving-core.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.23.0/serving-hpa.yaml
```

Install Kourier as the ingress controller.

```bash
kubectl apply -f https://github.com/knative-extensions/net-kourier/releases/download/knative-v1.23.0/kourier.yaml

# Patch Knative Serving to use Kourier
kubectl patch configmap/config-network \
--namespace knative-serving \
--type merge \
--patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

Verify installation. Everything should be `Running`.

```bash
kubectl get pods -n knative-serving
```

Add MagicDNS from sslip.io.

```bash
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.23.0/serving-default-domain.yaml
```

Configure localhost (127.0.0.1) as a MacigDNS domain.

```bash
kubectl patch configmap config-domain \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"127.0.0.1.sslip.io":""}}'
```

## Section 2: Deploy application

Deploy sample application.

```bash
kubectl apply -f hello.yaml

# Check the service is running
kubectl get ksvc
```

Connect to it at [http://hello.default.127.0.0.1.sslip.io](http://hello.default.127.0.0.1.sslip.io).

Observe autoscaling in action while accessing the page.

```bash
kubectl get pods -l serving.knative.dev/service=hello --watch
```

Update the app with new deployment with traffic split between two revisions.

```bash
kubectl apply -f hello2.yaml

# Check revisions
kubectl get revisions
```
