import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { ColumnProp, GridProp } from "./shared-properties";

export const HeaderCellRendererParams: InterfaceType = {
  kind: "interface",
  name: "HeaderCellRendererParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [GridProp, ColumnProp],
};

export const HeaderCellRendererFn: FunctionType = {
  kind: "function",
  name: "HeaderCellRendererFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  return: "ReactNode",
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "params",
      optional: false,
      value: "HeaderCellRendererParams<T>",
    },
  ],
};

export const HeaderRenderer: UnionType = {
  kind: "union",
  name: "HeaderCellRenderer<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ["string", "HeaderCellRendererFn<T>"],
};

// Floating cell

export const HeaderFloatingCellRendererParams: InterfaceType = {
  kind: "interface",
  name: "HeaderFloatingCellRendererParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [GridProp, ColumnProp],
};

export const HeaderFloatingCellRendererFn: FunctionType = {
  kind: "function",
  name: "HeaderFloatingCellRendererFn<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  return: "ReactNode",
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "params",
      optional: false,
      value: "HeaderFloatingCellRendererParams<T>",
    },
  ],
};

export const HeaderFloatingRenderer: UnionType = {
  kind: "union",
  name: "HeaderFloatingCellRenderer<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ["string", "HeaderFloatingCellRendererFn<T>"],
};
