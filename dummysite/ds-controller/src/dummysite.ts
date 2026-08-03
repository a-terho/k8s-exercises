import { coreApiClient, appApiClient } from './k8s.ts';
import {
  ApiException,
  type KubernetesObject,
  type V1OwnerReference,
} from '@kubernetes/client-node';
import {
  buildConfigMap,
  buildDeployment,
  buildLoadBalancer,
} from './resources.ts';
import type { DummySite } from './types.ts';

const buildNames = (ds: DummySite) => {
  const base = ds.metadata.name;
  return {
    configMapName: `${base}-config`,
    deploymentName: `${base}-dep`,
    serviceName: `${base}-svc`,
  };
};

// owner references are used to resources get deleted when the parent gets deleted
function buildOwnerReference(ds: DummySite): V1OwnerReference {
  return {
    apiVersion: ds.apiVersion,
    kind: ds.kind,
    name: ds.metadata.name,
    uid: ds.metadata.uid,
    controller: true,
    blockOwnerDeletion: true,
  };
}

// upsert creates the resouce if it doesn't exist and updates it otherwise
const upsert = async <T extends KubernetesObject>(
  createFn: () => Promise<T>,
  getFn: () => Promise<T>,
  replaceFn: (resourceVersion: string | undefined) => Promise<T>,
) => {
  try {
    await createFn();
  } catch (err) {
    // If the resource already exists, it throws HTTP status 409
    // In order for update to work, Kubenetes expect to get latest
    // resourceVersion along with the requests so that it is accepted
    if (err instanceof ApiException && err.code === 409) {
      const prev = await getFn();
      await replaceFn(prev.metadata?.resourceVersion);
    }
  }
};

export const prepareDummySite = async (ds: DummySite) => {
  const response = await fetch(ds.spec.website_url);
  const html = await response.text();

  console.log(ds);

  const namespace = ds.metadata.namespace;
  const names = buildNames(ds);
  const ownerReference = buildOwnerReference(ds);

  // TODO: This is not created in the cluster properly?
  // First, generate the HTML file for the deployment
  const configMap = buildConfigMap(namespace, names, ownerReference, html);
  await upsert(
    () =>
      coreApiClient.createNamespacedConfigMap({
        namespace,
        body: configMap,
      }),
    () =>
      coreApiClient.readNamespacedConfigMap({
        namespace,
        name: names.configMapName,
      }),
    (resourceVersion) => {
      return coreApiClient.replaceNamespacedConfigMap({
        namespace,
        name: names.configMapName,
        body: {
          ...configMap,
          metadata: {
            ...configMap.metadata,
            resourceVersion,
          },
        },
      });
    },
  );

  // Second, generate a deployment using nginx to serve the HTML
  const deployment = buildDeployment(namespace, names, ownerReference);
  await upsert(
    () =>
      appApiClient.createNamespacedDeployment({
        namespace,
        body: deployment,
      }),
    () =>
      appApiClient.readNamespacedDeployment({
        namespace,
        name: names.deploymentName,
      }),
    (resourceVersion) =>
      appApiClient.replaceNamespacedDeployment({
        namespace,
        name: names.deploymentName,
        body: {
          ...deployment,
          metadata: {
            ...deployment.metadata,
            resourceVersion,
          },
        },
      }),
  );

  // Third, create a LoadBalancer service to allow users to reach the HTML page
  const loadBalancer = buildLoadBalancer(namespace, names, ownerReference);
  await upsert(
    () =>
      coreApiClient.createNamespacedService({
        namespace,
        body: loadBalancer,
      }),
    () =>
      coreApiClient.readNamespacedService({
        namespace,
        name: names.serviceName,
      }),
    (resourceVersion) =>
      coreApiClient.replaceNamespacedService({
        namespace,
        name: names.serviceName,
        body: {
          ...loadBalancer,
          metadata: {
            ...loadBalancer.metadata,
            resourceVersion,
          },
        },
      }),
  );
};
