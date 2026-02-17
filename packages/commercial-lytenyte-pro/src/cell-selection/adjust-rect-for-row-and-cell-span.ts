import type { API, DataRect } from "../types/api.js";
import { getRootCell } from "./get-root-cell.js";

export function adjustRectForRowAndCellSpan(cellRoot: API["cellRoot"], rect: DataRect): DataRect {
  let { rowStart, rowEnd, columnStart, columnEnd } = rect;

  // Check the top row of the rect.
  for (let i = columnStart; i < columnEnd; i++) {
    let cell = getRootCell(cellRoot, rowStart, i);

    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
    cell = getRootCell(cellRoot, rowEnd - 1, i);

    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
  }
  for (let i = rowStart; i < rowEnd; i++) {
    let cell = getRootCell(cellRoot, i, columnStart);
    if (cell) {
      columnStart = Math.min(columnStart, cell.colIndex);
      columnEnd = Math.max(columnEnd, cell.colIndex + cell.colSpan);
      rowStart = Math.min(rowStart, cell.rowIndex);
      rowEnd = Math.max(rowEnd, cell.rowIndex + cell.rowSpan);
    }
    cell = getRootCell(cellRoot, i, columnEnd - 1);
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
