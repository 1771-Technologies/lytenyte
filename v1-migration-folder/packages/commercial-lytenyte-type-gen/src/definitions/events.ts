import type { FunctionType, InterfaceType, PropertyType } from "../+types";
import { GridProp } from "./shared-properties";

const ExpansionProp: PropertyType = {
  kind: "property",
  name: "expansions",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "{ [rowId: string]: boolean }",
};

export const RowExpandBeginParams: InterfaceType = {
  kind: "interface",
  name: "RowExpandBeginParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    GridProp,
    ExpansionProp,
    {
      kind: "property",
      name: "preventNext",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
  ],
};

export const RowExpandParams: InterfaceType = {
  kind: "interface",
  name: "RowExpandParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [GridProp, ExpansionProp],
};

export const RowExpandErrorParams: InterfaceType = {
  kind: "interface",
  name: "RowExpandErrorParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    GridProp,
    ExpansionProp,
    {
      kind: "property",
      name: "error",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "unknown",
    },
  ],
};

export const RowExpandBegin: FunctionType = {
  kind: "function",
  name: "RowExpandBeginFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowExpandBeginParams<T>",
    },
  ],
  return: "void",
};
export const RowExpand: FunctionType = {
  kind: "function",
  name: "RowExpandFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowExpandParams<T>",
    },
  ],
  return: "void",
};
export const RowExpandError: FunctionType = {
  kind: "function",
  name: "RowExpandErrorFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowExpandErrorParams<T>",
    },
  ],
  return: "void",
};

export const EditBegin: FunctionType = {
  kind: "function",
  name: "EditBegin<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "OnEditBeginParams<T>",
    },
  ],
  return: "void",
};
export const EditEnd: FunctionType = {
  kind: "function",
  name: "EditEnd<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "OnEditEndParams<T>",
    },
  ],
  return: "void",
};
export const EditCancel: FunctionType = {
  kind: "function",
  name: "EditCancel<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "OnEditCancelParams<T>",
    },
  ],
  return: "void",
};
export const EditError: FunctionType = {
  kind: "function",
  name: "EditError<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "OnEditErrorParams<T>",
    },
  ],
  return: "void",
};

/**
 *  Events object
 */

const RowExpandBeginProp: PropertyType = {
  kind: "property",
  name: "rowExpandBegin",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowExpandBeginFn<T>",
};
const RowExpandProp: PropertyType = {
  kind: "property",
  name: "rowExpand",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowExpandFn<T>",
};
const RowExpandEnd: PropertyType = {
  kind: "property",
  name: "rowExpandError",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowExpandErrorFn<T>",
};
const EditBeginProp: PropertyType = {
  kind: "property",
  name: "editBegin",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditBegin<T>",
};
const EditEndProp: PropertyType = {
  kind: "property",
  name: "editEnd",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditEnd<T>",
};
const EditCancelProp: PropertyType = {
  kind: "property",
  name: "editCancel",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditCancel<T>",
};
const EditErrorProp: PropertyType = {
  kind: "property",
  name: "editError",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "EditError<T>",
};

export const Events: InterfaceType = {
  kind: "interface",
  name: "GridEvents<T>",
  tsDoc: ``,
  doc: { en: ` ` },
  export: true,
  properties: [
    RowExpandBeginProp,
    RowExpandProp,
    RowExpandEnd,
    EditBeginProp,
    EditEndProp,
    EditCancelProp,
    EditErrorProp,
  ],
};
