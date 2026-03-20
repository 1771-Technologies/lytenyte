import { splitRect } from "./split-rect.js";
import type { DataRect } from "./types.js";

export function deselectRect(rect: DataRect, deselection: DataRect): DataRect[] {
  return splitRect(
    rect,
    deselection.columnStart,
    deselection.columnEnd,
    deselection.rowStart,
    deselection.rowEnd,
  )
    .filter((r) => r.section !== "center-center")
    .map(({ section: _, ...rest }) => rest);
}
