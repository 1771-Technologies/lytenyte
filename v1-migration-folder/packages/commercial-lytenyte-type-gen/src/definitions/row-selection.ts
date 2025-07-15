import type { InterfaceType, UnionType } from "../+types";

export const RowSelectionMode: UnionType = {
  kind: "union",
  name: "RowSelectionMode",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"single"', '"multiple"', '"none"'],
};

export const RowSelectionActivator: UnionType = {
  kind: "union",
  name: "RowSelectionActivator",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"single-click"', '"double-click"', '"none"'],
};

export const RowSelectOptions: InterfaceType = {
  kind: "interface",
  name: "RowSelectOptions",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "selected",
      tsDoc: ``,
      doc: { en: `` },
      value: "string",
      optional: false,
    },
    {
      kind: "property",
      name: "pivot",
      tsDoc: ``,
      doc: { en: `` },
      value: "string",
      optional: true,
    },
    {
      kind: "property",
      name: "selectBetweenPivot",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
      value: "boolean",
    },
    {
      kind: "property",
      name: "deselect",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      name: "selectChildren",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
      value: "boolean",
    },
  ],
};

export const RowSelectAllOptions: InterfaceType = {
  kind: "interface",
  name: "RowSelectAllOptions",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "deselect",
      optional: true,
      value: "boolean",
    },
  ],
};
