import { getNearestRow, getRowIndexFromEl } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";
import { useDraggable } from "../../drag-and-drop/index.js";

export const makeUseRowDrag = (grid: Grid<any>): GridApi<any>["useRowDrag"] => {
  return (params) => {
    const c = useDraggable({
      ...params,
      getItems: (el) => {
        const nearestRow = getNearestRow(grid.state.gridId.get(), el);
        if (!nearestRow) return {};
        const rowIndex = getRowIndexFromEl(nearestRow);
        const row = grid.api.rowByIndex(rowIndex);
        if (!row) return {};

        return params.getDragData({ grid, row });
      },
    });
    return c;
  };
};
