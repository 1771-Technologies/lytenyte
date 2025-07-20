import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types";
import { ColumnProp, DataProp, GridProp } from "./shared-properties";

export const FieldDataParam: UnionType = {
  kind: "union",
  name: "FieldDataParam<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: [
    '{ kind: "leaf", data: T }',
    '{ kind: "branch", data: Record<string, unknown>, key: string }',
  ],
};

export const FieldDataParamProperty: PropertyType = {
  kind: "property",
  name: "data",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "FieldDataParam<T>",
};

export const FieldFnParams: InterfaceType = {
  kind: "interface",
  name: "FieldFnParams<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GridProp, ColumnProp, FieldDataParamProperty],
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

export const FieldRowGroupParamsFn: InterfaceType = {
  kind: "interface",
  name: "FieldRowGroupParamsFn<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GridProp, DataProp],
};

export const FieldRowGroupFn: FunctionType = {
  kind: "function",
  name: "FieldRowGroupFn<T>",
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "params",
      value: "FieldRowGroupParamsFn<T>",
      optional: false,
    },
  ],
  return: "unknown",
  tsDoc: ``,
  doc: { en: `` },
};

export const FieldUnion: UnionType = {
  kind: "union",
  export: true,
  name: "Field<T>",
  tsDoc: ``,
  doc: { en: `` },
  types: ["number", "string", "FieldPath", "FieldFn<T>"],
};

export const FieldRowGroupUnion: UnionType = {
  kind: "union",
  export: true,
  name: "FieldRowGroup<T>",
  tsDoc: ``,
  doc: { en: `` },
  types: ["number", "string", "FieldPath", "FieldRowGroupFn<T>"],
};
