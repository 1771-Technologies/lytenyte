import type { Grid } from "../+types.js";

export function isCenterColRect(grid: Grid<any>, rect: { columnStart: number; columnEnd: number }) {
  const s = grid.state.columnMeta.get();

  return (
    rect.columnStart >= s.columnVisibleStartCount &&
    rect.columnStart < s.columnVisibleCenterCount + s.columnVisibleStartCount
  );
}
