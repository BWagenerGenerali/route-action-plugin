import {
  Action,
  K8sResourceCommon,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export type ResourceActionCreator = (
  kind: K8sModel,
  obj: K8sResourceCommon,
  relatedResource?: K8sResourceCommon,
) => Action;

export type ResourceActionFactory = { [name: string]: ResourceActionCreator };
