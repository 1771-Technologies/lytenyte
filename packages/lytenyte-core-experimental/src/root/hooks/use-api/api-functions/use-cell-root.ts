import type { RefObject } from "react";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root";
import {
  CONTAINS_DEAD_CELLS,
  FULL_WIDTH,
  updateLayout,
  type ColumnView,
  type LayoutState,
  type RowSource,
} from "@1771technologies/lytenyte-shared";
import { getSpanFn } from "../../use-row-layout/get-span-fn.js";
import { getFullWidthFn } from "../../use-row-layout/get-full-width-fn.js";
import type { Controlled } from "../../use-controlled-grid-state.js";

export function useCellRoot(
  props: Root.Props,
  api: Root.API,
  view: ColumnView,
  source: RowSource,
  rowCount: number,
  rowBottomCount: number,
  rowTopCount: number,

  controlled: Controlled,

  layoutStateRef: RefObject<LayoutState>,
): Root.API["cellRoot"] {
  return useEvent((row, column) => {
    const l = layoutStateRef.current;

    const columns = view.visibleColumns;
    const rs = source;
    // Is this a valid position.
    if (row < 0 || row >= rowCount) return null;
    if (column < 0 || column >= columns.length) return null;

    if (!l.computed[row]) {
      updateLayout({
        base: l.base,
        computed: l.computed,
        lookup: l.lookup,
        special: l.special,

        botCount: rowBottomCount,
        topCount: rowTopCount,

        startCount: view.startCount,
        centerCount: view.centerCount,
        endCount: view.endCount,

        computeColSpan: getSpanFn(rs, columns as any, "col", api),
        computeRowSpan: getSpanFn(rs, columns as any, "row", api),

        isFullWidth: getFullWidthFn(rs, props.rowFullWidthPredicate, api),
        isRowCutoff: (r) => {
          const row = rs.rowByIndex(r)?.get();

          return !row || row.kind === "branch" || controlled.detailExpansions.has(row.id);
        },

        rowStart: row,
        rowEnd: row + 1,
        rowMax: rowCount - rowBottomCount,
        rowScanDistance: props.rowScanDistance ?? 100,
      });
    }

    const status = l.special[row];
    if (status === FULL_WIDTH) {
      return { kind: "full-width", rowIndex: row, colIndex: 0 };
    }

    if (status === CONTAINS_DEAD_CELLS) {
      const spec = l.lookup.get(row);

      // This cell is not covered
      if (!spec || spec[column * 4] > 0) {
        return { kind: "cell", rowIndex: row, colIndex: column, root: null };
      }

      const rowIndex = spec[column * 4 + 2];
      const colIndex = spec[column * 4 + 3];

      const rootSpec = l.lookup.get(rowIndex)!;
      const rowSpan = rootSpec[colIndex * 4];
      const colSpan = rootSpec[colIndex * 4 + 1];

      return {
        kind: "cell",
        rowIndex: row,
        colIndex: column,
        root: { colIndex, colSpan, rowIndex, rowSpan },
      };
    }

    return { kind: "cell", rowIndex: row, colIndex: column, root: null };
  });
}
