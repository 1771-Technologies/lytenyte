import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";

export function isWithinSelectionRect(rect: CellSelectionRect, r: number, c: number) {
  return r >= rect.rowStart && r < rect.rowEnd && c >= rect.columnStart && c < rect.columnEnd;
}
