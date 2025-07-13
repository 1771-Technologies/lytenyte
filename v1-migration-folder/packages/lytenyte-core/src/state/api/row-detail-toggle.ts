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

    let prevented = false;
    grid.api.eventFire("rowDetailExpansionBegin", {
      expansions: next,
      grid: grid,
      preventDefault: () => {
        prevented = true;
      },
    });

    if (prevented) return;

    grid.state.rowDetailExpansions.set(next);

    grid.api.eventFire("rowDetailExpansionEnd", {
      expansions: next,
      grid: grid,
    });
  };
};
