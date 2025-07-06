import {
  columnScrollIntoViewValue,
  rowScrollIntoViewValue,
} from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";
import type { InternalAtoms } from "../+types";

export const makeScrollIntoView = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["scrollIntoView"] => {
  return (opts) => {
    const vp = grid.state.viewport.get();
    if (!vp) return;

    let x: number | undefined = undefined;
    let y: number | undefined = undefined;
    const col = opts.column;
    if (col != null) {
      const meta = grid.state.columnMeta.get();
      let colIndex: number;
      if (typeof col === "number") colIndex = col;
      else if (typeof col === "string")
        colIndex = meta.columnsVisible.findIndex((c) => c.id === col);
      else colIndex = meta.columnsVisible.findIndex((c) => c.id === col.id);

      if (colIndex !== -1) {
        x = columnScrollIntoViewValue({
          centerCount: meta.columnsVisible.filter((c) => c.pin !== "start" && c.pin !== "end")
            .length,
          startCount: meta.columnsVisible.filter((c) => c.pin === "start").length,
          endCount: meta.columnsVisible.filter((c) => c.pin === "end").length,
          columnIndex: colIndex,
          columnPositions: grid.state.xPositions.get(),
          viewport: vp,
        });
      }
    }

    const row = opts.row;
    if (row != null) {
      y = rowScrollIntoViewValue({
        bottomCount: grid.state.rowDataStore.rowBottomCount.get(),
        topCount: grid.state.rowDataStore.rowTopCount.get(),
        rowCount: grid.state.rowDataStore.rowCount.get(),
        headerHeight: grid.internal.headerHeightTotal.get(),
        rowIndex: row,
        rowPositions: grid.state.yPositions.get(),
        viewport: vp,
      });
    }

    vp.scrollTo({ left: x, top: y, behavior: opts.behavior ?? "auto" });
  };
};
