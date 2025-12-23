import { boundSelectionRect } from "./bound-selection-rect.js";
import { adjustRectForRowAndCellSpan } from "./adjust-rect-for-row-and-cell-span.js";
import { areRectsEqual } from "./are-rects-equal.js";
import { splitCellSelectionRect, type DataRectSplit } from "./split-cell-selection-rect.js";
import type { ColumnView } from "@1771technologies/lytenyte-shared";
import type { API, DataRect } from "../types/api.js";

export function updateAdditiveCellSelection(
  api: API,
  view: ColumnView,
  rowTopCount: number,
  rowCount: number,
  rowBottomCount: number,
  rect: DataRect,
  cellSelectionAdditiveRects: DataRectSplit[] | null,
  setSelectionAdditiveRects: (d: DataRectSplit[] | null) => void,
) {
  const s = view;

  const adjustedRect = adjustRectForRowAndCellSpan(api.cellRoot, rect);

  const rects = splitCellSelectionRect({
    rect: boundSelectionRect(view, rowCount, adjustedRect),

    colCenterCount: s.centerCount,
    colStartCount: s.startCount,

    rowCenterCount: rowCount - rowTopCount - rowBottomCount,
    rowTopCount: rowTopCount,
  });

  const current = cellSelectionAdditiveRects;
  if (current && current.length === rects.length) {
    if (current.every((c, i) => areRectsEqual(c, rects[i]))) return;
  }

  setSelectionAdditiveRects(rects);
}
