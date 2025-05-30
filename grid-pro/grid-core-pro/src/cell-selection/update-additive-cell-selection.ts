import { boundSelectionRect } from "./bound-selection-rect";
import { adjustRectForRowAndCellSpan } from "./adjust-rect-for-row-and-cell-span";
import { areRectsEqual } from "./are-rects-equal";
import { splitCellSelectionRect } from "./split-cell-selection-rect";
import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function updateAdditiveCellSelection<D, E>(api: ApiPro<D, E>, rect: CellSelectionRectPro) {
  const s = api.getState();
  const rects = splitCellSelectionRect({
    rect: boundSelectionRect(api, adjustRectForRowAndCellSpan(api, rect)),
    colCenterCount: s.columnVisibleCenterCount.peek(),
    colStartCount: s.columnVisibleStartCount.peek(),
    rowCenterCount:
      s.internal.rowCount.peek() - s.internal.rowTopCount.peek() - s.internal.rowBottomCount.peek(),
    rowTopCount: s.internal.rowTopCount.peek(),
  });

  const current = s.internal.cellSelectionAdditiveRects.peek();
  if (current && current.length === rects.length) {
    if (current.every((c, i) => areRectsEqual(c, rects[i]))) return;
  }

  s.internal.cellSelectionAdditiveRects.set(rects);
}
