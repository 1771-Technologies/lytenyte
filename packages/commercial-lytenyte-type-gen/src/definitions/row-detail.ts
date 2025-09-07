import type { FunctionType, InterfaceType, UnionType } from "../+types";
import { GridProp, RowIndexProp, RowNodeProp } from "./shared-properties.js";

export const RowDetailRendererParams: InterfaceType = {
  kind: "interface",
  tsDoc: `Defines the parameters passed to a row detail renderer. These parameters 
  include the row index, the row node metadata, 
  and a reference to the grid instance.
  
  @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  name: "RowDetailRendererParams<T>",
  properties: [RowIndexProp, RowNodeProp, GridProp],
};

export const RowDetailHeight: UnionType = {
  kind: "union",
  tsDoc: `Specifies the height of the row detail section. 
  Can be a fixed number of pixels or "auto" to size based on content.
  
  @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  name: "RowDetailHeight",
  types: ["number", '"auto"'],
};

export const RowDetailRendererFn: FunctionType = {
  kind: "function",
  tsDoc: `A function used to render custom row detail content. 
  It should return a ReactNode to be displayed in the row's 
  expanded detail area.
  
  @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  name: "RowDetailRendererFn<T>",
  properties: [
    {
      kind: "property",
      tsDoc: `The parameters passed into the row detail renderer function.`,
      doc: { en: `` },
      value: "RowDetailRendererParams<T>",
      optional: true,
      name: "params",
    },
  ],
  return: "ReactNode",
};
