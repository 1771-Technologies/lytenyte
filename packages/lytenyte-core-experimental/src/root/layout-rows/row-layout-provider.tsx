import { useCallback, useMemo, type PropsWithChildren, type RefObject } from "react";
import { makeRowLayout } from "./make-row-layout.js";
import type { LayoutRow, RowView } from "../../types/layout.js";
import { useBounds } from "../bounds/context.js";
import { makeLayoutState, updateFull, type LayoutState } from "@1771technologies/lytenyte-shared";
import { getSpanFn } from "./get-span-fn.js";
import { getFullWidthFn } from "./get-full-width-fn.js";
import { RowLayoutContext } from "./row-layout-context.js";
import type { RowFullWidthPredicate, RowSource } from "../../types/row.js";
import type { ColumnMeta } from "../../types/column.js";
import type { Ln } from "../../types.js";

export function RowLayoutProvider<T>({
  vp,
  rs,
  virtualizeCols,
  virtualizeRows,
  rowScan,
  columnMeta,
  rowDetailExpansions,
  rowFullWidthPredicate,
  api,
  layoutStateRef,
  children,
}: PropsWithChildren<{
  vp: HTMLElement | null;
  rs: RowSource<T>;
  virtualizeRows: boolean;
  virtualizeCols: boolean;
  rowScan: number;
  columnMeta: ColumnMeta<T>;
  rowDetailExpansions: Set<string>;
  rowFullWidthPredicate: RowFullWidthPredicate<T> | null;
  api: Ln.API<any>;
  layoutStateRef: RefObject<LayoutState>;
}>) {
  const bounds$ = useBounds();
  const bounds = bounds$.useValue();

  const topCount = rs.useTopCount();
  const botCount = rs.useBottomCount();
  const rowCount = rs.useRowCount();
  const snapshot = rs.useSnapshotVersion();
  const centerCount = rowCount - topCount - botCount;
  const columnCount = columnMeta.columnsVisible.length;

  if (!layoutStateRef.current) layoutStateRef.current = makeLayoutState(0);

  const layoutCache = useMemo(() => {
    void snapshot;
    void rowDetailExpansions;

    // Directly compute row count here so that the different row count parts are part of the
    // memo's dependency array.
    const rowCount = topCount + botCount + centerCount;

    const layoutState = layoutStateRef.current;

    if (rowCount > layoutState.computed.length || columnCount != layoutState.base.length) {
      Object.assign(layoutState, makeLayoutState(columnCount, rowCount + 2000));
    } else {
      layoutState.computed.fill(0);
      layoutState.special.fill(0);
      layoutState.lookup.clear();
    }

    return { layout: { ...layoutState }, cache: new Map<number, LayoutRow<T>>() };
  }, [botCount, centerCount, columnCount, layoutStateRef, rowDetailExpansions, snapshot, topCount]);

  const columns = columnMeta.columnsVisible;
  const [computeColSpan, computeRowSpan] = useMemo(() => {
    return [getSpanFn(rs, columns, "col", api), getSpanFn(rs, columns, "row", api)];
  }, [api, columns, rs]);

  const isFullWidth = useMemo(() => {
    if (!rowFullWidthPredicate) return null;

    return getFullWidthFn(rs, rowFullWidthPredicate, api);
  }, [api, rowFullWidthPredicate, rs]);

  const isRowCutoff = useCallback(
    (r: number) => {
      const row = rs.rowByIndex(r)?.get();

      return !row || row.kind === "branch" || rowDetailExpansions.has(row.id);
    },
    [rowDetailExpansions, rs],
  );

  const layout = useMemo<RowView<T>>(() => {
    if (!vp) return { top: [], bottom: [], center: [], rowFirstCenter: 0, rowFocusedIndex: null };

    let n = bounds;
    if (!virtualizeRows) n = { ...n, rowCenterStart: n.rowTopEnd, rowCenterEnd: n.rowCenterLast };
    if (!virtualizeCols) n = { ...n, colCenterStart: n.colStartEnd, colCenterEnd: n.colCenterLast };

    const columns = columnMeta.columnsVisible;
    const { layout, cache } = layoutCache;

    updateFull({
      topCount,
      botCount,
      startCount: n.colStartEnd,
      endCount: n.colEndEnd - n.colEndStart,
      centerCount: n.colCenterLast - n.colStartEnd,

      computeColSpan,
      computeRowSpan,
      isFullWidth,
      isRowCutoff,

      rowScanDistance: rowScan,
      rowStart: n.rowCenterStart,
      rowEnd: n.rowCenterEnd,
      rowMax: n.rowCenterLast,

      ...layout,
    });

    const view = makeRowLayout({
      view: n,
      viewCache: cache,
      layout,
      rds: rs,
      columns,
      focus: null, // TODO
    });

    return {
      ...view,
      rowFirstCenter: n.rowCenterStart,
      rowFocusedIndex: null, // TODO
    };
  }, [
    botCount,
    bounds,
    columnMeta.columnsVisible,
    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
    layoutCache,
    rowScan,
    rs,
    topCount,
    virtualizeCols,
    virtualizeRows,
    vp,
  ]);

  return <RowLayoutContext.Provider value={layout}>{children}</RowLayoutContext.Provider>;
}
