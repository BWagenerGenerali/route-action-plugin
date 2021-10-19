import * as React from 'react';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreateDropdown,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  RowFilter,
  RowProps,
  TableColumn,
  TableData,
  VirtualizedTable,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { useHistory } from "react-router-dom";

type CustomizationResource = {
  spec?: {
    displayName?: string;
    description?: string;
    href?: string;
    text?: string;
    link?: {
      href?: string;
      text?: string;
    }
    location?: string;
  }
} & K8sResourceCommon;

const resources = [
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleCLIDownload',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleExternalLogLink',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleLink',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleNotification',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleQuickStart',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleYAMLSample',
  },
  {
    group: 'console.openshift.io',
    version: 'v1alpha1',
    kind: 'ConsolePlugin',
  },
];

// TODO: Use utility when available in the SDK.
const referenceFor = (group: string, version: string, kind: string) => `${group}~${version}~${kind}`;

const referenceForObj = (obj: K8sResourceCommon) => {
  const [group, version] = obj.apiVersion.split('/');
  return referenceFor(group, version, obj.kind);
};

const columns: TableColumn<CustomizationResource>[] = [
  {
    title: 'Name',
    id: 'name',
  },
  {
    title: 'Kind',
    id: 'kind',
  },
  {
    title: 'Display Name',
    id: 'displayName',
  },
  {
    title: 'Link',
    id: 'link',
  },
  {
    title: 'Location',
    id: 'location',
  },
];

const PodRow: React.FC<RowProps<CustomizationResource>> = ({ obj, activeColumnIDs }) => {
  const reference = referenceForObj(obj);
  const link = obj.spec?.link || obj.spec;
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind={reference} name={obj.metadata.name} namespace={obj.metadata.namespace} />
      </TableData>
     <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {obj.kind}
      </TableData>
     <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {obj.spec?.displayName || '-'}
      </TableData>
     <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {link?.href ? <a href={link.href}>{link.text || link.href}</a> : '-'}
      </TableData>
     <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        {obj.spec?.location || '-'}
      </TableData>
    </>
  );
};

export const filters: RowFilter[] = [
  {
    filterGroupName: 'Kind',
    type: 'kind',
    reducer: (obj: K8sResourceCommon) => obj.kind,
    filter: (input, obj: K8sResourceCommon) => {
      if (!input.selected?.length) {
        return true;
      }

      return input.selected.includes(obj.kind);
    },
    items: resources.map(({kind}) => ({ id: kind, title: kind })),
  },
];



type CustomizationTableProps = {
  data: any[];
  unfilteredData: any[];
  loaded: boolean;
  loadError?: any;
};

const CustomizationTable: React.FC<CustomizationTableProps> = ({ data, unfilteredData, loaded, loadError }) => {
  return (
    <VirtualizedTable<CustomizationResource>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={PodRow}
    />
  );
};

const CustomizationList: React.FC<{}> = () => {
  const history = useHistory();
  const watches = resources.map(({group, version, kind}) => {
    const [data, loaded, error] = useK8sWatchResource<CustomizationResource[]>({
      kind: referenceFor(group, version, kind),
      isList: true,
      namespaced: false,
    });
    if (error) {
      console.error('Could not load', kind, error);
    }
    return [data, loaded, error];
  });

  const flatData = watches.map(([list]) => list).flat();
  const loaded = watches.every(([, loaded, error]) => !!(loaded || error));
  const [data, filteredData, onFilterChange] = useListPageFilter(flatData, filters);
  const createItems = resources.reduce((acc, {group, version, kind}) => {
    acc[referenceFor(group, version, kind)] = kind;
    return acc;
  }, {});
  const onCreate = (reference: string) => {
    // TODO: Use utility when available in the SDK.
    // FIXME: This doesn't handle context roots.
    const path = `/k8s/cluster/${reference}/~new`;
    history.push(path);
  };
  return (
    <>
      <ListPageHeader title="Customization">
        <ListPageCreateDropdown items={createItems} onClick={onCreate}>Create</ListPageCreateDropdown>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          rowFilters={filters}
          onFilterChange={onFilterChange}
        />
        <CustomizationTable
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
        />
      </ListPageBody>
    </>
  );
};

export default CustomizationList;