import type { DataRect } from "./types.js";

export function rectsOverlap(a: DataRect, b: DataRect): boolean {
  return (
    a.columnStart < b.columnEnd &&
    b.columnStart < a.columnEnd &&
    a.rowStart < b.rowEnd &&
    b.rowStart < a.rowEnd
  );
}
