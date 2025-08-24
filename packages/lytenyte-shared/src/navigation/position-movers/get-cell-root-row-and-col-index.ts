import type { PositionGridCell } from "../../+types.js";

export function getCellRootRowAndColIndex(cell: PositionGridCell) {
  const rootRow = cell.root?.rowIndex ?? cell.rowIndex;
  const rootCol = cell.root?.colIndex ?? cell.colIndex;

  return [rootRow, rootCol];
}
