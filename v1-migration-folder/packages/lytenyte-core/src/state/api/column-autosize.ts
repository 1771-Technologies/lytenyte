import type { Column, Grid, GridApi } from "../../+types";
import { resolveColumn } from "../helpers/resolve-column";

export const makeColumnAutosize = (grid: Grid<any>): GridApi<any>["columnAutosize"] => {
  return (params) => {
    const errorRef = { current: false };
    const meta = grid.state.columnMeta.get();
    const columns =
      (params.columns
        ?.map((c) => resolveColumn(c, errorRef, meta))
        .map((c) => c && grid.api.columnById(c))
        .filter(Boolean) as Column<any>[]) ?? grid.state.columnMeta.get().columnsVisible;

    return {};
  };
};
