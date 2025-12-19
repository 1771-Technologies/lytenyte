import {
  makeLayoutState,
  makeRowLayout,
  updateFull,
  type ColumnView,
  type LayoutRow,
  type LayoutState,
  type RowSource,
  type RowView,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import type { API, Props } from "../../../types/types-internal.js";
import type { Piece } from "../../../hooks/use-piece.js";
import { useCallback, useMemo, type RefObject } from "react";
import { getSpanFn } from "./get-span-fn.js";
import { getFullWidthFn } from "./get-full-width-fn.js";

export function useRowLayout(
  props: Props,
  rs: RowSource,
  view: ColumnView,
  vp: HTMLElement | null,
  api: API,
  bounds$: Piece<SpanLayout>,
  layoutStateRef: RefObject<LayoutState>,
  rowDetailExpansions: Set<string>,
) {
  const bounds = bounds$.useValue();

  const topCount = rs.useTopCount();
  const botCount = rs.useBottomCount();
  const rowCount = rs.useRowCount();
  const snapshot = rs.useSnapshotVersion();
  const centerCount = rowCount - topCount - botCount;
  const columnCount = view.visibleColumns.length;

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

    return { layout: { ...layoutState }, cache: new Map<number, LayoutRow<any>>() };
  }, [botCount, centerCount, columnCount, layoutStateRef, rowDetailExpansions, snapshot, topCount]);

  const columns = view.visibleColumns;
  const [computeColSpan, computeRowSpan] = useMemo(() => {
    return [getSpanFn(rs, columns as any, "col", api), getSpanFn(rs, columns as any, "row", api)];
  }, [api, columns, rs]);

  const isFullWidth = useMemo(() => {
    if (!props.rowFullWidthPredicate) return null;

    return getFullWidthFn(rs, props.rowFullWidthPredicate, api);
  }, [api, props.rowFullWidthPredicate, rs]);

  const isRowCutoff = useCallback(
    (r: number) => {
      const row = rs.rowByIndex(r)?.get();

      return !row || row.kind === "branch" || rowDetailExpansions.has(row.id);
    },
    [rowDetailExpansions, rs],
  );

  const spanLayout = useMemo<SpanLayout>(() => {
    return {
      rowTopStart: bounds.rowTopStart,
      rowTopEnd: bounds.rowTopEnd,
      rowBotEnd: bounds.rowBotEnd,
      rowBotStart: bounds.rowBotStart,
      rowCenterStart: bounds.rowCenterStart,
      rowCenterEnd: bounds.rowCenterEnd,
      rowCenterLast: bounds.rowCenterLast,
      colStartStart: 0,
      colStartEnd: view.startCount,
      colCenterStart: view.startCount,
      colCenterEnd: view.centerCount + view.startCount,
      colCenterLast: view.centerCount + view.startCount,
      colEndStart: view.centerCount + view.startCount,
      colEndEnd: view.visibleColumns.length,
    };
  }, [
    bounds.rowBotEnd,
    bounds.rowBotStart,
    bounds.rowCenterEnd,
    bounds.rowCenterLast,
    bounds.rowCenterStart,
    bounds.rowTopEnd,
    bounds.rowTopStart,
    view.centerCount,
    view.startCount,
    view.visibleColumns.length,
  ]);

  const layout = useMemo<RowView<any>>(() => {
    if (!vp) return { top: [], bottom: [], center: [], rowFirstCenter: 0, rowFocusedIndex: null };

    let n = spanLayout;
    if (props.virtualizeRows === false) n = { ...n, rowCenterStart: n.rowTopEnd, rowCenterEnd: n.rowCenterLast };
    if (props.virtualizeCols === false) n = { ...n, colCenterStart: n.colStartEnd, colCenterEnd: n.colCenterLast };

    const hasSpans = Boolean(computeColSpan || computeRowSpan);
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

      rowScanDistance: props.rowScanDistance ?? 50,
      rowStart: n.rowCenterStart,
      rowEnd: n.rowCenterEnd,
      rowMax: n.rowCenterLast,

      ...layout,
    });

    const view = makeRowLayout({
      view: spanLayout,
      viewCache: cache,
      rowScan: hasSpans ? 0 : (props.rowScanDistance ?? 50),
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
    columns,
    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
    layoutCache,
    props.rowScanDistance,
    props.virtualizeCols,
    props.virtualizeRows,
    rs,
    spanLayout,
    topCount,
    vp,
  ]);

  return layout;
}
