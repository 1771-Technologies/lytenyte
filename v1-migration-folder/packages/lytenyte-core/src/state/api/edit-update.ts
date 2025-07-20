import type { InternalAtoms } from "../+types";
import type { Column, Grid, GridApi } from "../../+types";
import { editOnChange } from "../helpers/edit-on-change";

export const makeEditUpdate = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["editUpdate"] => {
  return (params) => {
    if (grid.state.editCellMode.get() === "readonly") return;
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

    const activeData = structuredClone(rowNode.data);

    const currentValidation = i.editValidation.get();
    const currentData = i.editData.get();
    editOnChange({
      value: params.value,
      activeData,
      base,
      column,
      grid,
      row: rowNode,
      rowIndex: params.rowIndex,
    });
    const updatedData = i.editData.get();
    const updatedValidation = i.editValidation.get();
    i.editValidation.set(currentValidation);
    i.editData.set(currentData);

    let prevent = false;
    grid.api.eventFire("editBegin", {
      column,
      rowIndex: params.rowIndex,
      preventDefault: () => {
        prevent = true;
      },
    });
    if (prevent) return;

    if (!updatedValidation || Object.keys(updatedValidation).length > 1) {
      grid.api.eventFire("editError", {
        column: column,
        rowIndex: params.rowIndex,
        data: updatedData,
        validation: updatedValidation,
      });
      return;
    }

    try {
      const ds = grid.state.rowDataSource.get();
      ds.rowUpdate(new Map([[params.rowIndex!, updatedData]]));
      grid.api.eventFire("editEnd", {
        column: column,
        rowIndex: params.rowIndex,
        data: updatedData,
      });
    } catch (e) {
      grid.api.eventFire("editError", {
        column: column,
        rowIndex: params.rowIndex,
        data: updatedData,
        validation: updatedValidation,
        error: e,
      });
    }
  };
};
