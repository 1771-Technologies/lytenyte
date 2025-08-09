import type { InterfaceType, PropertyType } from "../+types";

const Data: PropertyType = {
  kind: "property",
  name: "data",
  optional: false,
  value: "T[]",
  tsDoc: `The primary dataset passed to LyteNyte Grid for display.`,
  doc: { en: `` },
};

const TopData: PropertyType = {
  kind: "property",
  name: "topData",
  optional: true,
  value: "T[]",
  tsDoc: `Rows to pin to the top of the grid, rendered above all scrollable rows.`,
  doc: { en: `` },
};

const BottomData: PropertyType = {
  kind: "property",
  name: "bottomData",
  optional: true,
  value: "T[]",
  tsDoc: `Rows to pin to the bottom of the grid, rendered below all scrollable rows.`,
  doc: { en: `` },
};

const ReflectData: PropertyType = {
  kind: "property",
  name: "reflectData",
  optional: true,
  value: "boolean",
  tsDoc: `If true, the data source will reflect external mutations to the original data array.`,
  doc: { en: `` },
};

const RowIdLeaf: PropertyType = {
  kind: "property",
  name: "rowIdLeaf",
  doc: { en: `` },
  tsDoc: `Callback to derive a unique id for each leaf row. Receives the row data and index.`,
  optional: true,
  value: "(d: RowLeaf<T>, i: number) => string",
};

const RowIdBranch: PropertyType = {
  kind: "property",
  name: "rowIdBranch",
  doc: { en: `` },
  tsDoc: `Callback to derive a unique id for grouped (branch) rows based on group value path.`,
  optional: true,
  value: "(path: string[]) => string",
};

const RowsPerPage: PropertyType = {
  kind: "property",
  name: "rowsPerPage",
  doc: { en: `` },
  tsDoc: `The number of rows to have per page. This will impact the total page count.`,
  optional: true,
  value: "number",
};

export const ClientRowDataSourceParams: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourceParams<T>",
  tsDoc: `
  Parameters required to initialize a client-side row data source.
  
  @group Row Data Source
  `,
  tag: "core",
  doc: { en: `` },
  properties: [Data, TopData, BottomData, ReflectData, RowIdBranch, RowIdLeaf],
};

export const ClientRowDataSourcePaginatedParams: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourcePaginatedParams<T>",
  tsDoc: `
  Parameters required to initialize a client-side row data source.
  
  @group Row Data Source
  `,
  tag: "core",
  doc: { en: `` },
  properties: [Data, TopData, BottomData, ReflectData, RowIdBranch, RowIdLeaf, RowsPerPage],
};

const TransformInFilterProp: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "transformInFilterItem",
  optional: true,
  tsDoc: `Callback that transforms a set of values for a given column into the in filter items LyteNyte Grid should use.`,
  value: "(params: { column: Column<T>, values: unknown[] }) => FilterInFilterItem[]",
};

export const ClientRowDataSourceParamsPro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourceParams<T>",
  tsDoc: `
  Enhanced parameters for a client-side row data source with additional filtering support.
  
  @group Row Data Source
  `,
  tag: "pro",
  doc: { en: `` },
  properties: [
    Data,
    TopData,
    BottomData,
    ReflectData,
    RowIdBranch,
    RowIdLeaf,
    TransformInFilterProp,
  ],
};

export const ClientRowDataSourcePaginatedParamsPro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourcePaginatedParams<T>",
  tsDoc: `
  Parameters required to initialize a client-side row data source.
  
  @group Row Data Source
  `,
  tag: "pro",
  doc: { en: `` },
  properties: [
    Data,
    TopData,
    BottomData,
    ReflectData,
    RowIdBranch,
    RowIdLeaf,
    TransformInFilterProp,
    RowsPerPage,
  ],
};

export const ClientTreeDataSourceParamsPro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientTreeDataSourceParams<T>",
  tsDoc: `
  Parameters for initializing a tree-structured data source in LyteNyte Grid.
  
  @group Row Data Source
  `,
  tag: "pro",
  doc: { en: `` },
  properties: [
    Data,
    TopData,
    BottomData,
    ReflectData,
    RowIdBranch,
    RowIdLeaf,
    TransformInFilterProp,
    {
      kind: "property",
      doc: { en: `` },
      name: "getPathFromData",
      optional: false,
      tsDoc: `Returns the hierarchical path to group a given data row in tree mode.`,
      value: "(data: RowLeaf<T>) => (string | null | undefined)[]",
    },
  ],
};
