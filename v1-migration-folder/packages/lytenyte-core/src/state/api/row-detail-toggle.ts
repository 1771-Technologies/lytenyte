import type { Grid, GridApi } from "../../+types";

export const makeRowDetailToggle = (grid: Grid<any>): GridApi<any>["rowDetailToggle"] => {
  return (rowOrId, state) => {
    const row =
      typeof rowOrId === "string" ? grid.api.rowById(rowOrId) : grid.api.rowById(rowOrId.id);

    if (!row) return;

    const isExpanded = grid.api.rowDetailIsExpanded(rowOrId);

    const v = state != null ? state : !isExpanded;
    if (v === isExpanded) return;

    const s = grid.state.rowDetailExpansions.get();
    const next = new Set(s);

    if (v) next.add(row.id);
    else next.delete(row.id);

    grid.state.rowDetailExpansions.set(next);
  };
};
