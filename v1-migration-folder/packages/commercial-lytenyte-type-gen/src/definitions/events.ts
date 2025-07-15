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

export const RowDetailExpansionBeginParams: InterfaceType = {
  tsDoc: ``,
  name: "RowDetailExpansionBeginParams<T>",
  doc: { en: `` },
  export: true,
  kind: "interface",
  properties: [
    GridProp,
    {
      kind: "property",
      name: "expansions",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "Set<string>",
    },
    {
      kind: "property",
      name: "preventDefault",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
  ],
};

export const RowDetailExpansionEndParams: InterfaceType = {
  tsDoc: ``,
  name: "RowDetailExpansionEndParams<T>",
  doc: { en: `` },
  export: true,
  kind: "interface",
  properties: [
    GridProp,
    {
      kind: "property",
      name: "expansions",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "Set<string>",
    },
  ],
};

export const RowDetailExpansionBegin: FunctionType = {
  kind: "function",
  name: "RowDetailExpansionBegin<T>",
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
      value: "RowDetailExpansionBeginParams<T>",
    },
  ],
  return: "void",
};
export const RowDetailExpansionEnd: FunctionType = {
  kind: "function",
  name: "RowDetailExpansionEnd<T>",
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
      value: "RowDetailExpansionEndParams<T>",
    },
  ],
  return: "void",
};

const RowSelectedProp: PropertyType = {
  kind: "property",
  name: "selected",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "string",
};
const DeselectProp: PropertyType = {
  kind: "property",
  name: "deselect",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "boolean",
};

export const RowSelectBeginParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectBeginParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    RowSelectedProp,
    GridProp,
    DeselectProp,
    {
      kind: "property",
      name: "preventDefault",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
  ],
};
export const RowSelectBegin: FunctionType = {
  kind: "function",
  name: "RowSelectBegin<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "RowSelectBeginParams<T>",
    },
  ],
  return: "void",
};

export const RowSelectEndParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectEndParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [RowSelectedProp, GridProp, DeselectProp],
};

export const RowSelectEnd: FunctionType = {
  kind: "function",
  name: "RowSelectEnd<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "RowSelectEndParams<T>",
    },
  ],
  return: "void",
};

export const RowSelectAllBeginParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectAllBeginParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    DeselectProp,
    GridProp,
    {
      kind: "property",
      name: "preventDefault",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "() => void",
    },
  ],
};
export const RowSelectAllEndParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectAllEndParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [DeselectProp, GridProp],
};

export const RowSelectAllBegin: FunctionType = {
  kind: "function",
  name: "RowSelectAllBegin<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "RowSelectAllBeginParams<T>",
    },
  ],
  return: "void",
};

export const RowSelectAllEnd: FunctionType = {
  kind: "function",
  name: "RowSelectAllEnd<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "RowSelectAllEndParams<T>",
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

const RowDetailExpansionBeginProp: PropertyType = {
  kind: "property",
  name: "rowDetailExpansionBegin",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowDetailExpansionBegin<T>",
};

const RowDetailExpansionEndProp: PropertyType = {
  kind: "property",
  name: "rowDetailExpansionEnd",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowDetailExpansionEnd<T>",
};

const RowSelectBeginProp: PropertyType = {
  kind: "property",
  name: "rowSelectBegin",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowSelectBegin<T>",
};

const RowSelectEndProp: PropertyType = {
  kind: "property",
  name: "rowSelectEnd",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowSelectEnd<T>",
};

const RowSelectAllBeginProp: PropertyType = {
  kind: "property",
  name: "rowSelectAllBegin",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowSelectAllBegin<T>",
};
const RowSelectAllEndProp: PropertyType = {
  kind: "property",
  name: "rowSelectAllEnd",
  tsDoc: ``,
  doc: { en: `` },
  optional: true,
  value: "RowSelectAllEnd<T>",
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

    RowDetailExpansionBeginProp,
    RowDetailExpansionEndProp,

    RowSelectBeginProp,
    RowSelectEndProp,
    RowSelectAllBeginProp,
    RowSelectAllEndProp,
  ],
};
