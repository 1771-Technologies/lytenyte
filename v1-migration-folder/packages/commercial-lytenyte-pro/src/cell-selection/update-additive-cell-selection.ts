import { boundSelectionRect } from "./bound-selection-rect";
import { adjustRectForRowAndCellSpan } from "./adjust-rect-for-row-and-cell-span";
import { areRectsEqual } from "./are-rects-equal";
import { splitCellSelectionRect } from "./split-cell-selection-rect";
import type { DataRect, Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";

export function updateAdditiveCellSelection(
  grid: Grid<any> & { internal: InternalAtoms },
  rect: DataRect,
) {
  const s = grid.state.columnMeta.get();
  const ds = grid.state.rowDataStore;

  const rowCount = ds.rowCount.get();
  const rowBottomCount = ds.rowBottomCount.get();
  const rowTopCount = ds.rowTopCount.get();

  const rects = splitCellSelectionRect({
    rect: boundSelectionRect(grid, adjustRectForRowAndCellSpan(grid, rect)),

    colCenterCount: s.columnVisibleCenterCount,
    colStartCount: s.columnVisibleStartCount,

    rowCenterCount: rowCount - rowTopCount - rowBottomCount,
    rowTopCount: rowTopCount,
  });

  const current = grid.internal.cellSelectionAdditiveRects.get();
  if (current && current.length === rects.length) {
    if (current.every((c, i) => areRectsEqual(c, rects[i]))) return;
  }

  grid.internal.cellSelectionAdditiveRects.set(rects);
}
