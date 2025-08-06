import type { Grid, GridApi } from "../../+types";

export const makeRowDetailIsExpanded = (grid: Grid<any>): GridApi<any>["rowDetailIsExpanded"] => {
  return (rowOrId) => {
    const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;
    return grid.state.rowDetailExpansions.get().has(id);
  };
};
