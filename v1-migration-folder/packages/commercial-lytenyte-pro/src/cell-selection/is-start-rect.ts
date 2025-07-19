import type { Grid } from "../+types";

export function isStartRect(grid: Grid<any>, rect: { columnStart: number; columnEnd: number }) {
  const meta = grid.state.columnMeta.get();
  return rect.columnStart < meta.columnVisibleStartCount;
}
