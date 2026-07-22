# Grafana / Prometheus preparation

Use the following commands to prepare logging and monitoring within the cluster. [`helm`](https://helm.sh/docs/intro/install/) needs to be installed.

```bash
# Add required dependencies
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Create Helm releases
helm upgrade --install prom prometheus-community/prometheus \
  --create-namespace \
  --namespace monitoring \
  --values prom-values.yml

helm upgrade --install loki grafana/loki \
  --namespace monitoring \
  --values loki-values.yml

helm upgrade --install k8smon grafana/k8s-monitoring \
  --namespace monitoring \
  --values demok8smon-values.yml

helm upgrade --install grafana grafana/grafana \
  --namespace monitoring \
  --values grafana-values.yml
```

# PromQL

Answer for [exercise 4.3.](https://courses.mooc.fi/org/uh-cs/courses/devops-with-kubernetes-2026/chapter-5/update-strategies-and-prometheus#e9992e03-fa5f-43f7-9e04-45e60dfd1cf3) Using the following query finds all the StatefulSets in `monitoring` namespace as it is called in my cluster. Just replace `monitoring` with `prometheus` for similar effect.

![Query result](./prom_query.png)
