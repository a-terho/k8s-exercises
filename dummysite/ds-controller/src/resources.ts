import type {
  V1ConfigMap,
  V1Deployment,
  V1OwnerReference,
  V1Service,
} from '@kubernetes/client-node';

interface Names {
  configMapName: string;
  deploymentName: string;
  serviceName: string;
}

export const buildConfigMap = (
  namespace: string,
  names: Names,
  ownerReference: V1OwnerReference,
  html: string,
): V1ConfigMap => {
  return {
    metadata: {
      name: names.configMapName,
      namespace,
      ownerReferences: [ownerReference],
    },
    data: { 'index.html': html },
  };
};

export const buildDeployment = (
  namespace: string,
  names: Names,
  ownerReference: V1OwnerReference,
): V1Deployment => {
  const labels = { app: names.deploymentName };
  return {
    metadata: {
      name: names.deploymentName,
      namespace,
      ownerReferences: [ownerReference],
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: labels },
      template: {
        metadata: { labels },
        spec: {
          containers: [
            {
              name: 'nginx',
              image: 'nginx:alpine',
              volumeMounts: [
                {
                  name: 'html',
                  mountPath: '/usr/share/nginx/html',
                  readOnly: true,
                },
              ],
            },
          ],
          volumes: [
            {
              name: 'html',
              configMap: { name: names.configMapName },
            },
          ],
        },
      },
    },
  };
};

export const buildLoadBalancer = (
  namespace: string,
  names: Names,
  ownerReference: V1OwnerReference,
): V1Service => {
  const labels = { app: names.deploymentName };
  return {
    metadata: {
      name: names.serviceName,
      namespace,
      ownerReferences: [ownerReference],
    },
    spec: {
      selector: labels,
      type: 'LoadBalancer',
      ports: [
        {
          name: 'http',
          protocol: 'TCP',
          port: 80,
          targetPort: 80,
        },
      ],
    },
  };
};
