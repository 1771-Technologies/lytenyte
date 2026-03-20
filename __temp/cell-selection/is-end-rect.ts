import type { ColumnView } from "@1771technologies/lytenyte-shared";

export function isEndRect(view: ColumnView, rect: { columnStart: number; columnEnd: number }) {
  return rect.columnStart >= view.startCount + view.centerCount;
}
