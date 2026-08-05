# Demoing Istio with BookInfo app

These are instructions for preparing `k3d` cluster to work with Istio.

First install `istioctl` and create a `k3d` cluster with the following command. `k3s` image needs to be old enough (in this case v1.32.2) to support the `istioctl install` with `k3d`.

```bash
k3d cluster create k3s-istio --api-port 6550 --port '9080:80@loadbalancer' --port '9443:443@loadbalancer' --agents 2 --k3s-arg '--disable=traefik@server:*' --image docker.io/rancher/k3s:v1.32.2-k3s1

istioctl install --set profile=ambient --set values.global.platform=k3d
```

Then install Prometheus, Loki and Grafana into the cluster with [these instructions](../prometheus#grafana--prometheus-preparation). Istio should by default also install another Prometheus server alongside the BookInfo application.

Then follow the instructions in [Deploy a sample application](https://istio.io/latest/docs/ambient/getting-started/deploy-sample-app/) page. Manifest files used in the application are gathered into [manifests](./manifests) folder. The final cleanup can be simplified as so:

```bash
kubectl delete -f manifests
istioctl uninstall -y --purge
kubectl delete namespace istio-system
```
