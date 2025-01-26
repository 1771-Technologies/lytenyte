import {
  autosizeColumn,
  autosizeColumns,
  autosizeHeaderDefaultEnterprise,
  columnIsEmpty,
  rowIsGroup,
  rowIsLeaf,
  rowIsTotal,
} from "@1771technologies/grid-core";
import {
  cellEditBegin,
  cellEditEnd,
  cellEditIsValueValid,
  cellEditPredicate,
  cellEditSetValue,
  cellEditValue,
  columnById,
  columnByIndex,
  columnField,
  columnFieldGroup,
  columnGroupToggle,
  columnIndex,
  columnIsEditable,
  columnIsGridGenerated,
  columnIsGroupAutoColumn,
  columnIsHidable,
  columnIsMarker,
  columnIsMovable,
  columnIsResizable,
  columnIsRowGroupable,
  columnIsSortable,
  columnIsVisible,
  columnMoveAfter,
  columnMoveBefore,
  columnMoveToVisibleIndex,
  columnResize,
  columnResizeMany,
  columnSortCycle,
  columnSortCycleIndex,
  columnSortCycleToNext,
  columnSortDirection,
  columnSortGetNext,
  columnSortModelIndex,
  columnUpdate,
  columnUpdateMany,
  columnVisualWidth,
  events,
  exportCsv,
  exportCsvFile,
  exportDataRect,
  keyBindingCall,
  keyBindingCallWithEvent,
  navigate,
  paginateRowStartAndEndForPage,
  rowById,
  rowByIndex,
  rowDepth,
  rowDetailIsExpanded,
  rowDetailRowPredicate,
  rowDetailToggle,
  rowDetailVisibleHeight,
  rowGroupIsExpanded,
  rowGroupToggle,
  rowIsDraggable,
  rowReplaceBottomData,
  rowReplaceData,
  rowReplaceTopData,
  rowSelection,
  rowSetData,
  rowSetDataMany,
  rowUpdateRedo,
  rowUpdateUndo,
  rowVisibleRowHeight,
} from "@1771technologies/grid-shared-state";
import type {
  ApiEnterprise,
  ColumnEnterprise,
  StoreEnterprise,
} from "@1771technologies/grid-types";
import { clipboard } from "./clipboard";
import { columnMenus } from "./column-menus";
import { columnIsMeasurable } from "./column-is/column-is-measurable";
import { columnIsPivot } from "./column-is/column-is-pivot";
import { columnIsPivotable } from "./column-is/column-is-pivotable";
import { cellSelection } from "./cell-selection";
import { columnPivots } from "./column-pivots";
import { frames } from "./frames";

export function makeApi<D, E>(
  state: StoreEnterprise<D, E>["state"],
  api: StoreEnterprise<D, E>["api"],
): StoreEnterprise<D, E>["api"] {
  const ev = events<D, E>();

  const nav = navigate<D, E, ApiEnterprise<D, E>>(api);
  const clip = clipboard(api);
  const menu = columnMenus(api);
  const sel = cellSelection(api);
  const pivots = columnPivots(api);
  const frame = frames(api);

  const rowSelect = rowSelection(api);

  const partial = {
    autosizeColumn: (column, options) => autosizeColumn(api, column, options),
    autosizeColumns: (columns, options) =>
      autosizeColumns(api, autosizeHeaderDefaultEnterprise as any, columns, options),

    cellEditBegin: (l, makeActive) => cellEditBegin(api, l, makeActive),
    cellEditEnd: (p, cancel) => cellEditEnd(api, p, cancel),
    cellEditIsValueValid: (p) => cellEditIsValueValid(api, p),
    cellEditSetValue: (p, v) => cellEditSetValue(api, p, v),
    cellEditValue: (p) => cellEditValue(api, p),
    cellEditPredicate: (row, c) => cellEditPredicate(api, row, c),
    cellEditIsActive: () => state.internal.cellEditActiveEdits.peek().size > 0,

    columnById: (id) => columnById(api, id) as any,
    columnByIndex: (index) => columnByIndex(api, index) as ColumnEnterprise<D, E>,
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

    keyBindingCall: (k) => keyBindingCall(api, k),
    keyBindingCallWithEvent: (event) => keyBindingCallWithEvent(api, event),

    navigateDown: nav.navigateDown,
    navigateGetBottom: nav.navigateGetBottom,
    navigateGetDown: nav.navigateGetDown,
    navigateGetEnd: nav.navigateGetEnd,
    navigateGetNext: nav.navigateGetNext,
    navigateGetPageDown: nav.navigateGetPageDown,
    navigateGetPageUp: nav.navigateGetPageUp,
    navigateGetPosition: nav.navigateGetPosition,
    navigateGetPrev: nav.navigateGetPrev,
    navigateGetStart: nav.navigateGetStart,
    navigateGetTop: nav.navigateGetTop,
    navigateGetUp: nav.navigateGetUp,
    navigateNext: nav.navigateNext,
    navigatePageDown: nav.navigatePageDown,
    navigatePageUp: nav.navigatePageUp,
    navigatePrev: nav.navigatePrev,
    navigateScrollIntoView: nav.navigateScrollIntoView,
    navigateSetPosition: nav.navigateSetPosition,
    navigateToBottom: nav.navigateToBottom,
    navigateToEnd: nav.navigateToEnd,
    navigateToStart: nav.navigateToStart,
    navigateToTop: nav.navigateToTop,
    navigateUp: nav.navigateUp,

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
    rowIsTotal,
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

    // Enterprise Api
    clipboardCopyCells: clip.clipboardCopyCells,
    clipboardCutCells: clip.clipboardCutCells,
    clipboardPasteCells: clip.clipboardPasteCells,

    columnFilterMenuClose: menu.columnCloseFilterMenu,
    columnMenuClose: menu.columnCloseMenu,
    columnMenuOpen: menu.columnOpenMenu,
    columnFilterMenuOpen: menu.columnOpenFilterMenu,

    columnIsMeasurable: (c) => columnIsMeasurable(api, c),
    columnIsPivot: (c) => columnIsPivot(api, c),
    columnIsPivotable: (c) => columnIsPivotable(api, c),
    columnIsEditable: (c) => columnIsEditable(api, c),

    cellSelectionIsSelected: sel.cellSelectionIsSelected,
    cellSelectionDeselectRect: sel.cellSelectionDeselectRect,
    cellSelectionExpandDown: sel.cellSelectionExpandDown,
    cellSelectionExpandEnd: sel.cellSelectionExpandEnd,
    cellSelectionExpandStart: sel.cellSelectionExpandStart,
    cellSelectionExpandUp: sel.cellSelectionExpandUp,
    cellSelectionSelectRect: sel.cellSelectionSelectRect,

    columnPivotFieldFromData: pivots.columnPivotFieldFromData,
    columnPivotField: pivots.columnPivotField,
    columnPivotFilterModel: pivots.columnPivotFilterModel,
    columnPivotMeasureField: pivots.columnPivotMeasureField,
    columnPivots: pivots.columnPivots,
    columnPivotSetFilterModel: pivots.columnPivotSetFilterModel,
    columnPivotSetSortModel: pivots.columnPivotSetSortModel,
    columnPivotsLoading: pivots.columnPivotsLoading,
    columnPivotSortModel: pivots.columnPivotSortModel,
    columnPivotsReload: pivots.columnPivotsReload,

    columnInFilterItems: (c) =>
      api.getState().internal.rowBackingDataSource.peek().columnInFilterItems(c),

    contextMenuClose: () => api.getState().internal.contextMenuTarget.set(null),

    floatingFrameClose: frame.floatingFrameClose,
    floatingFrameOpen: frame.floatingFrameOpen,
    panelFrameClose: frame.panelFrameClose,
    panelFrameOpen: frame.panelFrameOpen,

    rowReload: () => api.getState().internal.rowBackingDataSource.peek().rowReload(),
    rowReloadExpansion: (row) =>
      api.getState().internal.rowBackingDataSource.peek().rowReloadExpansion(row),
    rowReset: () => api.getState().internal.rowBackingDataSource.peek().rowReset(),
  } satisfies StoreEnterprise<D, E>["api"];

  Object.assign(api, partial);

  return api;
}
