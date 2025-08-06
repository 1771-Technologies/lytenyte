import type { Column, Grid } from "../+types";

export function cycleSorts<T>(grid: Grid<T>, column: Column<T>) {
  const current = grid.api.sortForColumn(column.id);

  if (current) {
    if (current.sort.isDescending) grid.state.sortModel.set([]);
    else
      grid.state.sortModel.set([
        { columnId: column.id, sort: { kind: "string" }, isDescending: true },
      ]);
  } else {
    grid.state.sortModel.set([
      { columnId: column.id, sort: { kind: "string" }, isDescending: false },
    ]);
  }
}
