import type { DataRect, Grid } from "../+types";

export function isCenterRect(grid: Grid<any>, rect: DataRect) {
  const ds = grid.state.rowDataStore;

  const bottomStart = ds.rowCount.get() - ds.rowBottomCount.get();

  return rect.rowStart < bottomStart && rect.rowStart >= ds.rowTopCount.get();
}
