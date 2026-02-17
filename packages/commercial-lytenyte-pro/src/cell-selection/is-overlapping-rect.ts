import type { DataRect } from "../types/api.js";

export function isOverlappingRect(a: DataRect, b: DataRect) {
  const rowsOverlap = a.rowStart < b.rowEnd && b.rowStart < a.rowEnd;

  const columnsOverlap = a.columnStart < b.columnEnd && b.columnStart < a.columnEnd;

  return rowsOverlap && columnsOverlap;
}
