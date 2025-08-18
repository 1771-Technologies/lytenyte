import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { ColumnProp, GridProp } from "./shared-properties";

export const HeaderCellRendererParams: InterfaceType = {
  kind: "interface",
  name: "HeaderCellRendererParams<T>",
  tsDoc: `Parameters passed to the header cell renderer function. This 
  provides access to the grid and column for rendering context.
  
  @group Column Header
  `,
  doc: { en: `` },
  export: true,
  properties: [GridProp, ColumnProp],
};

export const HeaderCellRendererFn: FunctionType = {
  kind: "function",
  name: "HeaderCellRendererFn<T>",
  tsDoc: `A function used to render the content of a header cell. 
  It receives renderer parameters and returns a ReactNode to render.
  
  @group Column Header
  `,
  doc: { en: `` },
  export: true,
  return: "ReactNode",
  properties: [
    {
      kind: "property",
      tsDoc: `Parameters provided to the header cell renderer, including grid context and the target column.`,
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
  tsDoc: `Header cell renderer reference. This may be a registered renderer 
  name (string) or a renderer function. If a string is used, it should match a renderer registered in the grid state.
  
  @group Column Header
  `,
  doc: { en: `` },
  export: true,
  types: ["string", "HeaderCellRendererFn<T>"],
};

export const HeaderFloatingCellRendererParams: InterfaceType = {
  kind: "interface",
  name: "HeaderFloatingCellRendererParams<T>",
  tsDoc: `Parameters passed to the floating cell renderer. Provides grid 
  and column context to determine what should be rendered.
  
  @group Column Header
  `,
  doc: { en: `` },
  export: true,
  properties: [GridProp, ColumnProp],
};

export const HeaderFloatingCellRendererFn: FunctionType = {
  kind: "function",
  name: "HeaderFloatingCellRendererFn<T>",
  tsDoc: `Renderer function for floating header cells. Returns the visual 
  contents for floating headers using provided parameters.
  
  @group Column Header
  `,
  doc: { en: `` },
  export: true,
  return: "ReactNode",
  properties: [
    {
      kind: "property",
      tsDoc: `Parameters passed to the floating cell renderer function, including grid and column information.`,
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
  tsDoc: `Floating header cell renderer reference. Can be a string 
  referencing a registered floating renderer or a function used directly by the column.
  
  @group Column Header
  `,
  doc: { en: `` },
  export: true,
  types: ["string", "HeaderFloatingCellRendererFn<T>"],
};
