import {
  Action,
  K8sResourceCommon,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import { ResourceActionFactory } from './common-factory';

export const RouteActionFactory: ResourceActionFactory = {
  ViewRoute: (kind: K8sModel, obj: K8sResourceCommon): Action => ({
    id: 'view-route',
    label: 'view-route',
    cta: {
      href: `/k8s/ns/${obj.metadata.namespace}/routes/${obj.metadata.name}`,
    },
  }),
};
