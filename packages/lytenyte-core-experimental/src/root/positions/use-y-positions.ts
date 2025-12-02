import { useMemo } from "react";
import type { RowHeight, RowSource } from "../../types/row.js";
import { AnyObject, EMPTY_POSITION_ARRAY } from "../../constants.js";
import { computeRowPositions } from "@1771technologies/lytenyte-shared";

export function useYPositions(
  rowSource: RowSource,
  vp: HTMLElement | null,
  innerHeight: number,
  rowHeight: RowHeight,
  headerHeight: number,
) {
  const rowCount = rowSource.useRowCount();
  const snapshot = rowSource.useSnapshotVersion();

  return useMemo(() => {
    // Rerun the memo whenever the snapshot changes.
    void snapshot;
    if (!vp) return EMPTY_POSITION_ARRAY;
    return computeRowPositions(
      rowCount,
      rowHeight,
      40,
      AnyObject,
      () => {
        return 0;
      },
      innerHeight - headerHeight,
    );
  }, [headerHeight, innerHeight, rowCount, rowHeight, snapshot, vp]);
}
