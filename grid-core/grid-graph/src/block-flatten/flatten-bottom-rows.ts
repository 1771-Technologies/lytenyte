import type { RowNodeLeafCore } from "@1771technologies/grid-types/core";
import type { FlattenRowContext } from "./types.js";

export function flattenBottomRows<D>(
  { rowIdToRow, rowIndexToRow, rowIdToRowIndex }: FlattenRowContext<D>,
  rowBottom: RowNodeLeafCore<D>[],
  centerOffset: number,
) {
  for (let i = 0; i < rowBottom.length; i++) {
    const row = rowBottom[i];
    const rowIndex = i + centerOffset; // Calculate final position including all offsets
    rowIndexToRow.set(rowIndex, row);
    rowIdToRowIndex.set(row.id, rowIndex);
    rowIdToRow.set(row.id, row);
  }

  return centerOffset + rowBottom.length;
}
