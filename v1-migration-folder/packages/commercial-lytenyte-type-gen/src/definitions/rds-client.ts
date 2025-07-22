import type { InterfaceType, PropertyType } from "../+types";

const Data: PropertyType = {
  kind: "property",
  name: "data",
  optional: false,
  value: "T[]",
  tsDoc: ``,
  doc: { en: `` },
};

const TopData: PropertyType = {
  kind: "property",
  name: "topData",
  optional: true,
  value: "T[]",
  tsDoc: ``,
  doc: { en: `` },
};

const BottomData: PropertyType = {
  kind: "property",
  name: "bottomData",
  optional: true,
  value: "T[]",
  tsDoc: ``,
  doc: { en: `` },
};

const ReflectData: PropertyType = {
  kind: "property",
  name: "reflectData",
  optional: true,
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
};

const RowIdLeaf: PropertyType = {
  kind: "property",
  name: "rowIdLeaf",
  doc: { en: `` },
  tsDoc: ``,
  optional: true,
  value: "(d: RowLeaf<T>, i: number) => string",
};
const RowIdBranch: PropertyType = {
  kind: "property",
  name: "rowIdBranch",
  doc: { en: `` },
  tsDoc: ``,
  optional: true,
  value: "(path: string[]) => string",
};

export const ClientRowDataSourceParams: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourceParams<T>",
  tsDoc: ``,
  tag: "core",
  doc: { en: `` },
  properties: [Data, TopData, BottomData, ReflectData, RowIdBranch, RowIdLeaf],
};

export const ClientRowDataSourceParamsPro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourceParams<T>",
  tsDoc: ``,
  tag: "pro",
  doc: { en: `` },
  properties: [
    Data,
    TopData,
    BottomData,
    ReflectData,
    RowIdBranch,
    RowIdLeaf,
    {
      kind: "property",
      doc: { en: `` },
      name: "transformInFilterItem",
      optional: true,
      tsDoc: ``,
      value: "(params: { field: unknown, column: Column<T> }) => FilterInFilterItem",
    },
  ],
};
