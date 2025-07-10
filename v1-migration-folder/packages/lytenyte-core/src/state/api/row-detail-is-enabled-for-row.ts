import type { Grid, GridApi } from "../../+types";

export const makeRowDetailIsEnabledForRow = (
  grid: Grid<any>,
): GridApi<any>["rowDetailIsEnabledForRow"] => {
  return (rowOrId) => {
    const predicate = grid.state.rowDetailEnabled.get();
    if (!predicate) return false;

    const row = typeof rowOrId === "string" ? grid.api.rowById(rowOrId) : rowOrId;
    if (!row) return false;

    if (predicate === true) {
      return row.kind === "leaf";
    }

    return predicate.fn({ grid, row });
  };
};
