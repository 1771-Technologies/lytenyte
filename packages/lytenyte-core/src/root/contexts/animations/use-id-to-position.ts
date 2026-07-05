import { useMemo } from "react";
import type { RowPin, RowSource } from "@1771technologies/lytenyte-shared";
import type { PositionEntry } from "./types.js";

export function useIdToPosition(
  source: RowSource,
  yPositions: Uint32Array,
  topCount: number,
  bottomCount: number,
  rowCount: number,
): Record<string, PositionEntry> {
  return useMemo(() => {
    const positions: Record<string, PositionEntry> = {};
    const bottomCutoff = rowCount - bottomCount;

    for (let i = 0; i < yPositions.length - 1; i++) {
      const id = source.rowByIndex(i).get()?.id;
      if (!id) continue;

      const pin: RowPin = i < topCount ? "top" : i >= bottomCutoff ? "bottom" : null;
      positions[id] = { y: yPositions[i], pin };
    }

    return positions;
  }, [source, yPositions, topCount, bottomCount, rowCount]);
}
