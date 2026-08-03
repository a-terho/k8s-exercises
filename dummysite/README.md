# DummySite

To initialize DummySite custom resource definition, apply all the manifests to the cluster in `manifests` folder with the following command. LoadBalancer service is used to provide an external IP to the cluster for each new site. `ds-controller` is the custom controller that uses Kubernetes **Informer** object to listen to when new DummySite objects are created, modified or deleted and it spins up the required Kubernetes resources.

```bash
kubectl apply -k .
```

Create two new DummySites with:

```bash
kubectl apply -f dummysite-docker.yml
kubectl apply -f dummysite-kubernetes.yml
```

Find the external IPs for LoadBalancers with:

```bash
kubectl get svc
```
