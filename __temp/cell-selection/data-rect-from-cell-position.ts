import type { PositionGridCell } from "@1771technologies/lytenyte-shared";
import type { DataRect } from "../types";

export function dataRectFromCellPosition(position: PositionGridCell): DataRect {
  if (position.root) {
    const r = position.root;
    return {
      rowStart: r.rowIndex,
      rowEnd: r.rowIndex + r.rowSpan,
      columnStart: r.colIndex,
      columnEnd: r.colIndex + r.colSpan,
    };
  }

  return {
    rowStart: position.rowIndex,
    rowEnd: position.rowIndex + 1,
    columnStart: position.colIndex,
    columnEnd: position.colIndex + 1,
  };
}
