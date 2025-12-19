import { useMemo, useState } from "react";
import type { Props } from "../../types/props.js";
import type { RowSource } from "../../types/row-source.js";
import { computeRowPositions } from "@1771technologies/lytenyte-shared";

const EMPTY_POSITION_ARRAY = new Uint32Array();

export function useYPositions(props: Props, rowSource: RowSource, height: number, detailExpansions: Set<string>) {
  const rowCount = rowSource.useRowCount();
  const snapshot = rowSource.useSnapshotVersion();

  const [rowCache, setRowCache] = useState<Record<string, number>>({});
  const [detailCache, setDetailCache] = useState<Record<string, number>>({});

  return useMemo(() => {
    void snapshot;
    const detailHeight = props.rowDetailHeight ?? 200;
    const detailHeightGuess = props.rowDetailAutoHeightGuess ?? 200;
    const rowHeight = props.rowHeight ?? 40;
    const rowHeightGuess = props.rowAutoHeightGuess ?? 40;

    const detailHeightCalc = (i: number) => {
      const id = rowSource.rowIndexToRowId(i);
      if (!id || !detailExpansions.has(id)) return 0;

      if (detailHeight === "auto") return detailCache[id] ?? detailHeightGuess;
      return detailHeight;
    };

    if (height <= 0) return EMPTY_POSITION_ARRAY;

    const positions = computeRowPositions(rowCount, rowHeight, rowHeightGuess, rowCache, detailHeightCalc, height);

    return { positions, setRowCache, setDetailCache, detailCache };
  }, [
    detailCache,
    detailExpansions,
    height,
    props.rowAutoHeightGuess,
    props.rowDetailAutoHeightGuess,
    props.rowDetailHeight,
    props.rowHeight,
    rowCache,
    rowCount,
    rowSource,
    snapshot,
  ]);
}
