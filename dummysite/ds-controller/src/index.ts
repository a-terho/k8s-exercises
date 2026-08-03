import { makeInformer } from '@kubernetes/client-node';
import { kubeConfig, crApiClient } from './k8s.ts';
import { prepareDummySite } from './dummysite.ts';
import type { DummySite } from './types.ts';

const apiGroup = 'dwk.stable';
const crdVersion = 'v1';
const crdPlural = 'dummysites';
const DS_WATCH_PATH = `/apis/${apiGroup}/${crdVersion}/${crdPlural}`;

const listDummySites = () => {
  return crApiClient.listClusterCustomObject({
    group: apiGroup,
    version: crdVersion,
    plural: crdPlural,
  });
};

// Add a listener (informer) for events on DummySite API endpoint
const main = async () => {
  const informer = makeInformer<DummySite>(
    kubeConfig,
    DS_WATCH_PATH,
    listDummySites,
  );

  informer.on('add', async (ds) => {
    console.log(`[event] add ${ds.metadata?.namespace}/${ds.metadata?.name}`);
    await prepareDummySite(ds);
  });

  informer.on('update', async (ds) => {
    console.log(
      `[event] update ${ds.metadata?.namespace}/${ds.metadata?.name}`,
    );
    await prepareDummySite(ds);
  });

  informer.on('delete', (ds) => {
    console.log(
      `[event] delete ${ds.metadata?.namespace}/${ds.metadata?.name}`,
    );
  });

  informer.on('error', (err) => {
    console.log('[error] DummySite informer error:', err);
  });

  await informer.start();
  console.log(`Watching ${DS_WATCH_PATH} for DummySite object events`);
};

try {
  main();
} catch (err) {
  console.log('Fatal error when starting DummySite controller', err);
  process.exit(1);
}
