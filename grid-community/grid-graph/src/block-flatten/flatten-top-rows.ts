import type { RowNodeLeaf, RowNodeTotal, RowPin } from "@1771technologies/grid-types/core";
import { ROW_TOTAL_ID } from "@1771technologies/grid-constants";
import type { FlattenRowContext } from "./types.js";

/**
 * Processes and positions rows that should appear at the top of the grid, including pinned rows
 * and potentially a totals row. This function handles the complex positioning logic for these
 * special rows and maintains lookup maps for efficient row access.
 *
 * Positioning Rules:
 * 1. If totals row is pinned to top: [Totals Row] -> [Pinned Rows]
 * 2. If totals row is top but not pinned: [Pinned Rows] -> [Totals Row]
 * 3. If no totals row at top: [Pinned Rows]
 *
 * @param ctx - Context object containing maps for row lookups
 * @param ctx.rowIndexToRow - Map linking row indices to row nodes
 * @param ctx.rowIdToRow - Map linking row IDs to row nodes
 *
 * @param rowsTop - Array of leaf nodes to be pinned to the top of the grid
 * @param rowTotalPosition - Position specification for the totals row ("top", "bottom", or "none")
 * @param rowTotalIsPinned - Boolean indicating if the totals row should be pinned
 * @param rowTotal - The totals row node to be positioned
 *
 * @returns The total number of rows placed in the top section. This value serves as an offset
 *          for positioning the remaining grid rows.
 *
 * @remarks
 * - The function populates both rowIndexToRow and rowIdToRow maps for efficient row lookups
 * - The returned offset is used to adjust the position of non-top rows in the grid
 * - When the totals row is present at the top, it adds +1 to the offset regardless of pinning
 */
export function flattenTopRows<D>(
  { rowIndexToRow, rowIdToRow, rowIdToRowIndex }: FlattenRowContext<D>,
  rowsTop: RowNodeLeaf<D>[],
  rowTotalPosition: RowPin,
  rowTotalIsPinned: boolean,
  rowTotal: RowNodeTotal,
) {
  // Calculate the total number of rows that will be in the top section.
  // This includes all pinned top rows plus the totals row if it's positioned at the top.
  // This offset is crucial as it determines how far down subsequent rows need to be shifted.
  const topOffset = rowTotalPosition === "top" ? rowsTop.length + 1 : rowsTop.length;

  // Handle the special case where totals row is both positioned and pinned at the top.
  // In this case, the totals row must appear first (at index 0), pushing all other
  // pinned rows down by one position.
  let topStart = 0;
  if (rowTotalPosition === "top" && rowTotalIsPinned) {
    topStart = 1;
    rowIndexToRow.set(0, rowTotal);
    rowIdToRowIndex.set(ROW_TOTAL_ID, 0);
    rowIdToRow.set(ROW_TOTAL_ID, rowTotal);
  }

  // Process all pinned top rows, placing them in sequential order starting from topStart.
  // If the totals row is pinned top, topStart will be 1, otherwise 0.
  // Each row is added to both lookup maps for efficient access by either index or ID.
  for (let i = 0; i < rowsTop.length; i++) {
    const row = rowsTop[i];
    rowIndexToRow.set(i + topStart, row);
    rowIdToRowIndex.set(row.id, i + topStart);
    rowIdToRow.set(row.id, row);
  }

  // Handle the case where totals row is positioned at top but NOT pinned.
  // In this case, it should appear after all pinned rows but still in the top section.
  if (rowTotalPosition === "top" && !rowTotalIsPinned) {
    rowIndexToRow.set(rowsTop.length, rowTotal);
    rowIdToRowIndex.set(ROW_TOTAL_ID, rowsTop.length);
    rowIdToRow.set(ROW_TOTAL_ID, rowTotal);
  }

  // Return the total number of rows in the top section, which will be used
  // to offset the position of all remaining grid rows
  return topOffset;
}
