# broadcaster

**broadcaster** is intermediary service that subscribes to NATS messages published by the **todo-backend** application and sends notifications to Telegram chat session using a custom bot. Tokens and ids are provided as secrets to the deployment. Application can also use Discord webhooks but this feature is currently disabled.

## Setup for GKE

Google Cloud Key Management Service (KMS) API must be enabled in the cluster.

Initialize NATS service in the cluster with the following commands. [`helm`](https://helm.sh/docs/intro/install/) needs to be installed.

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update
helm upgrade --install my-nats nats/nats \
  --namespace nats \
  --create-namespace \
  --set promExporter.enabled=true
```

Create encryption keys inside KSM using the following commands.

```bash
gcloud kms keyrings create broadcaster-secrets \
  --location=global

gcloud kms keys create sops-key \
  --location=global \
  --keyring=broadcaster-secrets \
  --purpose=encryption
```

For non-automated locally applied deployments [`sops`](https://getsops.io/docs/installation/) needs to be installed.

1. Authenticate locally with gcloud CLI using Application Default Credentials (ADC) and grant permissions for your account to use decryption keys in Google Cloud KMS.

```bash
gcloud auth application-default login

gcloud kms keys add-iam-policy-binding sops-key \
  --location=global \
  --keyring=broadcaster-secrets \
  --member="user:<YOUR-EMAIL-HERE>" \
  --role="roles/cloudkms.cryptoKeyDecrypter"
```

2. Create `.sops.yaml` file into current folder with following format. Replace `PROJECT_ID` with your project's ID.

```yaml
creation_rules:
  - path_regex: secret\.yml$
    gcp_kms: projects/PROJECT_ID/locations/global/keyRings/broadcaster-secrets/cryptoKeys/sops-key
```

3. Create `secret.yml` file into current folder in this format. Specify your own values for data fields. Field values need to be base64 encoded (can be done with `echo -n <text> | base64`).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: broadcaster-secret
  namespace: project
data:
  DISCORD_WEBHOOK:
  TELEGRAM_BOT_TOKEN:
  TELEGRAM_CHAT_ID:
```

4. Create encrypted version of the secrets file using Google KMS public keys. Optionally, delete the original file. `secret.yml` is added to `.gitignore`.

```bash
sops --encrypt secret.yml > manifests-gke/secret.enc.yml
rm secret.yml
```

In local workflow, manifests can be applied with this command:

```bash
sops --decrypt manifests-gke/secret.enc.yml > manifests-gke/secret.yml && kubectl apply -k . && rm manifests-gke/secret.yml
```
