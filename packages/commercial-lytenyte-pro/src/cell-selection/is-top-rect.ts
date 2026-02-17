import type { DataRect } from "../types/api.js";

export function isTopRect(topCount: number, rect: DataRect) {
  return rect.rowStart < topCount;
}
