import type { DataRect } from "../types.js";

/**
 * Returns true when two rects share at least one cell. Touching edges (where
 * one rect's end equals the other's start) are not considered overlapping.
 */
export function rectsOverlap(a: DataRect, b: DataRect): boolean {
  return (
    a.columnStart < b.columnEnd &&
    b.columnStart < a.columnEnd &&
    a.rowStart < b.rowEnd &&
    b.rowStart < a.rowEnd
  );
}
