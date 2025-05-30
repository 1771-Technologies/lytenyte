import {
  autosizeColumn,
  autosizeColumns,
  autosizeMeasure,
  rowIsGroup,
  rowIsLeaf,
} from "@1771technologies/grid-core";
import {
  cellEditBegin,
  cellEditEnd,
  cellEditIsValueValid,
  cellEditPredicate,
  cellEditSetValue,
  cellEditValue,
  columnField,
  columnFieldGroup,
  columnIsEmpty,
  columnIsGridGenerated,
  columnIsGroupAutoColumn,
  columnIsMarker,
  columnIsResizable,
  columnIsVisible,
  columnIsSortable,
  columnIsHidable,
  columnIsMovable,
  columnIsRowGroupable,
  columnSortCycle,
  columnSortCycleIndex,
  columnSortDirection,
  columnSortCycleToNext,
  columnSortGetNext,
  columnSortModelIndex,
  columnById,
  columnByIndex,
  columnGroupToggle,
  columnIndex,
  columnMoveAfter,
  columnMoveBefore,
  columnMoveToVisibleIndex,
  columnResize,
  columnResizeMany,
  columnUpdate,
  columnUpdateMany,
  columnVisualWidth,
  exportCsv,
  exportCsvFile,
  exportDataRect,
  paginateRowStartAndEndForPage,
  rowById,
  rowByIndex,
  rowDepth,
  rowDetailIsExpanded,
  rowDetailRowPredicate,
  rowDetailToggle,
  rowDetailVisibleHeight,
  rowIsDraggable,
  rowReplaceBottomData,
  rowReplaceData,
  rowReplaceTopData,
  rowSetData,
  rowSetDataMany,
  rowUpdateRedo,
  rowUpdateUndo,
  rowVisibleRowHeight,
  navigate,
  columnIsEditable,
  rowGroupToggle,
  rowSelection,
  rowGroupIsExpanded,
} from "@1771technologies/grid-shared-state";
import { events } from "../../grid-shared-state/src/events";
import type { ApiCore, ColumnCore, GridCore } from "@1771technologies/grid-types/core";

export function makeApi<D, E>(
  state: GridCore<D, E>["state"],
  api: GridCore<D, E>["api"],
): GridCore<D, E>["api"] {
  const ev = events<D, E>();

  const n = navigate<D, E, ApiCore<D, E>>(api);

  const rowSelect = rowSelection(api);

  const partial = {
    autosizeColumn: (column, options) => autosizeColumn(api, column, options),
    autosizeColumns: (columns, options) => autosizeColumns(api, columns, options),
    autosizeMeasure: (text, font) => autosizeMeasure(api, text, font),

    cellEditBegin: (l, makeActive) => cellEditBegin(api, l, makeActive),
    cellEditEnd: (p, cancel) => cellEditEnd(api, p, cancel),
    cellEditIsValueValid: (p) => cellEditIsValueValid(api, p),
    cellEditSetValue: (p, v) => cellEditSetValue(api, p, v),
    cellEditValue: (p) => cellEditValue(api, p),
    cellEditPredicate: (row, c) => cellEditPredicate(api, row, c),
    cellEditIsActive: () => state.internal.cellEditActiveEdits.peek().size > 0,

    columnById: (id) => columnById(api, id),
    columnByIndex: (index) => columnByIndex(api, index) as ColumnCore<D, E>,
    columnField: (row, column) => columnField(api, row, column),
    columnFieldGroup: (row, column) => columnFieldGroup(api, row, column),
    columnGroupToggle: (id, state) => columnGroupToggle(api, id, state),
    columnIndex: (c) => columnIndex(api, c),

    columnIsEmpty: (c) => columnIsEmpty(c),
    columnIsGridGenerated: (c) => columnIsGridGenerated(api, c),
    columnIsGroupAutoColumn: (c) => columnIsGroupAutoColumn(c),
    columnIsHidable: (c) => columnIsHidable(api, c),
    columnIsMarker: (c) => columnIsMarker(c),
    columnIsMovable: (c) => columnIsMovable(api, c),
    columnIsResizable: (c) => columnIsResizable(api, c),
    columnIsRowGroupable: (c) => columnIsRowGroupable(api, c),
    columnIsSortable: (c) => columnIsSortable(api, c),
    columnIsVisible: (c) => columnIsVisible(api, c),
    columnIsEditable: (c) => columnIsEditable(api, c),

    columnActiveAgg: (c) => {
      const aggModel = state.aggModel.peek();
      const columnAgg = aggModel[c.id];

      return columnAgg ?? null;
    },

    columnMoveAfter: (src, dest) => columnMoveAfter(api, src, dest),
    columnMoveBefore: (src, dest) => columnMoveBefore(api, src, dest),
    columnMoveToVisibleIndex: (src, i, b) => columnMoveToVisibleIndex(api, src, i, b),

    columnResize: (c, w) => columnResize(api, c, w),
    columnResizeMany: (u) => columnResizeMany(api, u),

    columnSortCycle: (c) => columnSortCycle(api, c),
    columnSortCycleIndex: (c) => columnSortCycleIndex(api, c),
    columnSortCycleToNext: (c, additive) => columnSortCycleToNext(api, c, additive),
    columnSortDirection: (c) => columnSortDirection(api, c),
    columnSortModelIndex: (c) => columnSortModelIndex(api, c),
    columnSortGetNext: (c) => columnSortGetNext(api, c),

    columnUpdate: (c, u) => columnUpdate(api, c, u as any),
    columnUpdateMany: (u) => columnUpdateMany(api, u),
    columnVisualWidth: (c) => columnVisualWidth(api, c),

    eventAddListener: ev.eventAddListeners as any,
    eventFire: ev.eventFire as any,
    eventGetListeners: ev.eventGetListeners as any,
    eventRemoveListener: ev.eventRemoveListener as any,

    exportCsv: (opts) => exportCsv(api, opts as any),
    exportCsvFile: (opts) => exportCsvFile(api, opts as any),
    exportDataRect: (opts) => exportDataRect(api, opts as any) as any,

    getState: () => state,

    navigateDown: n.navigateDown,
    navigateGetBottom: n.navigateGetBottom,
    navigateGetDown: n.navigateGetDown,
    navigateGetEnd: n.navigateGetEnd,
    navigateGetNext: n.navigateGetNext,
    navigateGetPageDown: n.navigateGetPageDown,
    navigateGetPageUp: n.navigateGetPageUp,
    navigateGetPosition: n.navigateGetPosition,
    navigateGetPrev: n.navigateGetPrev,
    navigateGetStart: n.navigateGetStart,
    navigateGetTop: n.navigateGetTop,
    navigateGetUp: n.navigateGetUp,
    navigateNext: n.navigateNext,
    navigatePageDown: n.navigatePageDown,
    navigatePageUp: n.navigatePageUp,
    navigatePrev: n.navigatePrev,
    navigateScrollIntoView: n.navigateScrollIntoView,
    navigateSetPosition: n.navigateSetPosition,
    navigateToBottom: n.navigateToBottom,
    navigateToEnd: n.navigateToEnd,
    navigateToStart: n.navigateToStart,
    navigateToTop: n.navigateToTop,
    navigateUp: n.navigateUp,

    paginateRowStartAndEndForPage: (i) => paginateRowStartAndEndForPage(api, i),

    rowRefresh: () => state.internal.rowRefreshCount.set((prev) => prev + 1),
    rowById: (id) => rowById(api, id),
    rowByIndex: (i, s) => rowByIndex(api, i, s),
    rowDepth: (i, s) => rowDepth(api, i, s),
    rowDetailRowPredicate: (id) => rowDetailRowPredicate(api, id),
    rowDetailIsExpanded: (id) => rowDetailIsExpanded(api, id),
    rowDetailToggle: (id, s) => rowDetailToggle(api, id, s),
    rowDetailVisibleHeight: (id) => rowDetailVisibleHeight(api, id),
    rowIsGroup,
    rowIsLeaf,
    rowIsDraggable: (id) => rowIsDraggable(api, id),
    rowVisibleRowHeight: (id, s) => rowVisibleRowHeight(api, id, s),
    rowGroupToggle: (row, state) => rowGroupToggle(api, row, state),
    rowGroupIsExpanded: (row) => rowGroupIsExpanded(api, row),

    rowSelectionAllRowsSelected: rowSelect.rowSelectionAllRowsSelected,
    rowSelectionClear: rowSelect.rowSelectionClear,
    rowSelectionDeselect: rowSelect.rowSelectionDeselect,
    rowSelectionGetSelected: rowSelect.rowSelectionGetSelected,
    rowSelectionIsIndeterminate: rowSelect.rowSelectionIsIndeterminate,
    rowSelectionSelect: rowSelect.rowSelectionSelect,
    rowSelectionSelectAll: rowSelect.rowSelectionSelectAll,
    rowSelectionSelectAllSupported: rowSelect.rowSelectionSelectAllSupported,

    rowReplaceBottomData: (d) => rowReplaceBottomData(api, d),
    rowReplaceData: (d) => rowReplaceData(api, d),
    rowReplaceTopData: (d) => rowReplaceTopData(api, d),
    rowSetData: (id, d) => rowSetData(api, id, d),
    rowSetDataMany: (updates) => rowSetDataMany(api, updates),
    rowUpdateRedo: () => rowUpdateRedo(api),
    rowUpdateUndo: () => rowUpdateUndo(api),
  } satisfies ApiCore<D, E>;

  Object.assign(api, partial);

  return api;
}
