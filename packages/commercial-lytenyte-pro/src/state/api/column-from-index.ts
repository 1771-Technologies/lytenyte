import type { Grid, GridApi } from "../../+types";

export const makeColumnByIndex = (grid: Grid<any>): GridApi<any>["columnByIndex"] => {
  return (index) => {
    const v = grid.state.columnMeta.get().columnsVisible;

    return v[index] ?? null;
  };
};
