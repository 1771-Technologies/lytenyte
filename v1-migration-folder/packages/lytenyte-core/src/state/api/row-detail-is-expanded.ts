import type { Grid, GridApi } from "../../+types";

export const makeRowDetailIsExpanded = (grid: Grid<any>): GridApi<any>["rowDetailIsExpanded"] => {
  return (rowOrId) => {
    const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;

    if (!grid.api.rowDetailIsEnabledForRow(id)) return false;

    return grid.state.rowDetailExpansions.get().has(id);
  };
};
