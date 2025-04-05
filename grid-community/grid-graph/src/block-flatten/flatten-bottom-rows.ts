import type { RowNodeLeaf, RowNodeTotal, RowPin } from "@1771technologies/grid-types/core";
import type { FlattenRowContext } from "./types.js";
import { ROW_TOTAL_ID } from "@1771technologies/grid-constants";

/**
 * Processes and positions rows that should appear at the bottom of the grid, including pinned rows
 * and potentially a totals row. This function handles the complex positioning logic for these
 * special rows and maintains lookup maps for efficient row access.
 *
 * Positioning Rules:
 * 1. If totals row is pinned to bottom: [Pinned Rows] -> [Totals Row]
 * 2. If totals row is bottom but not pinned: [Totals Row] -> [Pinned Rows]
 * 3. If no totals row at bottom: [Pinned Rows]
 *
 * @param ctx - Context object containing maps for row lookups
 * @param ctx.rowIndexToRow - Map linking row indices to row nodes
 * @param ctx.rowIdToRow - Map linking row IDs to row nodes
 *
 * @param rowBottom - Array of leaf nodes to be pinned to the bottom of the grid
 * @param rowTotalPosition - Position specification for the totals row ("top", "bottom", or "none")
 * @param rowTotalIsPinned - Boolean indicating if the totals row should be pinned
 * @param rowTotal - The totals row node to be positioned
 * @param centerOffset - Starting index for bottom rows, determined by the number of center rows
 *
 * @returns The final row index after all bottom rows have been positioned. This can be used
 *          to determine the total height of the grid.
 *
 * @remarks
 * - The function populates both rowIndexToRow and rowIdToRow maps for efficient row lookups
 * - The centerOffset parameter is crucial as it determines where bottom rows start
 * - The positioning of the totals row affects the final indices of all bottom-pinned rows
 */
export function flattenBottomRows<D>(
  { rowIdToRow, rowIndexToRow, rowIdToRowIndex }: FlattenRowContext<D>,
  rowBottom: RowNodeLeaf<D>[],
  rowTotalPosition: RowPin,
  rowTotalIsPinned: boolean,
  rowTotal: RowNodeTotal,
  centerOffset: number,
) {
  const isTotalBottom = rowTotalPosition === "bottom";
  // Calculate the starting index for bottom-pinned rows.
  // If the totals row is positioned at bottom but NOT pinned,
  // we need to leave a gap for it before the bottom-pinned rows,
  // so we offset the starting position by an additional 1.
  const botIndexOffset = isTotalBottom && !rowTotalIsPinned ? centerOffset + 1 : centerOffset;

  // Handle the case where totals row is positioned at bottom but NOT pinned.
  // In this case, it should appear before all bottom-pinned rows.
  if (isTotalBottom && !rowTotalIsPinned) {
    // Place the totals row at the start of the bottom section
    rowIndexToRow.set(centerOffset, rowTotal);
    rowIdToRowIndex.set(ROW_TOTAL_ID, centerOffset);
    rowIdToRow.set(ROW_TOTAL_ID, rowTotal);
  }

  // Process all bottom-pinned rows, placing them in sequential order.
  // Their position takes into account both the center offset and
  // any adjustment needed for the totals row positioning.
  for (let i = 0; i < rowBottom.length; i++) {
    const row = rowBottom[i];
    const rowIndex = i + botIndexOffset; // Calculate final position including all offsets
    rowIndexToRow.set(rowIndex, row);
    rowIdToRowIndex.set(row.id, rowIndex);
    rowIdToRow.set(row.id, row);
  }

  // Handle the case where totals row is both positioned and pinned at bottom.
  // In this case, it should appear after all bottom-pinned rows.
  if (isTotalBottom && rowTotalIsPinned) {
    // Place the totals row after all bottom-pinned rows
    rowIndexToRow.set(centerOffset + rowBottom.length, rowTotal);
    rowIdToRowIndex.set(ROW_TOTAL_ID, centerOffset + rowBottom.length);
    rowIdToRow.set(ROW_TOTAL_ID, rowTotal);
  }

  // Return the final index after all bottom rows have been positioned.
  // This represents the total height of the grid (number of rows + 1).
  return centerOffset + rowBottom.length + (isTotalBottom ? 1 : 0);
}
