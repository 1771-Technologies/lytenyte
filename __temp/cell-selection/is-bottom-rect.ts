import type { DataRect } from "../types/api.js";

export function isBottomRect(rowCount: number, botCount: number, rect: DataRect) {
  const bottomStart = rowCount - botCount;

  return rect.rowStart >= bottomStart;
}
