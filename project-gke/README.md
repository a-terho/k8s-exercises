# add project as ArgoCD app

This setup adds both staging and production deployments with their own namespaces to the cluster. Pushes to main branch of the Git repository are deployed to staging environment. Tagged releases are published to production environment.

First make sure the Kubernetes cluster is running on GKE and `kubectl` points to cluster context.

Add ArgoCD to the cluster:

```bash
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Add applications to the cluster with the following commands:

```bash
kubectl apply -f staging/application.yaml
kubectl apply -f production/application.yaml
```

The only additional resource that needs to be applied manually is the Secret manifest for the broadcaster resource. Follow the instructions in [brodcaster README.md](../broadcaster/README.md) to setup Google Cloud Key Management Service (KMS) and apply `secret.yml` file directly to the relevant namespace (`staging` or `production`) with `kubectl apply -f secret.yml --namespace=<namespace>`. Secret manifest file must not specify a namespace in order for this command to work properly.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: broadcaster-secret
  # no namespace here
data:
  DISCORD_WEBHOOK:
  TELEGRAM_BOT_TOKEN:
  TELEGRAM_CHAT_ID:
```

Add a way to access ArgoCD from outside the cluster (from the web interface or CLI) by exposing the service IP through LoadBalancer resouce. IP can be printed with the following command when it is available.

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

```bash
echo "http://$(kubectl get svc --namespace=argocd | grep "LoadBalancer" | awk '{print $4}')"
```

Login to ArgoCD. Default `admin` account password can be printed with this command:

```bash
kubectl get -n argocd secrets argocd-initial-admin-secret -o yaml | grep "password:" | awk '{print $2}' | base64 -d
```

In order for the automated workflow to work properly, reference [README.md file in the workflows folder](../../.github/workflows/README.md) for GKE initialization and repository setup. In addition, GitHub Actions permissions need to be changed under **Settings** -> **Actions** -> **General** -> **Workflow permissions** to **Read and write permissions**.
