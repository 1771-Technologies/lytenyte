import { focusCell } from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "../+types";
import type { Column, Grid, GridApi } from "../../+types";
import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import { editOnChange } from "../helpers/edit-on-change.js";

export const makeEditBegin = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["editBegin"] => {
  return (params) => {
    if (grid.state.editCellMode.get() === "readonly") return;
    // Start by canceling existing edits
    grid.api.editEnd();

    // We must be editing a valid cell location
    const rowCount = grid.state.rowDataStore.rowCount.get();
    if (params.rowIndex < 0 || params.rowIndex >= rowCount) return;

    const i = grid.internal;
    const meta = grid.state.columnMeta.get();

    // The column must be presently rendered for it to be editable
    let column: Column<any> | undefined;
    if (typeof params.column === "string") column = meta.columnLookup.get(params.column);
    else if (typeof params.column === "number") column = meta.columnsVisible.at(params.column);
    else column = meta.columnsVisible.find((c) => c.id === (params.column as Column<any>).id);
    if (!column) return;

    const rowNode = grid.state.rowDataSource.get().rowByIndex(params.rowIndex);
    if (!rowNode) return;

    // The column must have its editable state set to true
    const base = grid.state.columnBase.get();
    const editable = column.editable ?? base.editable;
    if (!editable) return;
    if (typeof editable === "function") {
      if (!editable({ grid, column, row: rowNode, rowIndex: params.rowIndex })) return;
    }

    grid.api.scrollIntoView({ column, row: params.rowIndex });

    // Let's try begin the cell edit.
    const run = () => {
      const columnIndex = meta.columnsVisible.indexOf(column);
      const cell = grid.api.cellRoot(params.rowIndex, columnIndex);
      if (!cell) return false;
      if (cell.kind === "full-width") return true;

      focusCell({
        getRootCell: grid.api.cellRoot,
        focusActive: i.focusActive,
        id: grid.state.gridId.get(),
        colIndex: columnIndex,
        rowIndex: params.rowIndex,
        scrollIntoView: grid.api.scrollIntoView,
        vp: grid.state.viewport.get(),
        postFocus: () => {
          let prevented = false;
          grid.api.eventFire("editBegin", {
            column,
            rowIndex: params.rowIndex,
            preventDefault: () => {
              prevented = true;
            },
          });

          if (prevented) return;

          const activeData = structuredClone(rowNode.data);
          i.editActivePos.set({ column, rowIndex: params.rowIndex });
          i.editData.set(activeData);

          if (params.init != null) {
            editOnChange({
              value: params.init,
              activeData,
              base,
              column,
              grid,
              row: rowNode,
              rowIndex: params.rowIndex,
            });
          }
        },
      });

      return true;
    };

    runWithBackoff(run, [4, 20]);

    return;
  };
};
