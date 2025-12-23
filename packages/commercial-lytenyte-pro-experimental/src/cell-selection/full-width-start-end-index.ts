import type { ColumnView } from "@1771technologies/lytenyte-shared";

export function fullWidthStartEndIndex(view: ColumnView) {
  const lastIndex = view.visibleColumns.length;

  return [0, lastIndex];
}
