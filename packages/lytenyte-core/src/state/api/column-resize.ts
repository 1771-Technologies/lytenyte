import type { Grid, GridApi } from "../../+types";

export const makeColumnResize = (grid: Grid<any>): GridApi<any>["columnResize"] => {
  return (updates) => {
    const api = grid.api;
    const columnUpdates = Object.fromEntries(
      Object.entries(updates)
        .map(([c, v]) => [c, { width: v }] as const)
        .filter((c) => api.columnById(c[0])),
    );

    api.columnUpdate(columnUpdates);
  };
};
