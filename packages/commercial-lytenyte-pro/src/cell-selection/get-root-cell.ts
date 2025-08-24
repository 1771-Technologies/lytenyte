import type { Grid, PositionGridCell } from "../+types.js";

export const getRootCell = (
  grid: Grid<any>,
  rowIndex: number,
  columnIndex: number,
): PositionGridCell["root"] => {
  const c = grid.api.cellRoot(rowIndex, columnIndex);

  if (!c || c.kind === "full-width") return null;

  return c.root;
};
