import type { FunctionType, InterfaceType } from "../+types";
import { ColumnIndexProp, GridProp, RowIndexProp, RowNodeProp } from "./shared-properties";

export const CellSpanFnParams: InterfaceType = {
  kind: "interface",
  name: "CellSpanFnParams<T>",
  export: true,
  tsDoc: `
  Input parameters for {@link CellSpanFn}, which determines the span of a given cell.

  These parameters include:
  - The grid instance
  - Row and column indices
  - The row node representing the full row data

  Used to compute dynamic row or column spans for advanced layout use cases.
  `,
  doc: { en: `` },
  properties: [GridProp, RowIndexProp, ColumnIndexProp, RowNodeProp],
};

export const CellSpanFn: FunctionType = {
  kind: "function",
  name: "CellSpanFn<T>",
  export: true,
  doc: { en: `` },
  tsDoc: `
  A function that computes the row or column span for a given cell in LyteNyte Grid.

  This function supports both row and column spanning, depending on where it's applied. It must
  return a numeric value greater than or equal to \`1\`, indicating how many rows or columns
  the cell should span.

  **Performance Note**: This function is called frequently during layout calculations,
  so it must be fast and efficient to avoid UI lag.

  **Consistency Requirement**:

  LyteNyte Grid expects spans to be logically consistent and non-overlapping. For instance,
  if a cell at row index 0 returns a span of 3, then the cells at row indices 1 and 2 must
  return a span of 1 (i.e. not spanned), as they are covered by the span starting at row 0.

  Inconsistent or overlapping span calculations may cause layout breakage due to LyteNyte's
  look-back layout resolution strategy.

  **Scan Distance**:

  Use the grid's \`rowScanDistance\` and \`colScanDistance\` properties to define how far
  the grid should look when resolving spans. These act as guarantees that no span will exceed
  the specified limits.

  **Visibility**:

  Cells that are spanned over (i.e. covered by another cell's span) will not be rendered and
  are excluded from the layout and DOM. Ensure your span logic accounts for this behavior.
  `,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `
      Arguments passed to the span function, including row/column index and row data.

      See {@link CellSpanFnParams}.
      `,
      doc: { en: `` },
      optional: false,
      value: `CellSpanFnParams<T>`,
    },
  ],
  return: "number",
};
