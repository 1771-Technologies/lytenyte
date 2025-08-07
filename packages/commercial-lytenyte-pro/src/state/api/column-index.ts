import type { Grid, GridApi } from "../../+types";

export const makeColumnIndex = (grid: Grid<any>): GridApi<any>["columnIndex"] => {
  return (columnOrId) => {
    const v = grid.state.columnMeta.get().columnsVisible;

    const id = typeof columnOrId === "string" ? columnOrId : columnOrId.id;

    return v.findIndex((c) => c.id === id);
  };
};
