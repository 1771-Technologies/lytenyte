import type { Grid } from "../+types";

export function fullWidthStartEndIndex(grid: Grid<any>) {
  const meta = grid.state.columnMeta.get();

  const lastIndex = meta.columnsVisible.length;

  return [0, lastIndex];
}
