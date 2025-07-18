import type { Grid, GridApi } from "../../+types";

export const makeRowGroupToggle = (grid: Grid<any>): GridApi<any>["rowGroupToggle"] => {
  return (row, state) => {
    const api = grid.api;
    const next = state == null ? !api.rowGroupIsExpanded(row) : state;

    api.rowGroupApplyExpansions({ [row.id]: next });
  };
};
