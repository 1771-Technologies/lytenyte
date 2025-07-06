import { focusCell, isFullWidthMap } from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "../+types";
import type { Column, Grid, GridApi } from "../../+types";
import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";

export const makeEditBegin = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["editBegin"] => {
  return (params) => {
    // Start by canceling existing edits
    grid.api.editEnd();

    // We must be editing a valid cell location
    const rowCount = grid.state.rowDataStore.rowCount.get();
    if (params.rowIndex < 0 || params.rowIndex >= rowCount) return;

    const i = grid.internal;

    const meta = grid.state.columnMeta.get();

    // The column must be presently rendered for it to be editable
    let column: Column<any> | undefined;
    if (typeof params.column === "string") meta.columnLookup.get(params.column);
    else if (typeof params.column === "number") meta.columnsVisible.at(params.column);
    else column = meta.columnsVisible.find((c) => c.id === (params.column as Column<any>).id);
    if (!column) return;

    // The column must have its editable state set to true
    const base = grid.state.columnBase.get();
    const editable = column.editable ?? base.editable;
    if (!editable) return;
    if (typeof editable === "function") {
      const row = grid.state.rowDataSource.get().rowByIndex(params.rowIndex);
      if (!row) return;
      if (!editable({ grid, column, row, rowIndex: params.rowIndex })) return;
    }

    grid.api.scrollIntoView({ column, row: params.rowIndex });

    // Let's try begin the cell edit.
    const run = () => {
      const layout = i.layout.get();

      const row = layout.get(params.rowIndex);
      if (!row) return false;
      if (isFullWidthMap(row)) return true;

      const columnIndex = meta.columnsVisible.indexOf(column);
      const cell = layout.get(columnIndex);
      if (!cell) return false;

      focusCell({
        layout,
        focusActive: i.focusActive,
        id: grid.state.gridId.get(),
        colIndex: columnIndex,
        rowIndex: params.rowIndex,
        scrollIntoView: grid.api.scrollIntoView,
        vp: grid.state.viewport.get(),
        postFocus: () => {
          i.editActivePos.set({ column, rowIndex: params.rowIndex });
        },
      });

      // TODO: Add event here: edit begin

      return true;
    };

    runWithBackoff(run, [4, 20]);

    return;
  };
};
