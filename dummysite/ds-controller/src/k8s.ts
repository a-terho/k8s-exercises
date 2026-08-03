import {
  KubeConfig,
  CoreV1Api,
  AppsV1Api,
  CustomObjectsApi,
} from '@kubernetes/client-node';

// Initialize kubeconfig
export const kubeConfig = new KubeConfig();
kubeConfig.loadFromDefault();

// Initialize Kubernetes API clients
export const coreApiClient = kubeConfig.makeApiClient(CoreV1Api);
export const appApiClient = kubeConfig.makeApiClient(AppsV1Api);
export const crApiClient = kubeConfig.makeApiClient(CustomObjectsApi);
