import type { ColumnView } from "@1771technologies/lytenyte-shared";

export function isStartRect(view: ColumnView, rect: { columnStart: number; columnEnd: number }) {
  return rect.columnStart < view.startCount;
}
