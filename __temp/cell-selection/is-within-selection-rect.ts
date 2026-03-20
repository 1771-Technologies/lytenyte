import type { DataRect } from "../types/api.js";

export function isWithinSelectionRect(rect: DataRect, r: number, c: number) {
  return r >= rect.rowStart && r < rect.rowEnd && c >= rect.columnStart && c < rect.columnEnd;
}
