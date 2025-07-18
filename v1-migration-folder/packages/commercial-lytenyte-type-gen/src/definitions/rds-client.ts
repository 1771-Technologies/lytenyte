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

export const ClientRowDataSourceParams: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ClientRowDataSourceParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  properties: [Data, TopData, BottomData, ReflectData],
};
