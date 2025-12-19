import { useMemo } from "react";
import type { RowMeta } from "./context.js";
import type { LayoutRowWithCells } from "../../layout.js";
import { useBounds } from "../../root/bounds/context.js";
import { $colEndBound, $colStartBound } from "../../selectors/selectors.js";

export function useRowContextValue(row: LayoutRowWithCells<any>, yPositions: Uint32Array, xPositions: Uint32Array) {
  const r = row.row.useValue();
  const bounds = useBounds();
  const start = bounds.useValue($colStartBound);
  const end = bounds.useValue($colEndBound);

  const value = useMemo<RowMeta>(() => {
    return {
      row: r,
      layout: row,
      xPositions,
      yPositions,
      bounds: [start, end],
    };
  }, [end, r, row, start, xPositions, yPositions]);

  return value;
}
