import type { CellSelectionRect } from "@1771technologies/grid-types/pro";

export function areRectsEqual(left: CellSelectionRect, right: CellSelectionRect): boolean {
  return (
    left.rowStart === right.rowStart &&
    left.rowEnd === right.rowEnd &&
    left.columnStart === right.columnStart &&
    left.columnEnd === right.columnEnd
  );
}
