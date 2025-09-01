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
  RowLayout,
} from "../+types.js";
import { type Grid, type GridView, type UseLyteNyteProps } from "../+types.js";
import { useRef } from "react";
import { makeColumnView } from "./helpers/column-view.js";
import {
  computeBounds,
  computeColumnPositions,
  computed,
  computeRowPositions,
  effect,
  makeAtom,
  makeLayoutState,
  makeRowStore,
  signal,
  updateFull,
} from "@1771technologies/lytenyte-shared";
import type { InternalAtoms } from "./+types.js";
import { makeRowLayout } from "./helpers/row-layout/row-layout.js";
import { equal, rangesOverlap } from "@1771technologies/lytenyte-js-utils";
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
import {
  splitCellSelectionRect,
  type DataRectSplit,
} from "../cell-selection/split-cell-selection-rect.js";
import { boundSelectionRect } from "../cell-selection/bound-selection-rect.js";
import { makeCellRoot } from "./api/cell-root.js";
import { splitOnPivot } from "../cell-selection/split-on-pivot.js";

const EMPTY_POSITION_ARRAY = new Uint32Array();

const DEFAULT_HEADER_HEIGHT = 40;
const COLUMN_GROUP_JOIN_DELIMITER = "-->";

export function makeLyteNyte<T>(p: UseLyteNyteProps<T>): Grid<T> {
  /**
   * Primitive ATOMS and State
   */
  const rtl = signal(p.rtl ?? false);
  const columns = signal(p.columns ?? []);
  const base = signal(p.columnBase ?? {});
  const gridId = signal(p.gridId);
  const headerHeight = signal(p.headerHeight ?? DEFAULT_HEADER_HEIGHT);
  const headerGroupHeight = signal(p.headerGroupHeight ?? DEFAULT_HEADER_HEIGHT);
  const columnSizeToFit = signal(p.columnSizeToFit ?? false);
  const viewport = signal<HTMLElement | null>(null);
  const viewportHeightInner = signal(0);
  const viewportHeightOuter = signal(0);
  const viewportWidthInner = signal(0);
  const viewportWidthOuter = signal(0);
  const columnGroupJoinDelimiter = signal(
    p.columnGroupJoinDelimiter ?? COLUMN_GROUP_JOIN_DELIMITER,
  );
  const columnGroupExpansions = signal(p.columnGroupExpansions ?? {});
  const columnGroupDefaultExpansion = signal(p.columnGroupDefaultExpansion ?? true);

  const rowDataSource = signal<RowDataSource<T>>(emptyRowDataSource);

  const rowHeight = signal<RowHeight>(40);
  if (typeof p.rowHeight === "function") rowHeight.set(() => p.rowHeight as any);
  else rowHeight.set(p.rowHeight ?? 40);

  const rowAutoHeightGuess = signal(p.rowAutoHeightGuess ?? 40);

  const rowScanDistance = signal(p.rowScanDistance ?? 100);
  const colScanDistance = signal(p.colScanDistance ?? 100);

  const rowOverscanTop = signal(p.rowOverscanTop ?? 10);
  const rowOverscanBottom = signal(p.rowOverscanBottom ?? 10);
  const colOverScanStart = signal(p.colOverscanStart ?? 2);
  const colOverscanEnd = signal(p.colOverscanEnd ?? 2);

  const xScroll = signal(0);
  const yScroll = signal(0);

  const cellRenderers = signal(p.cellRenderers ?? {});
  const rowFullWidthPredicate = signal({ fn: p.rowFullWidthPredicate ?? null });
  const rowFullWidthRenderer = signal({ fn: p.rowFullWidthRenderer ?? (() => "Not defined") });

  const sortModel = signal<SortModelItem<T>[]>(p.sortModel ?? []);
  const filterModel = signal<Record<string, FilterModelItem<T>>>(p.filterModel ?? {});
  const filterInModel = signal<Record<string, FilterIn>>(p.filterInModel ?? {});
  const rowGroupModel = signal(p.rowGroupModel ?? []);
  const aggModel = signal(p.aggModel ?? {});

  const rowGroupDisplayMode = signal(p.rowGroupDisplayMode ?? "single-column");
  const rowGroupDefaultExpansion = signal(p.rowGroupDefaultExpansion ?? false);
  const rowGroupExpansions = signal(p.rowGroupExpansions ?? {});
  const rowGroupColumn = signal(p.rowGroupColumn ?? {});

  const headerCellRenderers = signal(p.headerCellRenderers ?? {});
  const floatingCellRenderers = signal(p.floatingCellRenderers ?? {});
  const floatingRowEnabled = signal(p.floatingRowEnabled ?? false);
  const floatingRowHeight = signal(p.floatingRowHeight ?? 40);

  const editRenderers = signal(p.editRenderers ?? {});
  const editRowValidatorFn = signal({ fn: p.editRowValidatorFn ?? (() => true) });
  const editClickActivator = signal(p.editClickActivator ?? "single");
  const editCellMode = signal(p.editCellMode ?? "readonly");

  const columnMarker = signal(p.columnMarker ?? {});
  const columnMarkerEnabled = signal(p.columnMarkerEnabled ?? false);
  const columnDoubleClickToAutosize = signal(p.columnDoubleClickToAutosize ?? true);

  const rowDetailHeight = signal(p.rowDetailHeight ?? 300);
  const rowDetailAutoHeightGuess = signal(p.rowDetailAutoHeightGuess ?? 300);
  const rowDetailExpansions = signal(p.rowDetailExpansions ?? new Set<string>());
  const rowDetailRenderer = signal({ fn: p.rowDetailRenderer ?? (() => "Not defined") });

  const rowSelectedIds = signal(p.rowSelectedIds ?? new Set<string>());
  const rowSelectionMode = signal(p.rowSelectionMode ?? "none");
  const rowSelectChildren = signal(p.rowSelectChildren ?? false);
  const rowSelectionActivator = signal<RowSelectionActivator>(
    p.rowSelectionActivator ?? "single-click",
  );

  const virtualizeRows = signal(p.virtualizeRows ?? true);
  const virtualizeCols = signal(p.virtualizeCols ?? true);

  const quickSearch = signal(p.quickSearch ?? null);
  const quickSearchSensitivity = signal(p.quickSearchSensitivity ?? "case-insensitive");

  const columnPivotMode = signal(p.columnPivotMode ?? false);
  const columnPivotModel = signal(
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
  const columnPivotColumns = signal<Column<T>[]>([]);
  const columnPivotColumnGroupExpansions = signal<Record<string, boolean | undefined>>({});
  const columnPivotRowGroupExpansions = signal<Record<string, boolean | undefined>>({});

  const cellSelections = signal<DataRect[]>(p.cellSelections ?? []);
  const cellSelectionMode = signal(p.cellSelectionMode ?? "none");

  const internal__rowGroupColumnState = signal<Record<string, Partial<Column<T>>>>({});

  const internal_cellSelectionPivot = signal<DataRectSplit | null>(null);
  const internal_cellSelectionAdditive = signal<DataRectSplit[] | null>(null);

  const internal_cellSelectionSplits = computed(() => {
    const selections = cellSelections();
    const topCount = rowDataStore.rowTopCount.$();
    const centerCount = rowDataStore.rowCenterCount.$();
    const meta = columnMeta();

    const p = internal_cellSelectionPivot();

    const splits = selections.flatMap((rect) => {
      return splitCellSelectionRect({
        rect,
        rowTopCount: topCount,
        rowCenterCount: centerCount,
        colStartCount: meta.columnVisibleStartCount,
        colCenterCount: meta.columnVisibleCenterCount,
      });
    });

    const firstWithinPivot = splits.findIndex(
      (c) =>
        p &&
        p.rowStart >= c.rowStart &&
        p.rowEnd <= c.rowEnd &&
        p.columnStart >= c.columnStart &&
        p.columnEnd <= c.columnEnd,
    );

    if (firstWithinPivot !== -1) {
      const pivotSplits = splitOnPivot(splits[firstWithinPivot], p!);

      if (pivotSplits) splits.splice(firstWithinPivot, 1, ...pivotSplits);
      else splits.splice(firstWithinPivot, 1);
    }

    return splits;
  });

  const dialogFrame = signal(p.dialogFrames ?? {});
  const popoverFrame = signal(p.popoverFrames ?? {});

  const internal_rowSelectionPivot = signal<string | null>(null);
  const internal_rowSelectionLastWasDeselect = signal<boolean>(false);

  const internal_draggingHeader = signal<HeaderGroupCellLayout | null>(null);
  const internal_rowAutoHeightCache = signal<Record<number, number>>({});
  const internal_rowDetailHeightCache = signal<Record<number, number>>({});
  const internal_focusActive = signal<PositionUnion | null>(null);
  const internal_focusPrevCol = signal<number | null>(null);
  const internal_focusPrevRow = signal<number | null>(null);
  const internal_editActivePosition = signal<EditActivePosition<T> | null>(null);
  const internal_editData = signal<any>(null);
  const internal_editValidation = signal<Record<string, any> | boolean>(true);
  const internal_dialogFrames = signal<Record<string, any>>({});
  const internal_popoverFrames = signal<
    Record<string, { target: HTMLElement | VirtualTarget; context: any }>
  >({});

  const columnCount$ = computed(() => {
    const view = columnView();
    return view.visibleColumns.length;
  });

  const layoutState = makeLayoutState(0);
  const layoutState$ = computed(() => {
    rowDataStore.rowBottomCount.$();
    rowDataStore.rowCenterCount.$();
    rowDataStore.rowTopCount.$();

    rowDataSource();
    rowGroupModel();
    sortModel();
    filterModel();
    aggModel();
    filterInModel();
    columnPivotModel();

    columns();
    columnPivotColumns();

    const rowCount = rowDataStore.rowCount.$();
    const columnCount = columnCount$();

    if (rowCount > layoutState.computed.length || columnCount != layoutState.base.length) {
      Object.assign(layoutState, makeLayoutState(columnCount, rowCount + 2000));
    } else {
      layoutState.computed.fill(0);
      layoutState.special.fill(0);
      layoutState.lookup.clear();
    }

    return { layout: { ...layoutState }, cache: new Map<number, RowLayout<T>>() };
  });

  /**
   * VIEW BOUNDS
   */

  const bounds = computed(
    () => {
      const vpWidth = viewportWidthInner();
      const vpHeight = viewportHeightInner();
      const scrollTop = yScroll();
      const scrollLeft = xScroll();
      const xPos = xPositions();
      const yPos = yPositions();
      const topCount = rowDataStore.rowTopCount.$();
      const bottomCount = rowDataStore.rowBottomCount.$();
      const start = startCount();
      const end = endCount();

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

        rowOverscanTop: rowOverscanTop(),
        rowOverscanBottom: rowOverscanBottom(),
        colOverscanStart: colOverScanStart(),
        colOverscanEnd: colOverscanEnd(),
      });

      return bounds;
    },
    { dirty: (prev, next) => !equal(prev, next) },
  );

  /**
   * COLUMN VIEW
   * Compute the column layout. This impacts both the row layout and header layout. Column layout
   * is impacted by the column definitions, the group expansions, the row group display mode.
   */
  const columnView = computed(() => {
    const groupState = internal__rowGroupColumnState();
    const pivotMode = columnPivotMode();

    let cols: Column<T>[];
    if (pivotMode) {
      const model = columnPivotModel();
      cols = columnAddRowGroup({
        columns: columnPivotColumns(),
        rowGroupDisplayMode: "single-column",
        rowGroupModel: model.rows.filter((c) => c.active ?? true).map((c) => c.field),
        rowGroupTemplate: rowGroupColumn(),
        rowGroupColumnState: groupState,
      });
    } else {
      cols = columnAddRowGroup({
        columns: columns(),
        rowGroupDisplayMode: rowGroupDisplayMode(),
        rowGroupModel: rowGroupModel(),
        rowGroupTemplate: rowGroupColumn(),
        rowGroupColumnState: groupState,
      });
    }

    const colsWithMarker = columnHandleMarker({
      columns: cols,
      marker: columnMarker(),
      markerEnabled: columnMarkerEnabled(),
    });

    const view = makeColumnView({
      columns: colsWithMarker,
      base: base(),
      groupExpansionDefault: columnGroupDefaultExpansion(),
      groupExpansions: columnGroupExpansions(),
      groupJoinDelimiter: columnGroupJoinDelimiter(),
    });

    return view;
  });

  /**
   * COMPUTE ATOMS
   */

  const headerLayoutFull = computed<GridView<T>["header"]>(() => {
    const view = columnView();
    const layout = makeColumnLayout(view, floatingRowEnabled());

    return { maxCol: view.maxCol, maxRow: view.maxRow, layout };
  });

  const headerPosition$ = computed(() => {
    const focus = internal_focusActive();

    return focus?.kind === "header-cell" ||
      focus?.kind === "floating-cell" ||
      focus?.kind === "header-group-cell"
      ? focus
      : null;
  });

  const headerLayout = computed<GridView<T>["header"]>(() => {
    const view = columnView();

    const layout = headerLayoutFull();

    const spanBounds = bounds();
    const headerPos = headerPosition$();
    const filtered = layout.layout.map((row) => {
      return row.filter((col) => {
        if (col.colPin) return true;

        if (headerPos) {
          if (rangesOverlap(col.colStart, col.colEnd, headerPos.colIndex, headerPos.colIndex + 1))
            return true;
        }

        return col.colStart >= spanBounds.colCenterStart && col.colStart < spanBounds.colCenterEnd;
      });
    });

    const dragged = internal_draggingHeader();

    // When dragging a group column, we may end up removing that group column when joining
    // the group with other columns in the same group (if they are separated). We want to ensure
    // the group remains mounted until after the drag. Hence we check if there would've been a merge
    // and add the dragged element to the layout. Once the drag ends the element will be removed. The
    // isHiddenMove is important for this.
    if (dragged) {
      const row = dragged.rowStart;
      const has = filtered[row].findIndex(
        (c) => c.kind === "group" && c.idOccurrence === dragged.idOccurrence,
      );
      if (has === -1) {
        filtered[row].push({ ...dragged, isHiddenMove: true });
      }
    }

    return { maxCol: view.maxCol, maxRow: view.maxRow, layout: filtered };
  });

  const columnGroupMeta = computed(() => columnView().meta);
  const columnMeta = computed<ColumnMeta<T>>(() => {
    const view = columnView();

    return {
      columnLookup: view.lookup,
      columnsVisible: view.visibleColumns,
      columnVisibleCenterCount: view.centerCount,
      columnVisibleEndCount: view.endCount,
      columnVisibleStartCount: view.startCount,
    };
  });

  const xPositions = computed(() => {
    if (!viewport()) return EMPTY_POSITION_ARRAY;

    const view = columnView();
    return computeColumnPositions(
      view.visibleColumns,
      base(),
      viewportWidthInner(),
      columnSizeToFit(),
    );
  });
  const widthTotal = computed(() => xPositions().at(-1)!);

  const headerHeightTotal = computed(() => {
    const groupHHeight = headerGroupHeight();
    const hHeight = headerHeight();
    const view = columnView();
    const floating = floatingRowEnabled();
    const floatingHeight = floatingRowHeight();

    return (view.maxRow - 1) * groupHHeight + hHeight + (floating ? floatingHeight : 0);
  });

  const startCount = computed(() => columnView().startCount);
  const endCount = computed(() => columnView().endCount);

  /** ROWS */

  const rowDataStore = makeRowStore({
    getRow: (r) => {
      return rowDataSource().rowByIndex(r);
    },
  });

  const yPositions = computed(() => {
    if (!viewport()) return EMPTY_POSITION_ARRAY;

    const rowCount = rowDataStore.rowCount.$();
    const innerHeight = viewportHeightInner();

    const detailExpansions = rowDetailExpansions();
    internal_rowDetailHeightCache();

    const rds = rowDataSource();

    const rows = Object.fromEntries(
      [...detailExpansions]
        .map((x) => rds.rowToIndex(x))
        .filter((x) => x != null)
        .map((x) => [x, api.rowByIndex(x)]),
    );

    const headerHeight = headerHeightTotal();

    return computeRowPositions(
      rowCount,
      rowHeight(),
      rowAutoHeightGuess(),
      internal_rowAutoHeightCache(),
      (i: number) => {
        const row = rows[i];
        if (!row || !api.rowDetailIsExpanded(row)) return 0;

        return api.rowDetailRenderedHeight(row);
      },
      innerHeight - headerHeight,
    );
  });

  const heightTotal = computed(() => yPositions().at(-1)!);

  const rowView = computed<GridView<T>["rows"]>(() => {
    if (!viewport())
      return {
        bottom: [],
        center: [],
        rowBottomTotalHeight: 0,
        rowCenterTotalHeight: 0,
        rowFirstCenter: 0,
        rowFocusedIndex: 0,
        rowTopTotalHeight: 0,
        top: [],
      };
    let n = bounds();

    if (!virtualizeRows()) {
      n = { ...n, rowCenterStart: n.rowTopEnd, rowCenterEnd: n.rowCenterLast };
    }
    if (!virtualizeCols()) {
      n = { ...n, colCenterStart: n.colStartEnd, colCenterEnd: n.colCenterLast };
    }

    const rowScan = rowScanDistance();
    const columns = columnMeta().columnsVisible;

    const rds = rowDataSource();

    const { layout } = layoutState$();

    const topCount = rowDataStore.rowTopCount.$();
    const botCount = rowDataStore.rowBottomCount.$();
    const rowCount = rowDataStore.rowCount.$();

    const fullWidthPredicate = rowFullWidthPredicate().fn;
    updateFull({
      topCount,
      botCount,

      startCount: n.colStartEnd,
      endCount: n.colEndEnd - n.colEndStart,
      centerCount: n.colCenterLast - n.colStartEnd,

      computeColSpan: getSpanFn(rds, grid, columns, "col"),
      computeRowSpan: getSpanFn(rds, grid, columns, "row"),

      isFullWidth: fullWidthPredicate ? getFullWidthCallback(rds, fullWidthPredicate, grid) : null,
      isRowCutoff: (r) => {
        const row = rds.rowByIndex(r);
        return !row || row.kind === "branch";
      },

      rowScanDistance: rowScan,
      rowStart: n.rowCenterStart,
      rowEnd: n.rowCenterEnd,
      rowMax: n.rowCenterLast,

      ...layout,
    });

    const yPos = yPositions();

    const botStart = rowCount - botCount;

    const focus = internal_focusActive();
    const view = makeRowLayout({
      view: n,
      viewCache: new Map(),
      layout,
      rds: rowDataStore,
      columns,
      focus: internal_focusActive(),
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
  const gridView = computed<GridView<T>>(() => {
    return {
      header: headerLayout(),
      rows: rowView(),
    };
  });

  const state: Grid<T>["state"] = {
    rtl: makeAtom(rtl),
    columns: makeAtom(columns),
    columnMeta: makeAtom(columnMeta),
    columnBase: makeAtom(base),
    columnGroupExpansions: makeAtom(columnGroupExpansions),
    columnGroupDefaultExpansion: makeAtom(columnGroupDefaultExpansion),
    columnGroupJoinDelimiter: makeAtom(columnGroupJoinDelimiter),
    columnGroupMeta: makeAtom(columnGroupMeta),
    columnSizeToFit: makeAtom(columnSizeToFit),
    gridId: makeAtom(gridId),

    widthTotal: makeAtom(widthTotal),
    heightTotal: makeAtom(heightTotal),

    headerHeight: makeAtom(headerHeight),
    headerGroupHeight: makeAtom(headerGroupHeight),
    viewport: makeAtom(viewport),
    viewportHeightInner: makeAtom(viewportHeightInner),
    viewportHeightOuter: makeAtom(viewportHeightOuter),
    viewportWidthInner: makeAtom(viewportWidthInner),
    viewportWidthOuter: makeAtom(viewportWidthOuter),

    xPositions: makeAtom(xPositions),
    yPositions: makeAtom(yPositions),

    rowDataStore,
    rowDataSource: makeAtom(rowDataSource),
    rowAutoHeightGuess: makeAtom(rowAutoHeightGuess),
    rowHeight: makeAtom(rowHeight),

    rowScanDistance: makeAtom(rowScanDistance),
    colScanDistance: makeAtom(colScanDistance),

    colOverscanStart: makeAtom(colOverScanStart),
    colOverscanEnd: makeAtom(colOverscanEnd),
    rowOverscanTop: makeAtom(rowOverscanTop),
    rowOverscanBottom: makeAtom(rowOverscanBottom),

    rowFullWidthPredicate: makeAtom(rowFullWidthPredicate),
    rowFullWidthRenderer: makeAtom(rowFullWidthRenderer),
    cellRenderers: makeAtom(cellRenderers),

    sortModel: makeAtom(sortModel),
    filterModel: makeAtom(filterModel),
    filterInModel: makeAtom(filterInModel),
    rowGroupModel: makeAtom(rowGroupModel),
    aggModel: makeAtom(aggModel),

    rowGroupColumn: makeAtom(rowGroupColumn),
    rowGroupDefaultExpansion: makeAtom(rowGroupDefaultExpansion),
    rowGroupDisplayMode: makeAtom(rowGroupDisplayMode),
    rowGroupExpansions: makeAtom(rowGroupExpansions),

    headerCellRenderers: makeAtom(headerCellRenderers),
    floatingCellRenderers: makeAtom(floatingCellRenderers),
    floatingRowEnabled: makeAtom(floatingRowEnabled),
    floatingRowHeight: makeAtom(floatingRowHeight),

    editRenderers: makeAtom(editRenderers),
    editCellMode: makeAtom(editCellMode),
    editClickActivator: makeAtom(editClickActivator),
    editRowValidatorFn: makeAtom(editRowValidatorFn),
    editActivePosition: makeAtom(computed(() => internal_editActivePosition())),

    columnMarker: makeAtom(columnMarker),
    columnMarkerEnabled: makeAtom(columnMarkerEnabled),
    columnDoubleClickToAutosize: makeAtom(columnDoubleClickToAutosize),
    rowDetailExpansions: makeAtom(rowDetailExpansions),
    rowDetailHeight: makeAtom(rowDetailHeight),
    rowDetailRenderer: makeAtom(rowDetailRenderer),
    rowDetailAutoHeightGuess: makeAtom(rowDetailAutoHeightGuess),

    rowSelectedIds: makeAtom(rowSelectedIds),
    rowSelectionMode: makeAtom(rowSelectionMode),
    rowSelectionPivot: makeAtom(internal_rowSelectionPivot),
    rowSelectionActivator: makeAtom(rowSelectionActivator),
    rowSelectChildren: makeAtom(rowSelectChildren),

    viewBounds: makeAtom(bounds),
    virtualizeRows: makeAtom(virtualizeRows),
    virtualizeCols: makeAtom(virtualizeCols),

    quickSearch: makeAtom(quickSearch),
    quickSearchSensitivity: makeAtom(quickSearchSensitivity),

    columnPivotMode: makeAtom(columnPivotMode),
    columnPivotColumns: makeAtom(columnPivotColumns),
    columnPivotModel: makeAtom(columnPivotModel),
    columnPivotColumnGroupExpansions: makeAtom(columnPivotColumnGroupExpansions),
    columnPivotRowGroupExpansions: makeAtom(columnPivotRowGroupExpansions),

    dialogFrames: makeAtom(dialogFrame),
    popoverFrames: makeAtom(popoverFrame),

    cellSelections: makeAtom(cellSelections),
    cellSelectionMode: makeAtom(cellSelectionMode),
  };

  const api = {} as GridApi<T>;

  const grid: Grid<T> = { state, view: makeAtom(gridView), api };

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
      headerCols: makeAtom(computed(() => columnView().maxCol)),
      headerRows: makeAtom(computed(() => columnView().maxRow)),
      headerHeightTotal: makeAtom(headerHeightTotal),
      xScroll: makeAtom(xScroll),
      yScroll: makeAtom(yScroll),

      layout: layoutState,

      focusActive: makeAtom(internal_focusActive),
      focusPrevColIndex: makeAtom(internal_focusPrevCol),
      focusPrevRowIndex: makeAtom(internal_focusPrevRow),

      editActivePos: makeAtom(internal_editActivePosition),
      editData: makeAtom(internal_editData),
      editValidation: makeAtom(internal_editValidation),

      rowAutoHeightCache: makeAtom(internal_rowAutoHeightCache),
      rowDetailAutoHeightCache: makeAtom(internal_rowDetailHeightCache),

      rowSelectedIds: rowSelectedIds,
      rowSelectionPivot: makeAtom(internal_rowSelectionPivot),
      rowSelectionLastWasDeselect: makeAtom(internal_rowSelectionLastWasDeselect),

      draggingHeader: makeAtom(internal_draggingHeader),

      rowGroupColumnState: makeAtom(internal__rowGroupColumnState),

      dialogFrames: makeAtom(internal_dialogFrames),
      popoverFrames: makeAtom(internal_popoverFrames),

      cellSelectionPivot: makeAtom(internal_cellSelectionPivot),
      cellSelectionAdditiveRects: makeAtom(internal_cellSelectionAdditive),
      cellSelectionIsDeselect: makeAtom(signal(false)),
      cellSelectionSplits: makeAtom(internal_cellSelectionSplits),
    } satisfies InternalAtoms,
  });

  effect(() => {
    rowDataSource().init(grid);
  });
  rowDataSource.set(p.rowDataSource ?? emptyRowDataSource);

  // Ensure cell selections are bounded.
  effect(() => {
    rowDataStore.rowCount.$();
    columnMeta();

    const selections = cellSelections();
    const safeSelections = selections.map((c) => boundSelectionRect(grid, c));

    if (equal(selections, safeSelections)) return;

    cellSelections.set(selections);
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
