import type { DataRect } from "@1771technologies/lytenyte-shared";

export function isOverlappingRect(a: DataRect, b: DataRect) {
  return a.rowStart < b.rowEnd && b.rowStart < a.rowEnd && a.columnStart < b.columnEnd && b.columnStart < a.columnEnd;
}
