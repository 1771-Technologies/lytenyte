import type { InterfaceType, PropertyType } from "../+types";

const FieldForColumn: PropertyType = {
  kind: "property",
  name: "fieldForColumn",
  tsDoc: ``,
  value: "(columnOrId: string | Column<T>, data: T | Record<string, unknown>) => unknown",
  doc: { en: `` },
  optional: false,
};

export const GridApi: InterfaceType = {
  kind: "interface",
  name: "GridApi<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [FieldForColumn],
};
