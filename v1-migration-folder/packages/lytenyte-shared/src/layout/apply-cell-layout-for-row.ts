import { clamp } from "@1771technologies/lytenyte-js-utils";
import { FULL_WIDTH_MAP, NORMAL_CELL } from "../+constants.js";
import type { Column, LayoutMap, Row, RowColTuple, SpanFn } from "../+types.layout.js";

export interface ApplyCellLayoutForRowParams {
  /** The current row index to compute the cell layout for. */
  readonly row: Row;
  /** The first column index to compute from. */
  readonly start: Column;
  /** The last column index to compute to exclusive. */
  readonly end: Column;
  /** The maximum column index that may be spanned - even if the span is greater. */
  readonly maxColBound: Row;
  /** The maximum row index that may be spanned - even if the span is greater. */
  readonly maxRowBound: Row;
  /** The layout map which tracks which cells are empty on a per row basis. This will be mutated by this function. */
  readonly map: LayoutMap;
  /** A function to compute the column span for a given row and column index pair. */
  readonly computeColSpan: SpanFn;
  /** A function to compute the row span for a given row and column index pair. */
  readonly computeRowSpan: SpanFn;
  /** A predicate that returns true if the given row is a cut off row, meaning it can not be spanned over. */
  readonly isRowCutoff: (row: Row) => boolean;
  /** A predicate that returns true if the given row is a full width row, meaning it spans across all columns. */
  readonly isFullWidth: (row: Row) => boolean;
}

/**
 * Computes and applies cell layout for a single row in a grid, handling cell spanning.
 *
 * This function processes each cell in the specified row and determines its spanning
 * behavior (both horizontally and vertically). It updates the provided layout map to
 * track which positions contain actual cells and which contain empty placeholders
 * that are part of a spanning cell.
 *
 * Special cases:
 * - Full-width rows: These are detected early and marked with FULL_WIDTH_MAP.
 *   Processing stops immediately for these rows as they span all columns.
 * - Cutoff rows: These cannot participate in spanning (neither spanning themselves
 *   nor being spanned across).
 *
 * The function handles four key cell scenarios:
 * 1. Normal cells (no spanning)
 * 2. Cells that span only horizontally (across columns)
 * 3. Cells that span only vertically (across rows)
 * 4. Cells that span both horizontally and vertically
 *
 * When a span encounters a full-width row or cutoff row, the span is automatically
 * truncated to end before that row, and the original cell's span dimensions are updated.
 */
export const applyCellLayoutForRow = ({
  row,
  start,
  end,
  maxColBound,
  maxRowBound,
  map,
  computeColSpan,
  computeRowSpan,
  isRowCutoff,
  isFullWidth,
}: ApplyCellLayoutForRowParams) => {
  // Get or create the cell map for this row
  // The map may already exist if this row was partially processed due to cells
  // from previous rows spanning into it
  let cellMap = map.get(row);
  if (!cellMap) {
    cellMap = new Map();
    map.set(row, cellMap);
  }

  // Early exit for full-width rows
  // These rows span across all columns and require special handling
  // Mark with FULL_WIDTH_MAP constant and skip normal cell processing
  if (isFullWidth(row)) {
    map.set(row, FULL_WIDTH_MAP);
    return;
  }

  // Process each cell in the row from start to end
  for (let col = start; col < end; col++) {
    // Skip cells already processed (either directly or as part of a spanning cell)
    if (cellMap.has(col)) continue;

    // Calculate spans, clamping to valid bounds
    // A span must be at least 1 and cannot exceed the maximum boundary
    const colSpan = clamp(1, computeColSpan(row, col), maxColBound - col);
    const rowSpan = clamp(1, computeRowSpan(row, col), maxRowBound - row);

    // Cutoff rows cannot span or be spanned across
    const isCutOff = isRowCutoff(row);

    // Case 1: Normal cell with no spanning or cell in a cutoff row
    if ((colSpan === 1 && rowSpan === 1) || isCutOff) {
      cellMap.set(col, NORMAL_CELL);
      continue;
    }

    // Register this cell as a spanning cell by storing its span dimensions
    if (colSpan !== 1 || rowSpan !== 1) cellMap.set(col, [rowSpan, colSpan]);

    // Create a reference tuple for empty cells
    // Format: [0, originalRow, originalCol] to reference back to the spanning cell
    const emptyCell: RowColTuple = [0, row, col];

    // Case 2: Handle horizontal spanning (cells that span across columns)
    if (colSpan !== 1) {
      const bound = Math.min(maxColBound, col + colSpan);
      for (let ci = col + 1; ci < bound; ci++) cellMap.set(ci, emptyCell);
    }

    // Case 3: Handle vertical spanning (cells that span across rows)
    if (rowSpan !== 1) {
      const bound = Math.min(maxRowBound, row + rowSpan);
      for (let ri = row + 1; ri < bound; ri++) {
        // Stop spanning if we hit a cutoff row or full-width row
        // In this case, update the original cell's span to end at this row
        if (isRowCutoff(ri) || isFullWidth(ri) || map.get(ri) === FULL_WIDTH_MAP) {
          cellMap.set(col, [ri - row, colSpan]);
          break;
        }

        // Create cell map for this row if it doesn't exist yet
        if (!map.has(ri)) map.set(ri, new Map());
        const localCellMap = map.get(ri)!;

        // Mark this position as an empty cell referring back to the spanning cell
        localCellMap.set(col, emptyCell);
      }
    }

    // Case 4: Handle cells that span both horizontally and vertically
    if (rowSpan !== 1 && colSpan !== 1) {
      const rowBound = Math.min(maxRowBound, row + rowSpan);
      for (let ri = row + 1; ri < rowBound; ri++) {
        const localCellMap = map.get(ri)!;

        // If we hit a cutoff row or full-width row, adjust the original cell's span and stop
        if (isRowCutoff(ri) || isFullWidth(ri) || localCellMap === FULL_WIDTH_MAP) {
          // Update the span to end at this row instead of the original calculation
          cellMap.set(col, [ri - row, colSpan]);
          break;
        }

        // Mark all cells in the spanning rectangle as empty
        const colBound = Math.min(maxColBound, col + colSpan);
        for (let ci = col + 1; ci < colBound; ci++) {
          localCellMap.set(ci, emptyCell);
        }
      }
    }
  }
};
