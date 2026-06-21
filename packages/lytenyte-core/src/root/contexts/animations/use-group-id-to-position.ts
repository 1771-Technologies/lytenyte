import { useMemo } from "react";
import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import type { ColumnPositionEntry } from "./column-types.js";

export interface GroupPositionEntry extends ColumnPositionEntry {
  readonly columnIds: string[];
}

export function useGroupIdToPosition(
  headerHierarchy: LayoutHeader[][],
  xPositions: Uint32Array,
): Record<string, GroupPositionEntry> {
  return useMemo(() => {
    const positions: Record<string, GroupPositionEntry> = {};

    for (const row of headerHierarchy) {
      for (const cell of row) {
        if (cell.kind !== "group") continue;

        positions[cell.idOccurrence] = {
          // colStart is the group's "index" - the column position it starts at. Reordering/hiding/
          // showing columns before this group shifts it; a pure width change (resize-drag,
          // columnSizeToFit) never does, since neither changes column ORDER.
          index: cell.colStart,
          x: xPositions[cell.colStart],
          pin: cell.colPin,
          columnIds: cell.columnIds,
        };
      }
    }

    return positions;
  }, [headerHierarchy, xPositions]);
}
