import type { HeaderLayoutCell } from "../layout";
import { useMemo } from "react";

export function useVirtualizedHeader(
  layout: HeaderLayoutCell<any>[][],
  colStartBound: number,
  colEndBound: number,
): HeaderLayoutCell<any>[][] {
  const virtualizedHeaderCells = useMemo(() => {
    return layout.map((row) => {
      return row.filter((col) => {
        return col.colStart >= colStartBound && col.colStart < colEndBound;
      });
    });
  }, [colEndBound, colStartBound, layout]);

  return virtualizedHeaderCells;
}
