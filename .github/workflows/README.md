# Automatic deployment to GKE

## Initialization

Run following commands to initialize permissions. Replace `PROJECT_ID` and `PROJECT_NUMBER` placeholders with whatever values `gcloud projects list` shows in corresponding columns for selected project.

Placeholder `ORG/REPO` should point to the GitHub repository (in my case `a-terho/k8s-exercises`).

```bash
# Create Service Account for GitHub Actions
gcloud iam service-accounts create "github-actions-sa" \
  --display-name="GitHub Actions SA"

# Give permissions to push Docker images to Artifact Registry
gcloud projects add-iam-policy-binding PROJECT_ID \
  --role="roles/artifactregistry.writer" \
  --member="serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com"

# Give permissions to apply manifests to Kubernetes cluster
gcloud projects add-iam-policy-binding PROJECT_ID \
  --role="roles/container.developer" \
  --member="serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com"

# Create Workload Identity Pool to allow remote service authentication to GCP
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create OICD Identity
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='ORG/REPO'" \ # change this to your repository
  --issuer-uri="https://token.actions.githubusercontent.com"

# Allow GitHub repository to impersonate as the Service Account
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/ORG/REPO" # change this to your repository

# Give nodes in the Kubernetes cluster read access to Artifact Registry
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.reader"
```

Following command should then show the permissions:

```bash
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:(serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com OR serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com)" \
  --format="table(bindings.members,bindings.role)"
```

## Repository setup

These are assumptions that workflows make about GKE cluster and Artifact Registry setup. If they differ, change the hard-coded values in both .yaml files.

- Cluster is created with name `dwk-cluster` to zone `europe-north1-b`
- Repository in the Artifact Registry is deployed to `europe-north1` region with name `docker-images`

Workflows use GitHub Actions Secrets that are scoped to environment called **GKE_PROJECT**  
Secrets are listed in GitHub repository **Settings** -> **Environments** -> **GKE_PROJECT**  
Following Secrets need to be defined. Replace placeholders accordingly.

- `GKE_PROJECT_ID`: `PROJECT_ID`
- `SERVICE_ACCOUNT`: github-actions-sa@`PROJECT_ID`.iam.gserviceaccount.com
- `WORKLOAD_IDENTITY_PROVIDER`: projects/`PROJECT_NUMBER`/locations/global/workloadIdentityPools/github-pool/providers/github-provider

## After deployment

Follow instructions in [todo-app](../../todo-app/) to check deployment status. All `kubectl apply` commands can be skipped as workflows will run them automatically.
