import type { RowColTuple } from "../../+types.non-gen.js";

export function getCellRootRowAndColIndex(
  cell: RowColTuple,
  fallbackRow: number,
  fallbackCol: number,
) {
  if (cell.length === 2) return [fallbackRow, fallbackCol];

  return [cell[1], cell[2]];
}
