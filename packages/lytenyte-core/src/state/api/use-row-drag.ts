import { getNearestRow, getRowIndexFromEl, useDraggable } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";

export const makeUseRowDrag = (grid: Grid<any>): GridApi<any>["useRowDrag"] => {
  return (params) => {
    const c = useDraggable({
      ...params,
      placeholder: params.placeholder
        ? (d) => {
            return params.placeholder!({
              grid,
              dragData: d,
            });
          }
        : undefined,
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
