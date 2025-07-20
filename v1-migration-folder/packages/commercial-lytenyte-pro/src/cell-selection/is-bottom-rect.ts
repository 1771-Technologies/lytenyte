import type { DataRect, Grid } from "../+types";

export function isBottomRect(grid: Grid<any>, rect: DataRect) {
  const s = grid.state.rowDataStore;

  const rowCount = s.rowCount.get();
  const botCount = s.rowBottomCount.get();

  const bottomStart = rowCount - botCount;

  return rect.rowStart >= bottomStart;
}
