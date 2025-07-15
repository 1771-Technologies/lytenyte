import type { FunctionType, InterfaceType } from "../+types";
import {
  ColumnIndexProp,
  ColumnProp,
  GridProp,
  RowIndeterminateProp,
  RowIndexProp,
  RowNodeProp,
  RowSelectedProp,
} from "./shared-properties";

export const CellRendererParams: InterfaceType = {
  kind: "interface",
  name: "CellRendererParams<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    GridProp,
    ColumnProp,
    RowNodeProp,
    RowIndexProp,
    ColumnIndexProp,
    RowSelectedProp,
    RowIndeterminateProp,
  ],
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
