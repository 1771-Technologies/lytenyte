import type { DataRect } from "@1771technologies/lytenyte-shared";

export function isFullyWithinRect(pos: DataRect, rect: DataRect) {
  return (
    pos.rowStart !== rect.rowStart &&
    pos.rowEnd !== rect.rowEnd &&
    pos.columnStart !== rect.columnStart &&
    pos.columnEnd !== rect.columnEnd
  );
}
