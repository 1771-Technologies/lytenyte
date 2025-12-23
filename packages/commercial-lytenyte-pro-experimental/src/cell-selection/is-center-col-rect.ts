import type { ColumnView } from "@1771technologies/lytenyte-shared";

export function isCenterColRect(view: ColumnView, rect: { columnStart: number; columnEnd: number }) {
  return rect.columnStart >= view.startCount && rect.columnStart < view.centerCount + view.startCount;
}
