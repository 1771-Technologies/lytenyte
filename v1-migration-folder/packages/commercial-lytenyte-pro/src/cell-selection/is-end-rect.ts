import type { Grid } from "../+types";

export function isEndRect(grid: Grid<any>, rect: { columnStart: number; columnEnd: number }) {
  const meta = grid.state.columnMeta.get();
  return rect.columnStart >= meta.columnVisibleStartCount + meta.columnVisibleCenterCount;
}
