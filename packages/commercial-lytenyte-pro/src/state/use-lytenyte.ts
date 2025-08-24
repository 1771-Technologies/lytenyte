import { atom, createStore } from "@1771technologies/atom";
import type {
  ColumnMeta,
  GridApi,
  RowDataSource,
  SortModelItem,
  FilterModelItem,
  EditActivePosition,
  PositionUnion,
  RowSelectionActivator,
  HeaderGroupCellLayout,
  ColumnPivotModel,
  Column,
  VirtualTarget,
  DataRect,
  FilterIn,
  RowHeight,
} from "../+types.js";
import { type Grid, type GridView, type UseLyteNyteProps } from "../+types.js";
import { useRef } from "react";
import { makeColumnView } from "./helpers/column-view.js";
import {
  computeBounds,
  computeColumnPositions,
  computeRowPositions,
  makeGridAtom,
  makeLayoutState,
  makeRowDataStore,
  updateFull,
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
import { makeColumnByIndex } from "./api/column-from-index.js";
import { makeColumnIndex } from "./api/column-index.js";
import { makeRowGroupColumnIndex } from "./api/row-group-column-index.js";
import { makeRowGroupIsExpanded } from "./api/row-group-is-expanded.js";
import { makeRowGroupToggle } from "./api/row-group-toggle.js";
import { makeRowGroupApplyExpansions } from "./api/row-group-apply-expansions.js";
import { makeFocusCell } from "./api/focus-cell.js";
import { makeEditBegin } from "./api/edit-begin.js";
import { makeEditIsCellActive } from "./api/edit-is-cell-active.js";
import { makeEditEnd } from "./api/edit-end.js";
import { makeEditUpdate } from "./api/edit-update.js";
import { makeRowById } from "./api/row-by-id.js";
import { makeRowByIndex } from "./api/row-by-index.js";
import { makeRowDetailIsExpanded } from "./api/row-detail-is-expanded.js";
import { makeRowDetailToggle } from "./api/row-detail-toggle.js";
import { makeRowDetailRenderedHeight } from "./api/row-detail-rendered-height.js";
import { columnHandleMarker } from "./helpers/column-marker.js";
import { makeRowSelect } from "./api/row-select.js";
import { makeRowSelectAll } from "./api/row-select-all.js";
import { makeRowSelected } from "./api/row-selected.js";
import { makeRowHandleSelect } from "./api/row-handle-select.js";
import { makeUseRowDrag } from "./api/use-row-drag.js";
import { makeColumnById } from "./api/column-by-id.js";
import { makeColumnResize } from "./api/column-resize.js";
import { makeColumnUpdate } from "./api/column-update.js";
import { makeColumnMove } from "./api/column-move.js";
import { makeColumnGroupToggle } from "./api/column-group-toggle.js";
import { makeColumnAutosize } from "./api/column-autosize.js";
import { makeExportCsv, makeExportCsvFile } from "./api/export-csv.js";
import { makeExportDataRect } from "./api/export-data-rect.js";
import { makeDialogFrameClose, makeDialogFrameOpen } from "./api/dialog-frame.js";
import { makePopoverFrameClose, makePopoverFrameOpen } from "./api/popover-frame.js";
import { makePositionFromElement } from "./api/position-from-element.js";
import { splitCellSelectionRect } from "../cell-selection/split-cell-selection-rect.js";
import { boundSelectionRect } from "../cell-selection/bound-selection-rect.js";
import { makeCellRoot } from "./api/cell-root.js";

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

  const rowHeight = atom<RowHeight>(40);
  if (typeof p.rowHeight === "function") {
    store.set(rowHeight, () => p.rowHeight as any);
  } else {
    store.set(rowHeight, p.rowHeight ?? 40);
  }

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
  const filterModel = atom<Record<string, FilterModelItem<T>>>(p.filterModel ?? {});
  const filterInModel = atom<Record<string, FilterIn>>(p.filterInModel ?? {});
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

  const columnMarker = atom(p.columnMarker ?? {});
  const columnMarkerEnabled = atom(p.columnMarkerEnabled ?? false);
  const columnDoubleClickToAutosize = atom(p.columnDoubleClickToAutosize ?? true);

  const rowDetailHeight = atom(p.rowDetailHeight ?? 300);
  const rowDetailAutoHeightGuess = atom(p.rowDetailAutoHeightGuess ?? 300);
  const rowDetailExpansions = atom(p.rowDetailExpansions ?? new Set<string>());
  const rowDetailRenderer = atom({ fn: p.rowDetailRenderer ?? (() => "Not defined") });

  const rowSelectedIds = atom(p.rowSelectedIds ?? new Set<string>());
  const rowSelectionMode = atom(p.rowSelectionMode ?? "none");
  const rowSelectChildren = atom(p.rowSelectChildren ?? false);
  const rowSelectionActivator = atom<RowSelectionActivator>(
    p.rowSelectionActivator ?? "single-click",
  );

  const virtualizeRows = atom(p.virtualizeRows ?? true);
  const virtualizeCols = atom(p.virtualizeCols ?? true);

  const quickSearch = atom(p.quickSearch ?? null);
  const quickSearchSensitivity = atom(p.quickSearchSensitivity ?? "case-insensitive");

  const columnPivotMode = atom(p.columnPivotMode ?? false);
  const columnPivotModel = atom(
    p.columnPivotModel ??
      ({
        columns: [],
        filters: {},
        filtersIn: {},
        rows: [],
        sorts: [],
        values: [],
      } satisfies ColumnPivotModel<T>),
  );
  const columnPivotColumns = atom<Column<T>[]>([]);
  const columnPivotColumnGroupExpansions = atom<Record<string, boolean | undefined>>({});
  const columnPivotRowGroupExpansions = atom<Record<string, boolean | undefined>>({});

  const cellSelections = atom<DataRect[]>(p.cellSelections ?? []);
  const cellSelectionMode = atom(p.cellSelectionMode ?? "none");

  const internal__rowGroupColumnState = atom<Record<string, Partial<Column<T>>>>({});

  const internal_cellSelectionPivot = atom<DataRect | null>(null);
  const internal_cellSelectionAdditive = atom<DataRect[] | null>(null);

  const internal_cellSelectionSplits = atom((g) => {
    const selections = g(cellSelections);
    const topCount = g(rdsAtoms.topCount);
    const centerCount = g(rdsAtoms.rowCenterCount);
    const meta = g(columnMeta);

    return selections.flatMap((rect) => {
      return splitCellSelectionRect({
        rect,
        rowTopCount: topCount,
        rowCenterCount: centerCount,
        colStartCount: meta.columnVisibleStartCount,
        colCenterCount: meta.columnVisibleCenterCount,
      });
    });
  });

  const dialogFrame = atom(p.dialogFrames ?? {});
  const popoverFrame = atom(p.popoverFrames ?? {});

  const internal_rowSelectionPivot = atom<string | null>(null);
  const internal_rowSelectionLastWasDeselect = atom<boolean>(false);
  const rowSelectionPivot = atom((g) => g(internal_rowSelectionPivot));

  const internal_draggingHeader = atom<HeaderGroupCellLayout | null>(null);
  const internal_rowAutoHeightCache = atom<Record<number, number>>({});
  const internal_rowDetailHeightCache = atom<Record<number, number>>({});
  const internal_focusActive = atom<PositionUnion | null>(null);
  const internal_focusPrevCol = atom<number | null>(null);
  const internal_focusPrevRow = atom<number | null>(null);
  const internal_editActivePosition = atom<EditActivePosition<T> | null>(null);
  const internal_editData = atom<any>(null);
  const internal_editValidation = atom<Record<string, any> | boolean>(true);
  const internal_dialogFrames = atom<Record<string, any>>({});
  const internal_popoverFrames = atom<
    Record<string, { target: HTMLElement | VirtualTarget; context: any }>
  >({});

  const columnCount$ = atom((g) => {
    const bound = g(bounds);
    return bound.colEndEnd;
  });

  const layoutState = makeLayoutState(0);
  const layoutState$ = atom((g) => {
    g(rdsAtoms.bottomCount);
    g(rdsAtoms.rowCenterCount);
    g(rdsAtoms.topCount);
    g(rdsAtoms.snapshotKey); // Not sure why we need this?
    g(rowDataSource);
    g(rowGroupModel);
    g(sortModel);
    g(filterModel);
    g(aggModel);

    const rowCount = g(rdsAtoms.rowCount);
    const columnCount = g(columnCount$);

    if (rowCount > layoutState.computed.length || columnCount != layoutState.base.length) {
      Object.assign(layoutState, makeLayoutState(columnCount, rowCount + 2000));
    } else {
      layoutState.computed.fill(0);
      layoutState.special.fill(0);
      layoutState.lookup.clear();
    }

    return layoutState;
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
    const groupState = g(internal__rowGroupColumnState);
    const pivotMode = g(columnPivotMode);

    let cols: Column<T>[];
    if (pivotMode) {
      const model = g(columnPivotModel);
      cols = columnAddRowGroup({
        columns: g(columnPivotColumns),
        rowGroupDisplayMode: "single-column",
        rowGroupModel: model.rows.filter((c) => c.active ?? true).map((c) => c.field),
        rowGroupTemplate: g(rowGroupColumn),
        rowGroupColumnState: groupState,
      });
    } else {
      cols = columnAddRowGroup({
        columns: g(columns),
        rowGroupDisplayMode: g(rowGroupDisplayMode),
        rowGroupModel: g(rowGroupModel),
        rowGroupTemplate: g(rowGroupColumn),
        rowGroupColumnState: groupState,
      });
    }

    const colsWithMarker = columnHandleMarker({
      columns: cols,
      marker: g(columnMarker),
      markerEnabled: g(columnMarkerEnabled),
    });

    const view = makeColumnView({
      columns: colsWithMarker,
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

    const dragged = g(internal_draggingHeader);

    // When dragging a group column, we may end up removing that group column when joining
    // the group with other columns in the same group (if they are separated). We want to ensure
    // the group remains mounted until after the drag. Hence we check if there would've been a merge
    // and add the dragged element to the layout. Once the drag ends the element will be removed. The
    // isHiddenMove is important for this.
    if (dragged) {
      const row = dragged.rowStart;
      const has = layout[row].findIndex(
        (c) => c.kind === "group" && c.idOccurrence === dragged.idOccurrence,
      );
      if (has === -1) {
        layout[row].push({ ...dragged, isHiddenMove: true });
      }
    }

    return { maxCol: view.maxCol, maxRow: view.maxRow, layout: layout };
  });

  const columnGroupMeta = atom((g) => g(columnView).meta);
  const columnMeta = atom<ColumnMeta<T>>((g) => {
    const view = g(columnView);

    return {
      columnLookup: view.lookup,
      columnsVisible: view.visibleColumns,
      columnVisibleCenterCount: view.centerCount,
      columnVisibleEndCount: view.endCount,
      columnVisibleStartCount: view.startCount,
    };
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

    const detailExpansions = g(rowDetailExpansions);
    g(internal_rowDetailHeightCache);

    const rds = g(rowDataSource);

    const rows = Object.fromEntries(
      [...detailExpansions]
        .map((x) => rds.rowToIndex(x))
        .filter((x) => x != null)
        .map((x) => [x, api.rowByIndex(x)]),
    );

    const headerHeight = g(headerHeightTotal);

    return computeRowPositions(
      rowCount,
      g(rowHeight),
      g(rowAutoHeightGuess),
      g(internal_rowAutoHeightCache),
      (i: number) => {
        const row = rows[i];
        if (!row || !api.rowDetailIsExpanded(row)) return 0;

        return api.rowDetailRenderedHeight(row);
      },
      innerHeight - headerHeight,
    );
  });

  const heightTotal = atom((g) => g(yPositions).at(-1)!);

  const rowView = atom<GridView<T>["rows"]>((g) => {
    let n = g(bounds);

    if (!g(virtualizeRows)) {
      n = { ...n, rowCenterStart: n.rowTopEnd, rowCenterEnd: n.rowCenterLast };
    }
    if (!g(virtualizeCols)) {
      n = { ...n, colCenterStart: n.colStartEnd, colCenterEnd: n.colCenterLast };
    }

    const rowScan = g(rowScanDistance);

    const columns = g(columnMeta).columnsVisible;
    const rds = g(rowDataSource);

    const layout = g(layoutState$);

    const topCount = g(rdsAtoms.topCount);
    const botCount = g(rdsAtoms.bottomCount);
    const rowCount = g(rdsAtoms.rowCount);

    updateFull({
      topCount,
      botCount,

      startCount: n.colStartEnd,
      endCount: n.colEndEnd - n.colEndStart,
      centerCount: n.colCenterLast - n.colStartEnd,

      computeColSpan: getSpanFn(rds, grid, columns, "col"),
      computeRowSpan: getSpanFn(rds, grid, columns, "row"),

      isFullWidth: getFullWidthCallback(rds, g(rowFullWidthPredicate).fn, grid),
      isRowCutoff: (r) => {
        const row = rds.rowByIndex(r);
        return !row || row.kind === "branch";
      },

      rowScanDistance: rowScan,
      rowStart: n.rowCenterStart,
      rowEnd: n.rowCenterEnd,
      rowMax: n.rowCenterEnd,

      ...layout,
    });

    const yPos = g(yPositions);

    const botStart = rowCount - botCount;

    const focus = g(internal_focusActive);
    const view = makeRowLayout({
      view: n,
      layout,
      rds: rowDataStore,
      columns,
      focus: g(internal_focusActive),
    });

    const topHeight = yPos[topCount];
    const botHeight = yPos.at(-1)! - yPos[botStart];
    const centerHeight = yPos.at(-1)! - topHeight - botHeight;

    return {
      ...view,
      rowFocusedIndex:
        focus?.kind === "cell" || focus?.kind === "full-width"
          ? focus.rowIndex < topCount || focus.rowIndex >= rowCount - botCount
            ? null
            : focus.rowIndex
          : null,
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
    filterInModel: makeGridAtom(filterInModel, store),
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

    columnMarker: makeGridAtom(columnMarker, store),
    columnMarkerEnabled: makeGridAtom(columnMarkerEnabled, store),
    columnDoubleClickToAutosize: makeGridAtom(columnDoubleClickToAutosize, store),
    rowDetailExpansions: makeGridAtom(rowDetailExpansions, store),
    rowDetailHeight: makeGridAtom(rowDetailHeight, store),
    rowDetailRenderer: makeGridAtom(rowDetailRenderer, store),
    rowDetailAutoHeightGuess: makeGridAtom(rowDetailAutoHeightGuess, store),

    rowSelectedIds: makeGridAtom(rowSelectedIds, store),
    rowSelectionMode: makeGridAtom(rowSelectionMode, store),
    rowSelectionPivot: makeGridAtom(rowSelectionPivot, store),
    rowSelectionActivator: makeGridAtom(rowSelectionActivator, store),
    rowSelectChildren: makeGridAtom(rowSelectChildren, store),

    viewBounds: makeGridAtom(bounds, store),
    virtualizeRows: makeGridAtom(virtualizeRows, store),
    virtualizeCols: makeGridAtom(virtualizeCols, store),

    quickSearch: makeGridAtom(quickSearch, store),
    quickSearchSensitivity: makeGridAtom(quickSearchSensitivity, store),

    columnPivotMode: makeGridAtom(columnPivotMode, store),
    columnPivotColumns: makeGridAtom(columnPivotColumns, store),
    columnPivotModel: makeGridAtom(columnPivotModel, store),
    columnPivotColumnGroupExpansions: makeGridAtom(columnPivotColumnGroupExpansions, store),
    columnPivotRowGroupExpansions: makeGridAtom(columnPivotRowGroupExpansions, store),

    dialogFrames: makeGridAtom(dialogFrame, store),
    popoverFrames: makeGridAtom(popoverFrame, store),

    cellSelections: makeGridAtom(cellSelections, store),
    cellSelectionMode: makeGridAtom(cellSelectionMode, store),
  };

  const api = {} as GridApi<T>;

  const grid: Grid<T> = { state, view: makeGridAtom(gridView, store), api };

  const listeners = makeEventListeners<T>();
  Object.assign(api, {
    cellRoot: makeCellRoot(grid as any),
    columnField: makeColumnField(grid),
    columnByIndex: makeColumnByIndex(grid),
    columnIndex: makeColumnIndex(grid),
    columnById: makeColumnById(grid),
    columnResize: makeColumnResize(grid),
    columnUpdate: makeColumnUpdate(grid as any),
    columnMove: makeColumnMove(grid),
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

    rowById: makeRowById(grid),
    rowByIndex: makeRowByIndex(grid),

    rowDetailIsExpanded: makeRowDetailIsExpanded(grid),
    rowDetailRenderedHeight: makeRowDetailRenderedHeight(grid as any),
    rowDetailToggle: makeRowDetailToggle(grid),

    rowSelect: makeRowSelect(grid as any),
    rowSelectAll: makeRowSelectAll(grid as any),
    rowSelected: makeRowSelected(grid),
    rowHandleSelect: makeRowHandleSelect(grid as any),

    columnToggleGroup: makeColumnGroupToggle(grid),
    columnAutosize: makeColumnAutosize(grid as any),

    useRowDrag: makeUseRowDrag(grid),

    exportCsv: makeExportCsv(grid),
    exportCsvFile: makeExportCsvFile(grid),
    exportDataRect: makeExportDataRect(grid),

    dialogFrameClose: makeDialogFrameClose(grid as any),
    dialogFrameOpen: makeDialogFrameOpen(grid as any),

    popoverFrameClose: makePopoverFrameClose(grid as any),
    popoverFrameOpen: makePopoverFrameOpen(grid as any),

    positionFromElement: makePositionFromElement(),
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

      layout: layoutState,

      focusActive: makeGridAtom(internal_focusActive, store),
      focusPrevColIndex: makeGridAtom(internal_focusPrevCol, store),
      focusPrevRowIndex: makeGridAtom(internal_focusPrevRow, store),

      editActivePos: makeGridAtom(internal_editActivePosition, store),
      editData: makeGridAtom(internal_editData, store),
      editValidation: makeGridAtom(internal_editValidation, store),

      rowAutoHeightCache: makeGridAtom(internal_rowAutoHeightCache, store),
      rowDetailAutoHeightCache: makeGridAtom(internal_rowDetailHeightCache, store),

      rowSelectedIds: rowSelectedIds,
      rowSelectionPivot: makeGridAtom(internal_rowSelectionPivot, store),
      rowSelectionLastWasDeselect: makeGridAtom(internal_rowSelectionLastWasDeselect, store),

      draggingHeader: makeGridAtom(internal_draggingHeader, store),

      dialogFrames: makeGridAtom(internal_dialogFrames, store),
      popoverFrames: makeGridAtom(internal_popoverFrames, store),

      cellSelectionPivot: makeGridAtom(internal_cellSelectionPivot, store),
      cellSelectionAdditiveRects: makeGridAtom(internal_cellSelectionAdditive, store),
      cellSelectionIsDeselect: makeGridAtom(atom(false), store),
      cellSelectionSplits: makeGridAtom(internal_cellSelectionSplits, store),

      rowGroupColumnState: makeGridAtom(internal__rowGroupColumnState, store),
      store: store,
    } satisfies InternalAtoms,
  });

  store.sub(rowDataSource, () => {
    store.get(rowDataSource).init(grid);
  });
  store.set(rowDataSource, p.rowDataSource ?? emptyRowDataSource);

  // Ensure cell selections are bounded.
  store.sub(cellSelections, () => {
    const selections = store.get(cellSelections);
    const safeSelections = selections.map((c) => boundSelectionRect(grid, c));

    if (equal(selections, safeSelections)) return;

    store.set(cellSelections, safeSelections);
  });
  store.sub(rdsAtoms.rowCount, () => {
    const selections = store.get(cellSelections);

    const safeSelections = selections.map((c) => boundSelectionRect(grid, c));
    store.set(cellSelections, safeSelections);
  });
  store.sub(columnMeta, () => {
    const selections = store.get(cellSelections);

    const safeSelections = selections.map((c) => boundSelectionRect(grid, c));
    store.set(cellSelections, safeSelections);
  });

  return grid;
}

export function useLyteNyte<T>(p: UseLyteNyteProps<T>) {
  const m = useRef<Grid<T>>(null as any);
  if (!m.current) {
    m.current = makeLyteNyte(p);
  }

  return m.current;
}
