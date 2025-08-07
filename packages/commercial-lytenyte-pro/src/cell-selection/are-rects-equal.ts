import type { DataRect } from "../+types";

export function areRectsEqual(left: DataRect, right: DataRect): boolean {
  return (
    left.rowStart === right.rowStart &&
    left.rowEnd === right.rowEnd &&
    left.columnStart === right.columnStart &&
    left.columnEnd === right.columnEnd
  );
}
