import { useMemo } from "react";
import type { RowMeta } from "./context.js";
import type { LayoutRowWithCells } from "@1771technologies/lytenyte-shared";

export function useRowContextValue(row: LayoutRowWithCells<any>, yPositions: Uint32Array, xPositions: Uint32Array) {
  const r = row.row.useValue();

  const value = useMemo<RowMeta>(() => {
    return {
      row: r,
      layout: row,
      xPositions,
      yPositions,
    };
  }, [r, row, xPositions, yPositions]);

  return value;
}
