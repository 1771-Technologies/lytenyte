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

export const Events: InterfaceType = {
  kind: "interface",
  name: "GridEvents<T>",
  tsDoc: ``,
  doc: { en: ` ` },
  export: true,
  properties: [RowExpandBeginProp, RowExpandProp, RowExpandEnd],
};
