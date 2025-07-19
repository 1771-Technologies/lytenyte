import type { DataRect, Grid } from "../+types";
import { getRootCell } from "./get-root-cell";

export function adjustRectForRowAndCellSpan<T>(grid: Grid<T>, rect: DataRect): DataRect {
  let { rowStart, rowEnd, columnStart, columnEnd } = rect;

  // Check the top row of the rect.
  for (let i = columnStart; i < columnEnd; i++) {
    let cell = getRootCell(grid, rowStart, i);
    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
    cell = getRootCell(grid, rowEnd - 1, i);

    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
  }
  for (let i = rowStart; i < rowEnd; i++) {
    let cell = getRootCell(grid, i, columnStart);
    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
    cell = getRootCell(grid, i, columnEnd - 1);
    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
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
