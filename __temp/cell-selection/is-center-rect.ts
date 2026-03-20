import type { DataRect } from "../types/api";

export function isCenterRect(rowCount: number, rowBottomCount: number, rowTopCount: number, rect: DataRect) {
  const bottomStart = rowCount - rowBottomCount;

  return rect.rowStart < bottomStart && rect.rowStart >= rowTopCount;
}
