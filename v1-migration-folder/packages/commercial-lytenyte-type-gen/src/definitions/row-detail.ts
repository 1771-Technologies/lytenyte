import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { GridProp, RowIndexProp, RowNodeProp } from "./shared-properties";

export const RowDetailRendererParams: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "RowDetailRendererParams<T>",
  properties: [RowIndexProp, RowNodeProp, GridProp],
};

export const RowDetailEnabledParams: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "RowDetailEnabledParams<T>",
  properties: [RowIndexProp, RowNodeProp, GridProp],
};

export const RowDetailHeight: UnionType = {
  kind: "union",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "RowDetailHeight",
  types: ["number", '"auto"'],
};

export const RowDetailRendererFn: FunctionType = {
  kind: "function",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "RowDetailRendererFn<T>",
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      value: "RowDetailRendererParams<T>",
      optional: true,
      name: "params",
    },
  ],
  return: "ReactNode",
};
