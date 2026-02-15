import { measureText } from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "../+types.js";
import type { AutosizeCellParams, AutosizeHeaderParams, Column, Grid, GridApi } from "../../+types";
import { resolveColumn } from "../helpers/resolve-column.js";

export const makeColumnAutosize = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["columnAutosize"] => {
  return (params) => {
    const errorRef = { current: false };
    const meta = grid.state.columnMeta.get();

    const columns =
      (params.columns
        ?.map((c) => resolveColumn(c, errorRef, meta))
        .map((c) => c && (typeof c === "string" ? grid.api.columnById(c) : c))
        .filter(Boolean) as Column<any>[]) ?? grid.state.columnMeta.get().columnsVisible;

    if (errorRef.current) {
      console.error("Invalid column autosize column params");
      return {};
    }
    if (columns.length === 0) return {};

    const base = grid.state.columnBase.get();
    const result: Record<string, number> = {};

    const bounds = grid.state.viewBounds.get();

    const rowFirstVisible = bounds.rowCenterStart;
    const rowLastVisible = bounds.rowCenterEnd;
    const rowTopCount = grid.state.rowDataStore.rowTopCount.get();
    const rowBottomCount = grid.state.rowDataStore.rowBottomCount.get();
    const rowCount = grid.state.rowDataStore.rowCount.get();

    const rowStart = Math.max(rowFirstVisible, 0);
    const rowEnd = rowLastVisible === 0 ? Math.min(50, rowCount - rowBottomCount) : rowLastVisible;
    calculateWidths(rowStart, rowEnd);
    if (rowTopCount) calculateWidths(0, rowTopCount);
    if (rowBottomCount) calculateWidths(rowCount - rowBottomCount, rowCount);

    if (params?.includeHeader) {
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];

        const autoFn = column.autosizeHeaderFn ?? base.autosizeHeaderFn ?? defaultAutosizeHeader;

        const width = autoFn({ grid, column: column as any });

        if (width != null) result[column.id] = Math.max(width, result[column.id]);
      }
    }

    if (params?.dryRun) return result;

    const updates = Object.fromEntries(
      Object.entries(result).map(([key, v]) => [key, { width: v }] as const),
    );

    grid.api.columnUpdate(updates);

    return result;

    function calculateWidths(start: number, end: number) {
      for (let rowIndex = start; rowIndex < end; rowIndex++) {
        const row = grid.api.rowByIndex(rowIndex);
        if (!row) continue;

        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];

          const autoFn = column.autosizeCellFn ?? base.autosizeCellFn ?? defaultAutosize;
          const width = autoFn({ column, grid, row });
          result[column.id] ??= 0;

          if (width != null) result[column.id] = Math.max(width, result[column.id]);
        }
      }
    }
  };
};

function defaultAutosize(c: AutosizeCellParams<any>) {
  const field = c.grid.api.columnField(
    c.column,
    c.row.kind === "leaf"
      ? { kind: "leaf", data: c.row.data }
      : { kind: "branch", data: c.row.data, key: c.row.key },
  );

  return (measureText(`${field}`, c.grid.state.viewport.get() ?? undefined)?.width ?? 200) + 8;
}

function defaultAutosizeHeader(c: AutosizeHeaderParams<any>) {
  const text = c.column.name ?? c.column.id;

  return (measureText(text, c.grid.state.viewport.get() ?? undefined)?.width ?? 200) + 8;
}
