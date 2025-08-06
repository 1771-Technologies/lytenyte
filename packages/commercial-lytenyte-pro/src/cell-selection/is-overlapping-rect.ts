import type { DataRect } from "../+types";

export function isOverlappingRect(rect1: DataRect, rect2: DataRect) {
  return !(
    rect1.rowEnd < rect2.rowStart ||
    rect1.rowStart > rect2.rowEnd ||
    rect1.columnEnd < rect2.columnStart ||
    rect1.columnStart > rect2.columnEnd
  );
}
