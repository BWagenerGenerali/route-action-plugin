import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export type RouteKind = {
  spec: {
    host: string;
  };
} & K8sResourceCommon;
