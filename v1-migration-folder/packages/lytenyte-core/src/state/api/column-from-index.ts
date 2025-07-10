import type { Grid, GridApi } from "../../+types";

export const makeColumnFromIndex = (grid: Grid<any>): GridApi<any>["columnFromIndex"] => {
  return (index) => {
    const v = grid.state.columnMeta.get().columnsVisible;

    return v[index] ?? null;
  };
};
