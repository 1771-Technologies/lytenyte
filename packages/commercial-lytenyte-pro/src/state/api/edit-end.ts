import type { InternalAtoms } from "../+types.js";
import type { Grid, GridApi } from "../../+types";

export const makeEditEnd = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["editEnd"] => {
  return (cancel?: boolean) => {
    const active = grid.internal.editActivePos.get();
    if (!active) return;

    const data = grid.internal.editData.get();
    if (cancel) {
      grid.internal.editActivePos.set(null);
      grid.internal.editData.set(null);

      grid.api.eventFire("editCancel", { column: active.column, rowIndex: active.rowIndex, data });
      return;
    }

    const validation = grid.internal.editValidation.get();
    if (!validation || Object.keys(validation).length >= 1) {
      grid.api.eventFire("editError", {
        column: active.column,
        rowIndex: active.rowIndex,
        data,
        validation,
      });
      return;
    }

    try {
      const ds = grid.state.rowDataSource.get();
      ds.rowUpdate(new Map([[active.rowIndex!, data]]));

      grid.api.eventFire("editEnd", { column: active.column, rowIndex: active.rowIndex, data });
    } catch (e: unknown) {
      grid.api.eventFire("editError", {
        column: active.column,
        rowIndex: active.rowIndex,
        data,
        validation,
        error: e,
      });
    } finally {
      grid.internal.editActivePos.set(null);
      grid.internal.editData.set(null);
      grid.internal.editValidation.set(true);
    }
  };
};
