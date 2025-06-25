import { atom, createStore } from "@1771technologies/atom";
import type { ColumnMeta, GridApi, RowDataSource, SortModelItem } from "../+types.js";
import { type Grid, type GridView, type UseLyteNyteProps } from "../+types.js";
import { useRef } from "react";
import { makeColumnView } from "./helpers/column-view.js";
import {
  applyLayoutUpdate,
  computeBounds,
  computeColumnPositions,
  computeRowPositions,
  DEFAULT_PREVIOUS_LAYOUT,
  makeGridAtom,
  makeRowDataStore,
  type LayoutMap,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "./+types.js";
import { makeRowLayout } from "./helpers/row-layout.js";
import { equal } from "@1771technologies/lytenyte-js-utils";
import { makeColumnLayout } from "./helpers/column-layout.js";
import { emptyRowDataSource } from "./helpers/empty-row-data-source.js";
import { getFullWidthCallback } from "./helpers/get-full-width-callback.js";
import { getSpanFn } from "./helpers/get-span-callback.js";
import { makeFieldForColumn } from "./api/field-for-column.js";
import { makeSortForColumn } from "./api/sort-for-column.js";

const DEFAULT_HEADER_HEIGHT = 40;
const COLUMN_GROUP_JOIN_DELIMITER = "-->";

export function makeLyteNyte<T>(p: UseLyteNyteProps<T>): Grid<T> {
  const store = createStore();

  /**
   * Primitive ATOMS and State
   */
  const rtl = atom(p.rtl ?? false);
  const columns = atom(p.columns ?? []);
  const base = atom(p.columnBase ?? {});
  const gridId = atom(p.gridId);
  const headerHeight = atom(p.headerHeight ?? DEFAULT_HEADER_HEIGHT);
  const headerGroupHeight = atom(p.headerGroupHeight ?? DEFAULT_HEADER_HEIGHT);
  const columnSizeToFit = atom(p.columnSizeToFit ?? false);
  const viewport = atom<HTMLElement | null>(null);
  const viewportHeightInner = atom(0);
  const viewportHeightOuter = atom(0);
  const viewportWidthInner = atom(0);
  const viewportWidthOuter = atom(0);
  const columnGroupJoinDelimiter = atom(p.columnGroupJoinDelimiter ?? COLUMN_GROUP_JOIN_DELIMITER);
  const columnGroupExpansions = atom(p.columnGroupExpansions ?? {});
  const columnGroupDefaultExpansion = atom(p.columnGroupDefaultExpansion ?? true);

  const rowDataSource = atom<RowDataSource<T>>(emptyRowDataSource);

  const rowHeight = atom(p.rowHeight ?? 40);
  const rowAutoHeightCache = atom(p.rowAutoHeightCache ?? {});
  const rowAutoHeightGuess = atom(p.rowAutoHeightGuess ?? 40);

  const rowScanDistance = atom(p.rowScanDistance ?? 100);
  const colScanDistance = atom(p.colScanDistance ?? 100);

  const rowOverscanTop = atom(p.rowOverscanTop ?? 20);
  const rowOverscanBottom = atom(p.rowOverscanBottom ?? 20);
  const colOverScanStart = atom(p.colOverscanStart ?? 2);
  const colOverscanEnd = atom(p.colOverscanEnd ?? 2);

  const xScroll = atom(0);
  const yScroll = atom(0);

  const cellRenderers = atom(p.cellRenderers ?? {});
  const rowFullWidthPredicate = atom({ fn: p.rowFullWidthPredicate ?? (() => false) });

  const sortModel = atom<SortModelItem<T>[]>(p.sortModel ?? []);

  const layoutMap: LayoutMap = new Map();

  /**
   * VIEW BOUNDS
   */
  let prevBounds: SpanLayout | null = null;
  const bounds = atom((g) => {
    const vpWidth = g(viewportWidthInner);
    const vpHeight = g(viewportHeightInner);
    const scrollTop = g(yScroll);
    const scrollLeft = g(xScroll);
    const xPos = g(xPositions);
    const yPos = g(yPositions);
    const topCount = g(rdsAtoms.topCount);
    const bottomCount = g(rdsAtoms.bottomCount);
    const start = g(startCount);
    const end = g(endCount);

    const bounds = computeBounds({
      viewportWidth: vpWidth,
      viewportHeight: vpHeight,
      scrollTop,
      scrollLeft,
      xPositions: xPos,
      yPositions: yPos,
      topCount,
      bottomCount,
      startCount: start,
      endCount: end,

      rowOverscanTop: g(rowOverscanTop),
      rowOverscanBottom: g(rowOverscanBottom),
      colOverscanStart: g(colOverScanStart),
      colOverscanEnd: g(colOverscanEnd),
    });

    if (equal(prevBounds, bounds)) return prevBounds!;

    prevBounds = bounds;
    return bounds;
  });

  /**
   * COLUMN VIEW
   * Compute the column layout. This impacts both the row layout and header layout. Column layout
   * is impacted by the column definitions, the group expansions, the row group display mode.
   */
  const columnView = atom((g) => {
    const view = makeColumnView({
      columns: g(columns),
      base: g(base),
      groupExpansionDefault: g(columnGroupDefaultExpansion),
      groupExpansions: g(columnGroupExpansions),
      groupJoinDelimiter: g(columnGroupJoinDelimiter),
    });

    return view;
  });

  /**
   * COMPUTE ATOMS
   */

  const headerLayout = atom<GridView<T>["header"]>((g) => {
    const view = g(columnView);
    const layout = makeColumnLayout(view.combinedView, view.meta, g(bounds));

    return { maxCol: view.maxCol, maxRow: view.maxRow, layout: layout };
  });

  const columnGroupMeta = atom((g) => g(columnView).meta);
  const columnMeta = atom<ColumnMeta<T>>((g) => {
    const view = g(columnView);
    return { columnLookup: view.lookup, columnsVisible: view.visibleColumns };
  });

  const xPositions = atom((g) => {
    const view = g(columnView);
    return computeColumnPositions(
      view.visibleColumns,
      g(base),
      g(viewportWidthInner),
      g(columnSizeToFit),
    );
  });
  const widthTotal = atom((get) => get(xPositions).at(-1)!);

  const headerHeightTotal = atom((g) => {
    const ghh = g(headerGroupHeight);
    const hh = g(headerHeight);
    const view = g(columnView);

    return (view.maxRow - 1) * ghh + hh;
  });

  const startCount = atom((g) => g(columnView).startCount);
  const endCount = atom((g) => g(columnView).endCount);

  /** ROWS */

  const rowByIndex = makeGridAtom(
    atom((g) => g(rowDataSource).rowByIndex),
    store,
  );
  const { store: rowDataStore, atoms: rdsAtoms } = makeRowDataStore(store, rowByIndex);
  const yPositions = atom((g) => {
    const rowCount = g(rdsAtoms.rowCount);
    const innerHeight = g(viewportHeightInner);

    return computeRowPositions(
      rowCount,
      g(rowHeight),
      g(rowAutoHeightGuess),
      g(rowAutoHeightCache),
      () => 0,
      innerHeight,
    );
  });

  const heightTotal = atom((g) => g(yPositions).at(-1)!);

  let prevLayout: SpanLayout = DEFAULT_PREVIOUS_LAYOUT;
  const rowView = atom<GridView<T>["rows"]>((g) => {
    const n = g(bounds);
    const rowScan = g(rowScanDistance);
    const colScan = g(colScanDistance);

    const columns = g(columnMeta).columnsVisible;
    const rds = g(rowDataSource);

    applyLayoutUpdate({
      computeColSpan: getSpanFn(rds, grid, columns, "col"),
      computeRowSpan: getSpanFn(rds, grid, columns, "row"),
      colScanDistance: colScan,
      rowScanDistance: rowScan,
      invalidated: false, // TODO,
      isFullWidth: getFullWidthCallback(rds, g(rowFullWidthPredicate).fn, grid),
      isRowCutoff: (r) => {
        const row = rds.rowByIndex(r);
        return !row || row.kind === "branch";
      },
      layoutMap,
      nextLayout: n,
      prevLayout,
    });

    prevLayout = n;

    const topCount = g(rdsAtoms.topCount);
    const botCount = g(rdsAtoms.bottomCount);
    const rowCount = g(rdsAtoms.rowCount);
    const yPos = g(yPositions);

    const botStart = rowCount - botCount;

    const view = makeRowLayout({ layout: n, layoutMap, rds: rowDataStore, columns });
    const topHeight = yPos[topCount];
    const botHeight = yPos.at(-1)! - yPos[botStart];
    const centerHeight = yPos.at(-1)! - topHeight - botHeight;

    return {
      ...view,
      rowTopTotalHeight: topHeight,
      rowBottomTotalHeight: botHeight,
      rowCenterTotalHeight: centerHeight,
    };
  });

  /**
   * STATE VIEW AND API
   */

  const gridView = atom<GridView<T>>((g) => {
    return {
      header: g(headerLayout),
      rows: g(rowView),
    };
  });

  const state: Grid<T>["state"] = {
    rtl: makeGridAtom(rtl, store),
    columns: makeGridAtom(columns, store),
    columnMeta: makeGridAtom(columnMeta, store),
    columnBase: makeGridAtom(base, store),
    columnGroupExpansions: makeGridAtom(columnGroupExpansions, store),
    columnGroupDefaultExpansion: makeGridAtom(columnGroupDefaultExpansion, store),
    columnGroupJoinDelimiter: makeGridAtom(columnGroupJoinDelimiter, store),
    columnGroupMeta: makeGridAtom(columnGroupMeta, store),
    columnSizeToFit: makeGridAtom(columnSizeToFit, store),
    gridId: makeGridAtom(gridId, store),

    widthTotal: makeGridAtom(widthTotal, store),
    heightTotal: makeGridAtom(heightTotal, store),

    headerHeight: makeGridAtom(headerHeight, store),
    headerGroupHeight: makeGridAtom(headerGroupHeight, store),
    viewport: makeGridAtom(viewport, store),
    viewportHeightInner: makeGridAtom(viewportHeightInner, store),
    viewportHeightOuter: makeGridAtom(viewportHeightOuter, store),
    viewportWidthInner: makeGridAtom(viewportWidthInner, store),
    viewportWidthOuter: makeGridAtom(viewportWidthOuter, store),

    xPositions: makeGridAtom(xPositions, store),
    yPositions: makeGridAtom(yPositions, store),

    rowDataStore,
    rowDataSource: makeGridAtom(rowDataSource, store),
    rowAutoHeightCache: makeGridAtom(rowAutoHeightCache, store),
    rowAutoHeightGuess: makeGridAtom(rowAutoHeightGuess, store),
    rowHeight: makeGridAtom(rowHeight, store),

    rowScanDistance: makeGridAtom(rowScanDistance, store),
    colScanDistance: makeGridAtom(colScanDistance, store),

    colOverscanStart: makeGridAtom(colOverScanStart, store),
    colOverscanEnd: makeGridAtom(colOverscanEnd, store),
    rowOverscanTop: makeGridAtom(rowOverscanTop, store),
    rowOverscanBottom: makeGridAtom(rowOverscanBottom, store),

    rowFullWidthPredicate: makeGridAtom(rowFullWidthPredicate, store),
    cellRenderers: makeGridAtom(cellRenderers, store),

    sortModel: makeGridAtom(sortModel, store),
  };

  const api = {} as GridApi<T>;

  const grid: Grid<T> = { state, view: makeGridAtom(gridView, store), api };

  Object.assign(api, {
    fieldForColumn: makeFieldForColumn(grid),
    sortForColumn: makeSortForColumn(grid),

    // Get current sort | { sort and index }
  } satisfies GridApi<T>);

  Object.assign(grid, {
    internal: {
      headerCols: makeGridAtom(
        atom((g) => g(columnView).maxCol),
        store,
      ),
      headerRows: makeGridAtom(
        atom((g) => g(columnView).maxRow),
        store,
      ),
      headerHeightTotal: makeGridAtom(headerHeightTotal, store),
      xScroll: makeGridAtom(xScroll, store),
      yScroll: makeGridAtom(yScroll, store),
      refreshKey: makeGridAtom(rdsAtoms.snapshotKey, store),
    } satisfies InternalAtoms,
  });

  store.sub(rowDataSource, () => {
    store.get(rowDataSource).init(grid);
  });
  store.set(rowDataSource, p.rowDataSource ?? emptyRowDataSource);

  return grid;
}

export function useLyteNyte<T>(p: UseLyteNyteProps<T>) {
  const m = useRef<Grid<T>>(null as any);
  if (!m.current) {
    m.current = makeLyteNyte(p);
  }

  return m.current;
}
