import type { DataRect } from "@1771technologies/lytenyte-shared";

/**
 * Returns true when `pos` is strictly inside `rect` on all four sides, meaning
 * none of its edges are flush with the corresponding edge of `rect`.
 */
export function isFullyWithinRect(pos: DataRect, rect: DataRect) {
  return (
    pos.rowStart !== rect.rowStart &&
    pos.rowEnd !== rect.rowEnd &&
    pos.columnStart !== rect.columnStart &&
    pos.columnEnd !== rect.columnEnd
  );
}
