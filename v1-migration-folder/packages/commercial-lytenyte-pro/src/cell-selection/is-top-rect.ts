import type { DataRect, Grid } from "../+types";

export function isTopRect(grid: Grid<any>, rect: DataRect) {
  const topCount = grid.state.rowDataStore.rowTopCount.get();
  return rect.rowStart < topCount;
}
