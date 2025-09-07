import { CONTAINS_DEAD_CELLS, FULL_WIDTH, updateLayout } from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "../+types";
import type { Grid, GridApi } from "../../+types";
import { getSpanFn } from "../helpers/get-span-callback.js";
import { getFullWidthCallback } from "../helpers/get-full-width-callback.js";

export const makeCellRoot = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["cellRoot"] => {
  return (row, column) => {
    const l = grid.internal.layout;

    const meta = grid.state.columnMeta.get();
    const ds = grid.state.rowDataStore;
    // Is this a valid position.
    if (row < 0 || row >= ds.rowCount.get()) return null;
    if (column < 0 || column >= meta.columnsVisible.length) return null;

    const rds = grid.state.rowDataSource.get();
    const columns = meta.columnsVisible;
    const rowFullWidthPredicate = grid.state.rowFullWidthPredicate.get();

    if (!l.computed[row]) {
      updateLayout({
        base: l.base,
        computed: l.computed,
        lookup: l.lookup,
        special: l.special,

        botCount: ds.rowBottomCount.get(),
        topCount: ds.rowTopCount.get(),

        startCount: meta.columnVisibleStartCount,
        centerCount: meta.columnVisibleCenterCount,
        endCount: meta.columnVisibleEndCount,

        computeColSpan: getSpanFn(rds, grid, columns, "col"),
        computeRowSpan: getSpanFn(rds, grid, columns, "row"),

        isFullWidth: getFullWidthCallback(rds, rowFullWidthPredicate.fn, grid),
        isRowCutoff: (r) => {
          const row = rds.rowByIndex(r);
          return !row || row.kind === "branch";
        },

        rowStart: row,
        rowEnd: row + 1,
        rowMax: ds.rowCenterCount.get() + ds.rowTopCount.get(),
        rowScanDistance: grid.state.rowScanDistance.get(),
      });
    }

    const status = l.special[row];
    if (status === FULL_WIDTH) {
      return { kind: "full-width", rowIndex: row, colIndex: 0 };
    }

    if (status === CONTAINS_DEAD_CELLS) {
      const spec = l.lookup.get(row);

      // This cell is not covered
      if (!spec || spec[column * 4] !== 0) {
        return { kind: "cell", rowIndex: row, colIndex: column, root: null };
      }

      const rowSpan = spec[column * 4];
      const colSpan = spec[column * 4 + 1];
      const rowIndex = spec[column * 4 + 2];
      const colIndex = spec[column * 4 + 3];

      return {
        kind: "cell",
        rowIndex: row,
        colIndex: column,
        root: { colIndex, colSpan, rowIndex, rowSpan },
      };
    }

    return { kind: "cell", rowIndex: row, colIndex: column, root: null };
  };
};
