import { atom, createStore } from "@1771technologies/atom";
import type {
  ColumnMeta,
  GridApi,
  RowDataSource,
  SortModelItem,
  FilterModelItem,
  EditActivePosition,
  PositionUnion,
} from "../+types.js";
import { type Grid, type GridView, type UseLyteNyteProps } from "../+types.js";
import { useRef } from "react";
import { makeColumnView } from "./helpers/column-view.js";
import type { LayoutMap } from "@1771technologies/lytenyte-shared";
import {
  applyLayoutUpdate,
  computeBounds,
  computeColumnPositions,
  computeRowPositions,
  DEFAULT_PREVIOUS_LAYOUT,
  makeGridAtom,
  makeRowDataStore,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "./+types.js";
import { makeRowLayout } from "./helpers/row-layout/row-layout.js";
import { equal } from "@1771technologies/lytenyte-js-utils";
import { makeColumnLayout } from "./helpers/column-layout.js";
import { emptyRowDataSource } from "./helpers/empty-row-data-source.js";
import { getFullWidthCallback } from "./helpers/get-full-width-callback.js";
import { getSpanFn } from "./helpers/get-span-callback.js";
import { makeColumnField } from "./api/column-field.js";
import { makeSortForColumn } from "./api/sort-for-column.js";
import { columnAddRowGroup } from "./helpers/column-add-row-group.js";
import { makeEventListeners } from "./api/event-listeners.js";
import { makeScrollIntoView } from "./api/scroll-into-view.js";
import { makeColumnFromIndex } from "./api/column-from-index.js";
import { makeColumnIndex } from "./api/column-index.js";
import { makeRowGroupColumnIndex } from "./api/row-group-column-index.js";
import { makeRowGroupIsExpanded } from "./api/row-group-is-expanded.js";
import { makeRowGroupToggle } from "./api/row-group-toggle.js";
import { makeRowGroupApplyExpansions } from "./api/make-row-group-apply-expansions.js";
import { makeFocusCell } from "./api/focus-cell.js";
import { makeEditBegin } from "./api/edit-begin.js";
import { makeEditIsCellActive } from "./api/edit-is-cell-active.js";
import { makeEditEnd } from "./api/edit-end.js";
import { makeEditUpdate } from "./api/edit-update.js";

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

  const rowOverscanTop = atom(p.rowOverscanTop ?? 10);
  const rowOverscanBottom = atom(p.rowOverscanBottom ?? 10);
  const colOverScanStart = atom(p.colOverscanStart ?? 2);
  const colOverscanEnd = atom(p.colOverscanEnd ?? 2);

  const xScroll = atom(0);
  const yScroll = atom(0);

  const cellRenderers = atom(p.cellRenderers ?? {});
  const rowFullWidthPredicate = atom({ fn: p.rowFullWidthPredicate ?? (() => false) });
  const rowFullWidthRenderer = atom({ fn: p.rowFullWidthRenderer ?? (() => "Not defined") });

  const sortModel = atom<SortModelItem<T>[]>(p.sortModel ?? []);
  const filterModel = atom<FilterModelItem<T>[]>(p.filterModel ?? []);
  const rowGroupModel = atom(p.rowGroupModel ?? []);
  const aggModel = atom(p.aggModel ?? {});

  const rowGroupDisplayMode = atom(p.rowGroupDisplayMode ?? "single-column");
  const rowGroupDefaultExpansion = atom(p.rowGroupDefaultExpansion ?? false);
  const rowGroupExpansions = atom(p.rowGroupExpansions ?? {});
  const rowGroupColumn = atom(p.rowGroupColumn ?? {});

  const headerCellRenderers = atom(p.headerCellRenderers ?? {});
  const floatingCellRenderers = atom(p.floatingCellRenderers ?? {});
  const floatingRowEnabled = atom(p.floatingRowEnabled ?? false);
  const floatingRowHeight = atom(p.floatingRowHeight ?? 40);

  const editRenderers = atom(p.editRenderers ?? {});
  const editRowValidatorFn = atom({ fn: p.editRowValidatorFn ?? (() => true) });
  const editClickActivator = atom(p.editClickActivator ?? "single");
  const editCellMode = atom(p.editCellMode ?? "readonly");

  const internal_focusActive = atom<PositionUnion | null>(null);
  const internal_focusPrevCol = atom<number | null>(null);
  const internal_focusPrevRow = atom<number | null>(null);
  const internal_editActivePosition = atom<EditActivePosition<T> | null>(null);
  const internal_editData = atom<any>(null);
  const internal_editValidation = atom<Record<string, any> | boolean>(true);

  const layoutMap = atom<LayoutMap>((g) => {
    g(rdsAtoms.bottomCount);
    g(rdsAtoms.rowCenterCount);
    g(rdsAtoms.topCount);
    g(rdsAtoms.snapshotKey);
    g(rowDataSource);
    g(rowGroupModel);
    g(sortModel);
    g(filterModel);
    g(aggModel);

    return new Map();
  });

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
    const cols = columnAddRowGroup({
      columns: g(columns),
      rowGroupDisplayMode: g(rowGroupDisplayMode),
      rowGroupModel: g(rowGroupModel),
      rowGroupTemplate: g(rowGroupColumn),
    });

    const view = makeColumnView({
      columns: cols,
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

    const layout = makeColumnLayout(
      view.combinedView,
      view.meta,
      g(bounds),
      g(internal_focusActive),
      g(floatingRowEnabled),
    );

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
    const groupHHeight = g(headerGroupHeight);
    const hHeight = g(headerHeight);
    const view = g(columnView);
    const floating = g(floatingRowEnabled);
    const floatingHeight = g(floatingRowHeight);

    return (view.maxRow - 1) * groupHHeight + hHeight + (floating ? floatingHeight : 0);
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
      invalidated: true,
      isFullWidth: getFullWidthCallback(rds, g(rowFullWidthPredicate).fn, grid),
      isRowCutoff: (r) => {
        const row = rds.rowByIndex(r);
        return !row || row.kind === "branch";
      },
      layoutMap: g(layoutMap),
      nextLayout: n,
      prevLayout,
    });

    prevLayout = n;

    const topCount = g(rdsAtoms.topCount);
    const botCount = g(rdsAtoms.bottomCount);
    const rowCount = g(rdsAtoms.rowCount);
    const yPos = g(yPositions);

    const botStart = rowCount - botCount;

    const view = makeRowLayout({
      layout: n,
      layoutMap: g(layoutMap),
      rds: rowDataStore,
      columns,
      focus: g(internal_focusActive),
    });

    const topHeight = yPos[topCount];
    const botHeight = yPos.at(-1)! - yPos[botStart];
    const centerHeight = yPos.at(-1)! - topHeight - botHeight;

    return {
      ...view,
      rowTopTotalHeight: topHeight,
      rowBottomTotalHeight: botHeight,
      rowCenterTotalHeight: centerHeight,
      rowFirstCenter: n.rowCenterStart,
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
    rowFullWidthRenderer: makeGridAtom(rowFullWidthRenderer, store),
    cellRenderers: makeGridAtom(cellRenderers, store),

    sortModel: makeGridAtom(sortModel, store),
    filterModel: makeGridAtom(filterModel, store),
    rowGroupModel: makeGridAtom(rowGroupModel, store),
    aggModel: makeGridAtom(aggModel, store),

    rowGroupColumn: makeGridAtom(rowGroupColumn, store),
    rowGroupDefaultExpansion: makeGridAtom(rowGroupDefaultExpansion, store),
    rowGroupDisplayMode: makeGridAtom(rowGroupDisplayMode, store),
    rowGroupExpansions: makeGridAtom(rowGroupExpansions, store),

    headerCellRenderers: makeGridAtom(headerCellRenderers, store),
    floatingCellRenderers: makeGridAtom(floatingCellRenderers, store),
    floatingRowEnabled: makeGridAtom(floatingRowEnabled, store),
    floatingRowHeight: makeGridAtom(floatingRowHeight, store),

    editRenderers: makeGridAtom(editRenderers, store),
    editCellMode: makeGridAtom(editCellMode, store),
    editClickActivator: makeGridAtom(editClickActivator, store),
    editRowValidatorFn: makeGridAtom(editRowValidatorFn, store),
    editActivePosition: makeGridAtom(
      atom((g) => g(internal_editActivePosition)),
      store,
    ),
  };

  const api = {} as GridApi<T>;

  const grid: Grid<T> = { state, view: makeGridAtom(gridView, store), api };

  const listeners = makeEventListeners<T>();
  Object.assign(api, {
    columnField: makeColumnField(grid),
    columnFromIndex: makeColumnFromIndex(grid),
    columnIndex: makeColumnIndex(grid),
    sortForColumn: makeSortForColumn(grid),

    rowIsGroup: (r) => r.kind === "branch",
    rowIsLeaf: (r) => r.kind === "leaf",

    eventAddListener: listeners.eventAddListener,
    eventRemoveListener: listeners.eventRemoveListener,
    eventFire: listeners.eventFire,

    rowGroupColumnIndex: makeRowGroupColumnIndex(grid),
    rowGroupIsExpanded: makeRowGroupIsExpanded(grid),
    rowGroupToggle: makeRowGroupToggle(grid),
    rowGroupApplyExpansions: makeRowGroupApplyExpansions(grid),

    scrollIntoView: makeScrollIntoView(grid as any),

    editBegin: makeEditBegin(grid as any),
    editEnd: makeEditEnd(grid as any),
    editIsCellActive: makeEditIsCellActive(grid as any),
    editUpdate: makeEditUpdate(grid as any),

    focusCell: makeFocusCell(grid as any),
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

      layout: makeGridAtom(layoutMap, store),

      focusActive: makeGridAtom(internal_focusActive, store),
      focusPrevColIndex: makeGridAtom(internal_focusPrevCol, store),
      focusPrevRowIndex: makeGridAtom(internal_focusPrevRow, store),

      editActivePos: makeGridAtom(internal_editActivePosition, store),
      editData: makeGridAtom(internal_editData, store),
      editValidation: makeGridAtom(internal_editValidation, store),
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
