import type { CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function isWithinSelectionRect(rect: CellSelectionRectPro, r: number, c: number) {
  return r >= rect.rowStart && r < rect.rowEnd && c >= rect.columnStart && c < rect.columnEnd;
}
