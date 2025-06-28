import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { ColumnProp, DataProp, GridProp } from "./shared-properties";

export const FieldFnParams: InterfaceType = {
  kind: "interface",
  name: "FieldFnParams<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GridProp, ColumnProp, DataProp],
};

export const FieldFn: FunctionType = {
  kind: "function",
  name: "FieldFn<T>",
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "FieldFnParams<T>",
    },
  ],
  return: "unknown",
  doc: { en: `` },
  tsDoc: ``,
};

export const FieldPath: InterfaceType = {
  kind: "interface",
  name: "FieldPath",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      optional: false,
      doc: { en: `` },
      tsDoc: ``,
      value: '"path"',
    },
    {
      kind: "property",
      name: "path",
      value: "string",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const FieldUnion: UnionType = {
  kind: "union",
  export: true,
  name: "Field<T>",
  tsDoc: ``,
  doc: { en: `` },
  types: ["number", "string", "FieldPath", "FieldFn<T>"],
};
