import type { Grid, GridApi } from "../../+types";

export const makeRowById = (grid: Grid<any>): GridApi<any>["rowById"] => {
  return (id) => {
    return grid.state.rowDataSource.get().rowById(id);
  };
};
