import type { Grid, GridApi, RowNode } from "../../+types";
import { getDataRect } from "../helpers/get-data-rect.js";

export const makeExportDataRect = (grid: Grid<any>): GridApi<any>["exportDataRect"] => {
  return (p) => {
    const s = grid.state;

    const rowCount = s.rowDataStore.rowCount.get();
    const visible = s.columnMeta.get().columnsVisible;

    const rowStart = p?.dataRect?.rowStart ?? 0;
    const rowEnd = p?.dataRect?.rowEnd ?? rowCount;
    const columnStart = p?.dataRect?.columnStart ?? 0;
    const columnEnd = p?.dataRect?.columnEnd ?? visible.length;

    const rows: (RowNode<any> | null)[] = [];
    for (let i = rowStart; i < rowEnd; i++) {
      rows.push(grid.api.rowByIndex(i) ?? null);
    }

    return getDataRect({
      rows,
      visible,
      columnField: grid.api.columnField as any,
      uniformGroupHeaders: p?.uniformGroupHeaders,
      columnEnd,
      columnStart,
    });
  };
};
