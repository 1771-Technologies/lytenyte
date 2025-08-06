import type { Grid, GridApi } from "../../+types";

export const makeRowGroupIsExpanded = (grid: Grid<any>): GridApi<any>["rowGroupIsExpanded"] => {
  return (row) => {
    const mode = grid.state.columnPivotMode.get();
    const expansions = mode
      ? grid.state.columnPivotRowGroupExpansions.get()
      : grid.state.rowGroupExpansions.get();

    const expanded = expansions[row.id];
    if (typeof expanded === "boolean") return expanded;

    const defaultExpansion = grid.state.rowGroupDefaultExpansion.get();
    if (typeof defaultExpansion === "boolean") return defaultExpansion;

    return row.depth <= defaultExpansion;
  };
};
