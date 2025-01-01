import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";
import { isOverlappingRect } from "./is-overlapping-rect";

export function deselectRectRange(rect: CellSelectionRect, deselectRect: CellSelectionRect) {
  if (!isOverlappingRect(rect, deselectRect)) return [rect];

  const result: CellSelectionRect[] = [];
  // Check for top split
  if (deselectRect.rowStart > rect.rowStart) {
    result.push({
      rowStart: rect.rowStart,
      rowEnd: deselectRect.rowStart,
      columnStart: rect.columnStart,
      columnEnd: rect.columnEnd,
    });
  }

  // Check for bottom split
  if (deselectRect.rowEnd < rect.rowEnd) {
    result.push({
      rowStart: deselectRect.rowEnd,
      rowEnd: rect.rowEnd,
      columnStart: rect.columnStart,
      columnEnd: rect.columnEnd,
    });
  }

  // Check for left split
  if (deselectRect.columnStart > rect.columnStart) {
    result.push({
      rowStart: Math.max(deselectRect.rowStart, rect.rowStart),
      rowEnd: Math.min(deselectRect.rowEnd, rect.rowEnd),
      columnStart: rect.columnStart,
      columnEnd: deselectRect.columnStart,
    });
  }

  // Check for right split
  if (deselectRect.columnEnd < rect.columnEnd) {
    result.push({
      rowStart: Math.max(deselectRect.rowStart, rect.rowStart),
      rowEnd: Math.min(deselectRect.rowEnd, rect.rowEnd),
      columnStart: deselectRect.columnEnd,
      columnEnd: rect.columnEnd,
    });
  }

  return result.filter(
    (rect) => !(rect.rowStart >= rect.rowEnd || rect.columnStart >= rect.columnEnd),
  );
}
