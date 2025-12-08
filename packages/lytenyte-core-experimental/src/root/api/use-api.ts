import { useMemo, type RefObject } from "react";
import type { RowDetailContext } from "../row-detail/row-detail-context";
import { useEvent } from "../../hooks/use-event.js";
import type { MakeColumnViewReturn } from "../column-view/column-view.js";
import {
  columnScrollIntoViewValue,
  CONTAINS_DEAD_CELLS,
  FULL_WIDTH,
  get,
  rowScrollIntoViewValue,
  updateLayout,
  type LayoutState,
} from "@1771technologies/lytenyte-shared";
import type { Ln } from "../../types.js";
import type { RowFullWidthPredicate, RowSource } from "../../types/row";
import { getFullWidthFn } from "../layout-rows/get-full-width-fn.js";
import { getSpanFn } from "../layout-rows/get-span-fn.js";

export function useApi<T>(
  rtl: boolean,
  props: Ln.Props<T>,
  detailCtx: RowDetailContext,
  view: MakeColumnViewReturn<T>,
  rowSource: RowSource,
  rowFullWidthPredicate: RowFullWidthPredicate<T> | null,
  layoutStateRef: RefObject<LayoutState>,

  vp: HTMLElement | null,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  headerHeightTotal: number,
) {
  const columnField: Ln.API<T>["columnField"] = useEvent((col, row) => {
    const column = typeof col === "string" ? view.lookup.get(col) : col;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined`, column);
      return null;
    }

    const field = column.field ?? column.id;
    if (row.kind === "branch") {
      if (typeof field === "function") return field({ column, row, api });
      if (!row.data) return null;
      return row.data[column.id];
    }

    if (typeof field === "function") return field({ column, row, api });
    else if (!row.data) return null;
    else if (typeof field === "object") return get(row.data, (field as { path: string }).path);

    return (row.data as any)[field] as unknown;
  });

  const topCount = rowSource.useTopCount();
  const botCount = rowSource.useBottomCount();
  const rowCount = rowSource.useRowCount();
  const cellRoot: Ln.API<T>["cellRoot"] = useEvent((row, column) => {
    const l = layoutStateRef.current;

    const columns = view.visibleColumns;
    const rs = rowSource;
    // Is this a valid position.
    if (row < 0 || row >= rowCount) return null;
    if (column < 0 || column >= columns.length) return null;

    if (!l.computed[row]) {
      updateLayout({
        base: l.base,
        computed: l.computed,
        lookup: l.lookup,
        special: l.special,

        botCount,
        topCount,

        startCount: view.startCount,
        centerCount: view.centerCount,
        endCount: view.endCount,

        computeColSpan: getSpanFn(rs, columns, "col", api),
        computeRowSpan: getSpanFn(rs, columns, "row", api),

        isFullWidth: getFullWidthFn(rs, rowFullWidthPredicate, api),
        isRowCutoff: (r) => {
          const row = rs.rowByIndex(r)?.get();

          return !row || row.kind === "branch" || detailCtx.detailExpansions.has(row.id);
        },

        rowStart: row,
        rowEnd: row + 1,
        rowMax: rowCount - botCount,
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
  const scrollIntoView: Ln.API<T>["scrollIntoView"] = useEvent((opts) => {
    if (!vp) return;

    let x: number | undefined = undefined;
    let y: number | undefined = undefined;
    const col = opts.column;
    if (col != null) {
      let colIndex: number;
      if (typeof col === "number") colIndex = col;
      else if (typeof col === "string")
        colIndex = view.visibleColumns.findIndex((c) => c.id === col);
      else colIndex = view.visibleColumns.findIndex((c) => c.id === col.id);

      if (colIndex !== -1) {
        x = columnScrollIntoViewValue({
          centerCount: view.centerCount,
          startCount: view.startCount,
          endCount: view.endCount,
          columnIndex: colIndex,
          columnPositions: xPositions,
          viewport: vp,
        });
      }
    }

    const row = opts.row;
    if (row != null) {
      y = rowScrollIntoViewValue({
        bottomCount: botCount,
        topCount: topCount,
        rowCount: rowCount,
        headerHeight: headerHeightTotal,
        rowIndex: row,
        rowPositions: yPositions,
        viewport: vp,
      });
    }

    vp.scrollTo({
      left: x != null ? x * (rtl ? -1 : 1) : undefined,
      top: y,
      behavior: opts.behavior ?? "auto",
    });
  });

  const rowDetailExpanded: Ln.API<T>["rowDetailExpanded"] = useEvent((row) => {
    if (typeof row === "string") return detailCtx.detailExpansions.has(row);
    if (typeof row === "number") {
      const r = rowSource.rowByIndex(row).get();
      return r == null ? false : detailCtx.detailExpansions.has(r.id);
    }
    return detailCtx.detailExpansions.has(row.id);
  });

  const getProps = useEvent(() => props);
  const api = useMemo<Ln.API<T>>(() => {
    return {
      rowDetailHeight: detailCtx.getRowDetailHeight,
      columnField,
      cellRoot,
      scrollIntoView,
      rowDetailExpanded,

      props: getProps,
      ...rowSource,
    };
  }, [
    cellRoot,
    columnField,
    detailCtx.getRowDetailHeight,
    getProps,
    rowDetailExpanded,
    rowSource,
    scrollIntoView,
  ]);

  return api;
}
