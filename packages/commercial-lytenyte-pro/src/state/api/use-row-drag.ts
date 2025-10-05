import { getNearestRow, getRowIndexFromEl } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";
import { useDraggable } from "@1771technologies/lytenyte-core/yinternal";

export const makeUseRowDrag = (grid: Grid<any>): GridApi<any>["useRowDrag"] => {
  return (params) => {
    const c = useDraggable({
      ...params,
      getItems: (el) => {
        const nearestRow = getNearestRow(el);
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
