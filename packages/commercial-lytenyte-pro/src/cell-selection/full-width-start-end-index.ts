import type { Grid } from "../+types.js";

export function fullWidthStartEndIndex(grid: Grid<any>) {
  const meta = grid.state.columnMeta.get();

  const lastIndex = meta.columnsVisible.length;

  return [0, lastIndex];
}
