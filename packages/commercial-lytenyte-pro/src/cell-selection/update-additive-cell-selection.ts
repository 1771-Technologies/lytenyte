import { boundSelectionRect } from "./bound-selection-rect.js";
import { adjustRectForRowAndCellSpan } from "./adjust-rect-for-row-and-cell-span.js";
import { areRectsEqual } from "./are-rects-equal.js";
import { splitCellSelectionRect } from "./split-cell-selection-rect.js";
import type { DataRect, Grid } from "../+types.js";
import type { InternalAtoms } from "../state/+types.js";

export function updateAdditiveCellSelection(grid: Grid<any> & { internal: InternalAtoms }, rect: DataRect) {
  const s = grid.state.columnMeta.get();
  const ds = grid.state.rowDataStore;

  const rowTopCount = ds.rowTopCount.get();

  const adjustedRect = adjustRectForRowAndCellSpan(grid, rect);

  const rects = splitCellSelectionRect({
    rect: boundSelectionRect(grid, adjustedRect),

    colCenterCount: s.columnVisibleCenterCount,
    colStartCount: s.columnVisibleStartCount,

    rowCenterCount: ds.rowCenterCount.get(),
    rowTopCount: rowTopCount,
  });

  const current = grid.internal.cellSelectionAdditiveRects.get();
  if (current && current.length === rects.length) {
    if (current.every((c, i) => areRectsEqual(c, rects[i]))) return;
  }

  grid.internal.cellSelectionAdditiveRects.set(rects);
}
