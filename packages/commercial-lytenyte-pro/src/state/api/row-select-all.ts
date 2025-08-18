import type { Grid, GridApi } from "../../+types";

export const makeRowSelectAll = (grid: Grid<any>): GridApi<any>["rowSelectAll"] => {
  return (p) => {
    let stop = false;
    grid.api.eventFire("rowSelectAllBegin", {
      deselect: p?.deselect ?? false,
      grid,
      preventDefault: () => {
        stop = true;
      },
    });
    if (stop) return;

    const rds = grid.state.rowDataSource.get();
    rds.rowSelectAll(p ?? {});

    grid.api.eventFire("rowSelectAllEnd", { deselect: !!p?.deselect, grid });
  };
};
