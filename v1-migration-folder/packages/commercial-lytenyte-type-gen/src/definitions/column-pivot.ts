import type { InterfaceType } from "../+types";

export const ColumnPivotRowItem: InterfaceType = {
  kind: "interface",
  name: "ColumnPivotRowItem",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      name: "field",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      name: "active",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const ColumnPivotColumnItem: InterfaceType = {
  kind: "interface",
  name: "ColumnPivotColumnItem",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "field",
      optional: false,
      tsDoc: ``,
      value: "string",
    },
    {
      kind: "property",
      name: "active",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const ColumnPivotValueItem: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "ColumnPivotValueItem<T>",
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "field",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "aggFn",
      optional: false,
      value: "AggModelFn<T>",
    },
    {
      kind: "property",
      name: "active",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
  ],
};

export const ColumnPivotModel: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnPivotModel<T>",
  doc: { en: `` },
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "rows",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "ColumnPivotRowItem[]",
    },
    {
      kind: "property",
      name: "columns",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "ColumnPivotColumnItem[]",
    },
    {
      kind: "property",
      name: "values",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "ColumnPivotValueItem<T>[]",
    },
    {
      kind: "property",
      name: "sorts",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "SortModelItem<T>[]",
    },
    {
      kind: "property",
      name: "filters",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "FilterModelItem<T>[]",
    },
  ],
};
