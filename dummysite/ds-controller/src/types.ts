export interface DummySite {
  apiVersion: string;
  kind: string;
  metadata: {
    annotations?: { [key: string]: string };
    creationTimestamp: Date;
    generation: number;
    managedFields?: Array<object>;
    name: string;
    namespace: string;
    resourceVersion: string;
    uid: string;
  };
  spec: DummySiteSpec;
}

export interface DummySiteSpec {
  website_url: string;
}
