import { getNearestRow, getRowIndexFromEl } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";
import type { InternalAtoms } from "../+types";

export const makeRowHandleSelect = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["rowHandleSelect"] => {
  return (e) => {
    const mode = grid.state.rowSelectionMode.get();
    if (mode === "none") return;

    const rowEl = getNearestRow(grid.state.gridId.get(), e.target as HTMLElement);
    if (!rowEl) return;

    const row = grid.api.rowByIndex(getRowIndexFromEl(rowEl));
    if (!row) return;

    if (mode === "single") {
      grid.api.rowSelect({
        selected: row.id,
        deselect: grid.state.rowSelectedIds.get().has(row.id),
      });
      return;
    }

    if (mode === "multiple") {
      // We are doing an additive select
      if (e.shiftKey) {
        const isDeselect = grid.internal.rowSelectionLastWasDeselect.get();

        grid.api.rowSelect({
          selected: row.id,
          deselect: isDeselect,
          selectBetweenPivot: true,
          selectChildren: grid.state.rowSelectChildren.get(),
        });
      } else {
        const isDeselect = grid.state.rowSelectedIds.get().has(row.id);

        grid.api.rowSelect({
          selected: row.id,
          deselect: isDeselect,
          pivot: row.id,
          selectBetweenPivot: false,
          selectChildren: grid.state.rowSelectChildren.get(),
        });
      }
    }
  };
};
