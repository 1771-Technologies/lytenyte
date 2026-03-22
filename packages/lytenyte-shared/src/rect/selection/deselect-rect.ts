import { splitRect } from "../split-rect.js";
import type { DataRect } from "../types.js";

/**
 * Removes `deselection` from `rect` and returns the remaining fragments. The
 * original rect is split into up to eight surrounding sub-rects and the
 * overlapping center piece is discarded.
 */
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
