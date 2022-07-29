# OpenShift Console Dynamic Plugin Demo

This project is a simple plugin we wrote to showcase our struggles with extending Route actions using the `console.action/resource-provider` extension point.
We have closely mirrored the structure of a static plugin ([console-app](https://github.com/openshift/console/tree/release-4.10/frontend/packages/console-app)) which adds such extension points to Deployments and DeploymentConfigs etc.

Refer to the [console-extensions.json](console-extensions.json)

## Local test

In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login`
2. `yarn run start-console`

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000/customization> to see the running plugin.

## Unexpected behavior

If you run this demo you will see an additional action appears for DeploymentConfigs [screenshot](deploymentconfig-actions.png) but not for routes [screenshot](route-actions.png).

We do understand that for OpenShift 4.10 dynamic console plugins have tech preview maturity. However we are still curious to hear whether there is something we are missing as to why routes wouldn't be supported as a target of the `console.action/resource-provider` extension point or whether dynamic plugins are just not there yet implementation wise.
