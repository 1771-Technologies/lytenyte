import { getRootCell } from "@1771technologies/grid-core";
import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function adjustRectForRowAndCellSpan<D, E>(
  api: ApiPro<D, E>,
  rect: CellSelectionRectPro,
): CellSelectionRectPro {
  let { rowStart, rowEnd, columnStart, columnEnd } = rect;

  // Check the top row of the rect.
  for (let i = columnStart; i < columnEnd; i++) {
    let cell = getRootCell(api, rowStart, i);
    if (cell) {
      columnStart = Math.min(columnStart, cell.columnIndex);
      columnEnd = Math.max(columnEnd, cell.columnIndex + cell.columnSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
    cell = getRootCell(api, rowEnd - 1, i);

    if (cell) {
      columnStart = Math.min(columnStart, cell.columnIndex);
      columnEnd = Math.max(columnEnd, cell.columnIndex + cell.columnSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
  }
  for (let i = rowStart; i < rowEnd; i++) {
    let cell = getRootCell(api, i, columnStart);
    if (cell) {
      columnStart = Math.min(columnStart, cell.columnIndex);
      columnEnd = Math.max(columnEnd, cell.columnIndex + cell.columnSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
    cell = getRootCell(api, i, columnEnd - 1);
    if (cell) {
      columnStart = Math.min(columnStart, cell.columnIndex);
      columnEnd = Math.max(columnEnd, cell.columnIndex + cell.columnSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
  }

  return {
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
  };
}
