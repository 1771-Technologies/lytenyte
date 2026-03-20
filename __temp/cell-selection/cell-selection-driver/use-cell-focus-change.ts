import type { PieceWritable } from "@1771technologies/lytenyte-core";
import { equal, type PositionUnion } from "@1771technologies/lytenyte-shared";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { API, DataRect, DataRectSplit } from "../../types";
import { dataRectFromCellPosition } from "../data-rect-from-cell-position.js";
import { adjustRectForRowAndCellSpan } from "../adjust-rect-for-row-and-cell-span.js";

export function useCellFocusChange(
  focusActive: PieceWritable<PositionUnion | null>,
  excludeMarker: boolean,
  keepSelection: boolean,
  onCellSelectionChange: (c: DataRect[]) => void,
  setCellSelectionAdditiveRects: Dispatch<SetStateAction<DataRectSplit[] | null>>,
  api: API,
) {
  const focus = focusActive.useValue();
  const prevRef = useRef<PositionUnion | null>(null);

  useEffect(() => {
    if (!focus) return;

    const prev = prevRef.current;
    if (equal(prev, focus)) return;
    prevRef.current = focus;

    if (focus.colIndex === 0 && excludeMarker) {
      return;
    }

    if (!keepSelection && focus?.kind !== "cell" && focus?.kind !== "full-width") {
      onCellSelectionChange([]);
      setCellSelectionAdditiveRects([]);
    } else if (focus.kind === "cell" || focus.kind === "full-width") {
      const rect =
        focus.kind === "full-width"
          ? {
              rowStart: focus.rowIndex,
              rowEnd: focus.rowIndex + 1,
              columnStart: focus.colIndex,
              columnEnd: focus.colIndex + 1,
            }
          : dataRectFromCellPosition(focus);

      onCellSelectionChange([adjustRectForRowAndCellSpan(api.cellRoot, rect)]);
    }
  }, [api, excludeMarker, focus, keepSelection, onCellSelectionChange, setCellSelectionAdditiveRects]);
}
