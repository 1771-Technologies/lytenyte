import { useCallback, useMemo, useState } from "react";
import { rowPositions, type RowSource } from "@1771technologies/lytenyte-shared";
import type { Root } from "../root.js";

const EMPTY_POSITION_ARRAY = new Uint32Array([0]);

export function useYPositions(
  props: Root.Props,
  rowSource: RowSource,
  height: number,
  detailExpansions: Set<string>,
) {
  const rowCount = rowSource.useRowCount();

  const rows = rowSource.useRows();
  const rowIndexToRowId = useCallback(
    (i: number) => {
      return rows.get(i)?.id ?? null;
    },
    [rows],
  );

  const [rowCache, setRowCache] = useState<Record<string, number>>({});
  const [detailCache, setDetailCache] = useState<Record<string, number>>({});

  return useMemo(() => {
    const detailHeight = props.rowDetailHeight ?? 200;
    const detailHeightGuess = props.rowDetailAutoHeightGuess ?? 200;
    const rowHeight = props.rowHeight ?? 40;
    const rowHeightGuess = props.rowAutoHeightGuess ?? 40;

    const detailHeightCalc = (id: string | null) => {
      if (!id || !detailExpansions.has(id)) return 0;

      if (detailHeight === "auto") return detailCache[id] ?? detailHeightGuess;
      return detailHeight;
    };

    const [positions, idToPositions] =
      height <= 0 && typeof rowHeight === "string"
        ? [EMPTY_POSITION_ARRAY, new Map()]
        : rowPositions(
            rowCount,
            rowHeight,
            rowHeightGuess,
            rowCache,
            detailHeightCalc,
            height,
            rowIndexToRowId,
          );

    return { positions, setRowCache, setDetailCache, detailCache, idToPositions };
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
    rowIndexToRowId,
  ]);
}
