import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { GridProp } from "./shared-properties";

export const RowGroupField: InterfaceType = {
  kind: "interface",
  name: "RowGroupField<T>",
  tsDoc: "",
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: '"field"',
    },
    {
      kind: "property",
      name: "id",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      name: "field",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "FieldRowGroup<T>",
    },
    {
      kind: "property",
      name: "name",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "string",
    },
  ],
};

export const RowGroupModelItem: UnionType = {
  kind: "union",
  name: "RowGroupModelItem<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ["string", "RowGroupField<T>"],
};

export const RowGroupDisplayMode: UnionType = {
  kind: "union",
  name: "RowGroupDisplayMode",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"single-column"', '"multi-column"', '"custom"'],
};

export const AggFn: FunctionType = {
  kind: "function",
  name: "AggFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "data",
      value: "(T | null)[]",
      optional: false,
    },
    GridProp,
  ],
  return: "unknown",
};

export const AggModelFn: UnionType = {
  kind: "union",
  name: "AggModelFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ["string", "AggFn<T>"],
};
