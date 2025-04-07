import type { CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function isOverlappingRect(rect1: CellSelectionRectPro, rect2: CellSelectionRectPro) {
  return !(
    rect1.rowEnd < rect2.rowStart ||
    rect1.rowStart > rect2.rowEnd ||
    rect1.columnEnd < rect2.columnStart ||
    rect1.columnStart > rect2.columnEnd
  );
}
