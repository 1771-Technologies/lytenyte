import type { DataRect, Grid } from "../+types.js";

export function isTopRect(grid: Grid<any>, rect: DataRect) {
  const topCount = grid.state.rowDataStore.rowTopCount.get();
  return rect.rowStart < topCount;
}
