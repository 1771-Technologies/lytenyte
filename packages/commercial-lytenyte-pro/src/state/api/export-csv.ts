import type { Grid, GridApi, RowNode } from "../../+types";
import { getDataRect } from "../helpers/get-data-rect";

export const makeExportCsv = (grid: Grid<any>): GridApi<any>["exportCsv"] => {
  return async (p) => {
    const visible = grid.state.columnMeta.get().columnsVisible;
    const rowCount = grid.state.rowDataStore.rowCount.get();
    const rowStart = p?.dataRect?.rowStart ?? 0;
    const rowEnd = p?.dataRect?.rowEnd ?? rowCount;
    const columnStart = p?.dataRect?.columnStart ?? 0;
    const columnEnd = p?.dataRect?.columnEnd ?? visible.length;

    const rows: (RowNode<any> | null)[] = [];
    for (let i = rowStart; i < rowEnd; i++) {
      rows.push(grid.api.rowByIndex(i) ?? null);
    }

    const { data, groupHeaders, headers } = getDataRect({
      rows,
      columnField: grid.api.columnField as any,
      visible,
      columnStart,
      columnEnd,
      uniformGroupHeaders: p?.uniformGroupHeaders,
    });

    const final = [...data];

    if (p?.includeHeader) final.unshift(headers);
    if (p?.includeGroupHeaders) final.unshift(...groupHeaders);

    return final
      .map((c) => {
        return c.map((x) => `"${x}"`).join(p?.delimiter ?? ",");
      })
      .join("\n");
  };
};
export const makeExportCsvFile = (grid: Grid<any>): GridApi<any>["exportCsvFile"] => {
  return async (p) => {
    const csv = await grid.api.exportCsv(p);

    const blob = new Blob([csv], { type: "text/csv" });

    return blob;
  };
};
