import type { InterfaceType, PropertyType, UnionType } from "../+types.js";

export const ColumnPin: UnionType = {
  kind: "union",
  name: "ColumnPin",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ['"start"', '"end"', "null"],
};

export const ColumnMeta: InterfaceType = {
  kind: "interface",
  name: "ColumnMeta",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "columnsVisible",
      value: "Column[]",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnLookup",
      value: "Map<string, Column>",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};

/**
 * COLUMN DEFINITION
 */

const hide: PropertyType = {
  kind: "property",
  name: "hide",
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};

const id: PropertyType = {
  kind: "property",
  name: "id",
  value: "string",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};
const width: PropertyType = {
  kind: "property",
  name: "width",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const widthMax: PropertyType = {
  kind: "property",
  name: "widthMax",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const widthMin: PropertyType = {
  kind: "property",
  name: "widthMin",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const widthFlex: PropertyType = {
  kind: "property",
  name: "widthFlex",
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
};
const columnPin: PropertyType = {
  kind: "property",
  name: "pin",
  value: "ColumnPin",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
};
const columnGroupVisibility: PropertyType = {
  kind: "property",
  name: "groupVisibility",
  value: "ColumnGroupVisibility",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
};
export const columnGroupPath: PropertyType = {
  kind: "property",
  name: "groupPath",
  value: "string[]",
  optional: true,
  tsDoc: ``,
  doc: { en: `` },
};

export const ColumnCore: InterfaceType = {
  kind: "interface",
  export: true,
  name: "Column",
  tag: "core",
  tsDoc: ``,
  doc: {
    en: ``,
  },
  properties: [
    id,
    hide,
    width,
    widthMax,
    widthMin,
    widthFlex,
    columnPin,
    columnGroupVisibility,
    columnGroupPath,
  ],
};

export const ColumnBaseCore: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnBase",
  tag: "core",
  properties: [hide, width, widthMax, widthMin, widthFlex],
  tsDoc: ``,
  doc: { en: `` },
};
