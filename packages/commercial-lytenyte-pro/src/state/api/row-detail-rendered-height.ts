import type { InternalAtoms } from "../+types.js";
import type { Grid, GridApi } from "../../+types.js";

export const makeRowDetailRenderedHeight = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["rowDetailRenderedHeight"] => {
  return (rowOrId) => {
    const index = grid.state.rowDataSource
      .get()
      .rowToIndex(typeof rowOrId === "string" ? rowOrId : rowOrId.id);
    if (index == null || !grid.api.rowDetailIsExpanded(rowOrId)) return 0;

    const rowDetailHeight = grid.state.rowDetailHeight.get();
    if (typeof rowDetailHeight === "number") return rowDetailHeight;

    const cache = grid.internal.rowDetailAutoHeightCache.get();
    return cache[index] ?? grid.state.rowDetailAutoHeightGuess.get();
  };
};
