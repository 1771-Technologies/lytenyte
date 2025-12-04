import { useMemo } from "react";
import { AnyObject, EMPTY_POSITION_ARRAY } from "../../constants.js";
import { computeRowPositions } from "@1771technologies/lytenyte-shared";
import type { RowHeight, RowSource } from "../../types/row.js";

export function useYPositions(
  rowSource: RowSource,
  vp: HTMLElement | null,
  innerHeight: number,
  rowHeight: RowHeight,
  headerHeight: number,
  detailHeight: number | "auto",
  detailHeightCache: Record<string, number>,
  detailHeightGuess: number,
  detailHeightExpansions: Set<string>,
) {
  const rowCount = rowSource.useRowCount();
  const snapshot = rowSource.useSnapshotVersion();

  return useMemo(() => {
    const detailHeightCalc = (i: number) => {
      const id = rowSource.rowIndexToRowId(i);
      if (!id || !detailHeightExpansions.has(id)) return 0;

      if (detailHeight === "auto") return detailHeightCache[id] ?? detailHeightGuess;
      return detailHeight;
    };
    // Rerun the memo whenever the snapshot changes.
    void snapshot;
    if (!vp) return EMPTY_POSITION_ARRAY;
    return computeRowPositions(
      rowCount,
      rowHeight,
      40,
      AnyObject,
      detailHeightCalc,
      innerHeight - headerHeight,
    );
  }, [
    detailHeight,
    detailHeightCache,
    detailHeightExpansions,
    detailHeightGuess,
    headerHeight,
    innerHeight,
    rowCount,
    rowHeight,
    rowSource,
    snapshot,
    vp,
  ]);
}
