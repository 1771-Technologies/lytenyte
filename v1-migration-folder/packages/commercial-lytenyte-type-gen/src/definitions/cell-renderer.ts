import type { FunctionType, InterfaceType } from "../+types";
import { ColumnProp, GridProp, RowNodeProp } from "./shared-properties";

export const CellRendererParams: InterfaceType = {
  kind: "interface",
  name: "CellRendererParams<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GridProp, ColumnProp, RowNodeProp],
};

export const CellRendererFn: FunctionType = {
  kind: "function",
  name: "CellRendererFn<T>",
  export: true,
  doc: { en: `` },
  tsDoc: ``,
  return: "ReactNode",
  properties: [
    {
      kind: "property",
      name: "params",
      value: "CellRendererParams<T>",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};
