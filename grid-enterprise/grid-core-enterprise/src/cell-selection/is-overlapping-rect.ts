import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";

export function isOverlappingRect(rect1: CellSelectionRect, rect2: CellSelectionRect) {
  return !(
    rect1.rowEnd < rect2.rowStart ||
    rect1.rowStart > rect2.rowEnd ||
    rect1.columnEnd < rect2.columnStart ||
    rect1.columnStart > rect2.columnEnd
  );
}
