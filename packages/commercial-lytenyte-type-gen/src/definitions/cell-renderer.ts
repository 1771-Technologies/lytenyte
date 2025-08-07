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
  tsDoc: `
  Input parameters passed to the {@link CellRendererFn}, which is responsible for rendering the display content
  of a specific cell in the grid.

  Includes metadata and context such as the grid instance, row and column positions, selection state,
  and the full row node data.
  `,
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
  tsDoc: `
  A function that returns a {@link ReactNode} representing the rendered content of a cell.

  This function is called once per cell for the associated column. Cell renderers should be
  optimized for performance, as slow renderers may degrade the overall responsiveness of the grid.

  Avoid unnecessary re-renders or expensive calculations inside this function.
  `,
  return: "ReactNode",
  properties: [
    {
      kind: "property",
      name: "params",
      value: "CellRendererParams<T>",
      tsDoc: `
      The full set of parameters available to the cell renderer. See {@link CellRendererParams}.
      `,
      doc: { en: `` },
      optional: false,
    },
  ],
};
