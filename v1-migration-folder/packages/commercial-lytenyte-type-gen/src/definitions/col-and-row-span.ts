import type { FunctionType, InterfaceType } from "../+types";
import { ColumnIndexProp, GridProp, RowIndexProp, RowNodeProp } from "./shared-properties";

export const CellSpanFnParams: InterfaceType = {
  kind: "interface",
  name: "CellSpanFnParams<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GridProp, RowIndexProp, ColumnIndexProp, RowNodeProp],
};

export const CellSpanFn: FunctionType = {
  kind: "function",
  name: "CellSpanFn<T>",
  export: true,
  doc: { en: `` },
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: `CellSpanFnParams<T>`,
    },
  ],
  return: "number",
};
