import * as React from 'react';
import { RouteKind } from '../../k8s/types';
import { referenceFor } from '../../k8s/resources';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { RouteActionFactory } from '../creators/route-factory';

export const useRouteActionsProvider = (resource: RouteKind) => {
  const [kindObj, inFlight] = useK8sModel(
    referenceFor('route.openshift.io', 'v1', 'Route'),
  );

  const routeActions = React.useMemo(
    () => [RouteActionFactory.ViewRoute(kindObj, resource)],
    [kindObj, resource],
  );

  return [routeActions, !inFlight, undefined];
};
