import type { FlattenRowContext } from "./types.js";
import type { RowNodeLeafCore } from "@1771technologies/grid-types/core";

export function flattenTopRows<D>(
  { rowIndexToRow, rowIdToRow, rowIdToRowIndex }: FlattenRowContext<D>,
  rowsTop: RowNodeLeafCore<D>[],
) {
  const topOffset = rowsTop.length;

  const topStart = 0;

  for (let i = 0; i < rowsTop.length; i++) {
    const row = rowsTop[i];
    rowIndexToRow.set(i + topStart, row);
    rowIdToRowIndex.set(row.id, i + topStart);
    rowIdToRow.set(row.id, row);
  }

  return topOffset;
}
