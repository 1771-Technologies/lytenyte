import { useMemo } from "react";
import type { ColumnAbstract, SpanLayout } from "@1771technologies/lytenyte-shared";

export function useWindowedColumnIds(
  visibleColumns: ColumnAbstract[],
  bounds: SpanLayout,
  virtualizeCols: boolean | undefined,
): Set<string> {
  return useMemo(() => {
    const ids = new Set<string>();
    const add = (i: number) => {
      const col = visibleColumns[i];
      if (col) ids.add(col.id);
    };

    const centerStart = virtualizeCols === false ? bounds.colStartEnd : bounds.colCenterStart;
    const centerEnd = virtualizeCols === false ? bounds.colCenterLast : bounds.colCenterEnd;

    for (let i = 0; i < bounds.colStartEnd; i++) add(i);
    for (let i = centerStart; i < centerEnd; i++) add(i);
    for (let i = bounds.colEndStart; i < bounds.colEndEnd; i++) add(i);

    return ids;
  }, [visibleColumns, bounds, virtualizeCols]);
}
