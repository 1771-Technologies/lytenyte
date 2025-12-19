import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export function useVirtualizedHeader(
  layout: LayoutHeader[][],
  colStartBound: number,
  colEndBound: number,
): LayoutHeader[][] {
  const virtualizedHeaderCells = useMemo(() => {
    return layout.map((row) => {
      return row.filter((col) => {
        return col.colStart >= colStartBound && col.colStart < colEndBound;
      });
    });
  }, [colEndBound, colStartBound, layout]);

  return virtualizedHeaderCells;
}
