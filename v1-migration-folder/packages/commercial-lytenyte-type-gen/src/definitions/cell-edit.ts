import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types";
import {
  ColumnProp,
  ColumnSynonymProp,
  GridProp,
  RowIndexProp,
  RowNodeProp,
} from "./shared-properties";

export const EditableFnParams: InterfaceType = {
  kind: "interface",
  name: "EditableFnParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [RowIndexProp, RowNodeProp, GridProp, ColumnProp],
};

export const EditableFn: FunctionType = {
  kind: "function",
  name: "EditableFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "params",
      optional: false,
      value: "EditableFnParams<T>",
    },
  ],
  return: "boolean",
};

export const Editable: UnionType = {
  kind: "union",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "Editable<T>",
  types: ["boolean", "EditableFn<T>"],
};

const RowValidationStateProp: PropertyType = {
  kind: "property",
  name: "rowValidationState",
  value: "Record<string, any> | boolean | null",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};

const EditValueProps: PropertyType = {
  kind: "property",
  name: "value",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "any",
};

export const EditRendererFnParams: InterfaceType = {
  kind: "interface",
  name: "EditRendererFnParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    RowIndexProp,
    RowNodeProp,
    GridProp,
    ColumnProp,
    RowValidationStateProp,
    EditValueProps,
    {
      kind: "property",
      name: "onChange",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "(c: any) => void",
    },
  ],
};

export const EditRendererFn: FunctionType = {
  kind: "function",
  name: "EditRendererFn<T>",
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
      value: "EditRendererFnParams<T>",
    },
  ],
  return: "ReactNode",
};

export const EditRenderer: UnionType = {
  kind: "union",
  name: "EditRenderer<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ["string", "EditRendererFn<T>"],
};

export const EditSetterParams: InterfaceType = {
  kind: "interface",
  name: "EditSetterParams<T>",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    GridProp,
    RowNodeProp,
    RowIndexProp,
    ColumnProp,
    {
      kind: "property",
      name: "data",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
  ],
};

export const EditSetterFn: FunctionType = {
  kind: "function",
  name: "EditSetterFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
      value: "EditSetterParams<T>",
    },
  ],
  return: "any",
};

export const EditRowValidatorFnParams: InterfaceType = {
  kind: "interface",
  name: "EditRowValidatorFnParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    GridProp,
    RowNodeProp,
    RowIndexProp,
    {
      kind: "property",
      name: "data",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
  ],
};

export const EditRowValidatorFn: FunctionType = {
  kind: "function",
  name: "EditRowValidatorFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  return: "Record<string, any> | boolean",
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "EditRowValidatorFnParams<T>",
    },
  ],
};

export const EditClickActivator: UnionType = {
  kind: "union",
  name: "EditClickActivator",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"single"', '"double-click"', '"none"'],
};

export const EditCellMode: UnionType = {
  kind: "union",
  name: "EditCellMode",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"cell"', '"readonly"'],
};

export const EditActivePosition: InterfaceType = {
  kind: "interface",
  name: "EditActivePosition<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [RowIndexProp, ColumnProp],
};

export const EditBeginParams: InterfaceType = {
  kind: "interface",
  name: "EditBeginParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "init",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "any",
    },
    ColumnSynonymProp,
    RowIndexProp,
  ],
};

export const EditUpdateParams: InterfaceType = {
  kind: "interface",
  name: "EditUpdateParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "value",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
    ColumnSynonymProp,
    RowIndexProp,
  ],
};

/**
 * EDIT EVENTS
 */

export const EditDataProp: PropertyType = {
  kind: "property",
  name: "data",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "any",
};

export const OnEditBeginParams: InterfaceType = {
  kind: "interface",
  name: "OnEditBeginParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnProp,
    RowIndexProp,
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "preventDefault",
      optional: false,
      value: "() => void",
    },
  ],
};

export const OnEditEndParams: InterfaceType = {
  kind: "interface",
  name: "OnEditEndParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, RowIndexProp, EditDataProp],
};

export const OnEditCancelParams: InterfaceType = {
  kind: "interface",
  name: "OnEditCancelParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, RowIndexProp, EditDataProp],
};

export const OnEditErrorParams: InterfaceType = {
  kind: "interface",
  name: "OnEditErrorParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnProp,
    RowIndexProp,
    EditDataProp,
    {
      kind: "property",
      name: "validation",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "Record<string, any> | boolean",
    },
    {
      kind: "property",
      name: "error",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "unknown",
    },
  ],
};
