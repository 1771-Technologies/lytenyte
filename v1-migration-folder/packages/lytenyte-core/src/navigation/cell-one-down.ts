import type { Grid } from "../+types";
import { getCellDims } from "./getters/get-cell-dims";
import { getNearestCell } from "./getters/get-nearest-cell";
import { getNearestHeaderCell } from "./getters/get-nearest-header-cell";
import { getNearestRow } from "./getters/get-nearest-row";
import { getRowsContainers } from "./getters/get-rows-containers";

export function cellOneDown(grid: Grid<any>, el?: HTMLElement) {
  if (!el) el = document.activeElement as HTMLElement;
  if (!el) return null;

  const nearestCell = getNearestCell(el);
  const nearestHeader = getNearestHeaderCell(el);
  const nearestRow = getNearestRow(el);

  // We must be focused on full width row
  if (nearestRow && !nearestCell && !nearestHeader) {
    // TODO
  }

  if (nearestHeader) {
    // Handle header
  }

  if (nearestCell) {
    const dims = getCellDims(nearestCell);
    const nextRow = dims.rowIndex + dims.rowSpan;

    const lastRow = grid.state.rowDataStore.rowCount.get();
    if (nextRow >= lastRow) return;

    // Need to scroll into view if necessary

    const container = getRowsContainers(nearestCell);

    const next = container?.querySelector(`[data-ln-row][data-ln-rowindex="${nextRow}"]`);
  }
}
