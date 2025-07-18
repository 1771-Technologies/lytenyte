import type { Grid, GridApi } from "../../+types";

export const makeColumnById = (grid: Grid<any>): GridApi<any>["columnById"] => {
  return (id) => {
    const lookup = grid.state.columnMeta.get();
    return lookup.columnLookup.get(id);
  };
};
