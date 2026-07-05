import { useMemo } from "react";
import type { ColumnAbstract } from "@1771technologies/lytenyte-shared";
import type { ColumnPositionEntry } from "./column-types.js";

export function useColumnIdToPosition(
  visibleColumns: ColumnAbstract[],
  xPositions: Uint32Array,
): Record<string, ColumnPositionEntry> {
  return useMemo(() => {
    const positions: Record<string, ColumnPositionEntry> = {};

    for (let i = 0; i < visibleColumns.length; i++) {
      const col = visibleColumns[i];
      positions[col.id] = { index: i, x: xPositions[i], pin: col.pin ?? null };
    }

    return positions;
  }, [visibleColumns, xPositions]);
}
