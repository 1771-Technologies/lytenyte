import type { Grid, GridApi, RowNode } from "../../+types";

export const makeRowSelected = (grid: Grid<any>): GridApi<any>["rowSelected"] => {
  return () => {
    const selected = grid.state.rowSelectedIds.get();

    const rds = grid.state.rowDataSource.get();
    const rows: RowNode<any>[] = [];
    for (const id of selected) {
      const row = rds.rowById(id);
      if (row) rows.push(row);
    }

    return rows;
  };
};
