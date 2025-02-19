import type {
  ApiEnterprise,
  InitialStateEnterprise,
  PropsEnterprise,
  StateEnterprise,
} from "@1771technologies/grid-types";
import { signal } from "@1771technologies/react-cascada";
import { emptyRowDataSource } from "./utils/empty-row-data-source";
import {
  COLUMN_GROUP_HEADER_HEIGHT,
  COLUMN_GROUP_ID_DELIMITER,
  COLUMN_HEADER_HEIGHT,
  COLUMN_SCAN_DISTANCE,
  PAGINATE_PAGE_SIZE,
  ROW_DETAIL_HEIGHT,
  ROW_HEIGHT,
  ROW_UPDATE_STACK_SIZE,
} from "@1771technologies/grid-constants";
import {
  columnsComputed,
  filterModelComputed,
  rowDisplayModeComputed,
  rowGroupModelComputed,
  rowSelectionComputed,
  sortModelComputed,
} from "@1771technologies/grid-shared-state";
import { measuresComputed } from "./utils/measures-computed";
import { cellSelectionComputed } from "./utils/cell-selections-computed";

export function initialize<D, E>(
  props: PropsEnterprise<D, E>,
  state: StateEnterprise<D, E>,
  api: ApiEnterprise<D, E>,
) {
  const s = {
    aggFuncs: signal(props.aggFuncs ?? {}),
    autosizeDoubleClickHeader: signal(props.autosizeDoubleClickHeader ?? true),

    cellEditPointerActivator: signal(props.cellEditPointerActivator ?? "none"),
    cellEditProviders: signal(props.cellEditProviders ?? {}),

    cellRenderers: signal(props.cellRenderers ?? {}),

    columns: columnsComputed(props.columns ?? [], api),
    columnBase: signal(props.columnBase ?? {}),
    columnGroupDefaultExpansion: signal(props.columnGroupDefaultExpansion ?? (() => false)),
    columnGroupExpansionState: signal(props.columnGroupExpansionState ?? {}),
    columnGroupHeaderHeight: signal(props.columnGroupHeaderHeight ?? COLUMN_GROUP_HEADER_HEIGHT),
    columnGroupIdDelimiter: signal(props.columnGroupIdDelimiter ?? COLUMN_GROUP_ID_DELIMITER),
    columnGroupStickyHeaders: signal(props.columnGroupStickyHeaders ?? false),
    columnHeaderHeight: signal(props.columnHeaderHeight ?? COLUMN_HEADER_HEIGHT),
    columnHeaderRenderers: signal(props.columnHeaderRenderers ?? {}),
    columnSpanScanDistance: signal(props.columnSpanScanDistance ?? COLUMN_SCAN_DISTANCE),

    columnMenuState: signal(props.columnMenuState ?? {}),
    contextMenuState: signal(props.contextMenuState ?? {}),

    filterFunctions: signal(props.filterFunctions ?? {}),
    filterModel: filterModelComputed(props.filterModel ?? [], api),

    floatingCellRenderers: signal(props.floatingCellRenderers ?? {}),
    floatingRowEnabled: signal(props.floatingRowEnabled ?? false),
    floatingRowHeight: signal(props.floatingRowHeight ?? COLUMN_HEADER_HEIGHT),

    gridId: signal(props.gridId),

    keyBindings: signal(props.keyBindings ?? {}),

    overlays: signal(props.overlays ?? {}),
    overlayToShow: signal(props.overlayToShow ?? null),

    paginate: signal(props.paginate ?? false),
    paginatePageSize: signal(props.paginatePageSize ?? PAGINATE_PAGE_SIZE),
    paginateCurrentPage: signal(props.paginateCurrentPage ?? 0),

    rowDataSource: signal(props.rowDataSource ?? emptyRowDataSource),

    rowDetailEnabled: signal(props.rowDetailEnabled ?? false),
    rowDetailExpansions: signal(props.rowDetailExpansions ?? new Set()),
    rowDetailHeight: signal(props.rowDetailHeight ?? ROW_DETAIL_HEIGHT),
    rowDetailMarker: signal(props.rowDetailMarker ?? true),
    rowDetailRenderer: signal(props.rowDetailRenderer ?? null),

    rowDragEnabled: signal(props.rowDragEnabled ?? false),
    rowDragExternalGrids: signal(props.rowDragExternalGrids ?? []),
    rowDragMultiRow: signal(props.rowDragMultiRow ?? false),
    rowDragPredicate: signal(props.rowDragPredicate ?? null),

    rowFullWidthPredicate: signal(props.rowFullWidthPredicate ?? null),
    rowFullWidthRenderer: signal(props.rowFullWidthRenderer ?? null),

    rowGroupColumnTemplate: signal(props.rowGroupColumnTemplate ?? null),
    rowGroupDefaultExpansion: signal(props.rowGroupDefaultExpansion ?? false),
    rowGroupExpansions: signal(props.rowGroupExpansions ?? {}),
    rowGroupDisplayMode: rowDisplayModeComputed(props.rowGroupDisplayMode ?? "single-column", api),
    rowGroupModel: rowGroupModelComputed(props.rowGroupModel ?? [], api),

    rowHeight: signal(props.rowHeight ?? ROW_HEIGHT),

    rowTotalsPinned: signal(props.rowTotalsPinned ?? false),
    rowTotalRow: signal(props.rowTotalRow ?? null),

    rowSelectionPredicate: signal(props.rowSelectionPredicate ?? "leaf-only"),
    rowSelectionCheckbox: signal(props.rowSelectionCheckbox ?? "normal"),
    rowSelectionMode: signal(props.rowSelectionMode ?? "none"),
    rowSelectionMultiSelectOnClick: signal(props.rowSelectionMultiSelectOnClick ?? false),
    rowSelectionPointerActivator: signal(props.rowSelectionPointerActivator ?? "none"),
    rowSelectionSelectChildren: signal(props.rowSelectionSelectChildren ?? true),
    rowSelectionSelectedIds: rowSelectionComputed(props.rowSelectionSelectedIds ?? new Set(), api),

    rowSpanScanDistance: signal(props.rowSpanScanDistance ?? COLUMN_SCAN_DISTANCE),

    rowUpdateStackEnabled: signal(props.rowUpdateStackEnabled ?? false),
    rowUpdateStackMaxSize: signal(props.rowUpdateStackMaxSize ?? ROW_UPDATE_STACK_SIZE),
    rowUseAbsolutePositioning: signal(props.rowUseAbsolutePositioning ?? false),

    rtl: signal(props.rtl ?? false),

    sortComparatorFuncs: signal(props.sortComparatorFuncs ?? {}),
    sortModel: sortModelComputed(props.sortModel ?? [], api),

    // Enterprise state
    cellSelections: cellSelectionComputed(props.cellSelections ?? [], api),
    cellSelectionMode: signal(props.cellSelectionMode ?? "none"),

    columnMenuRenderer: signal(props.columnMenuRenderer ?? null),

    contextMenuItems: signal(props.contextMenuItems ?? null),

    clipboardTransformCellValue: signal(props.clipboardTransformCellValue ?? null),
    clipboardTransformCopy: signal(props.clipboardTransformCopy ?? null),
    clipboardTransformHeader: signal(props.clipboardTransformHeader ?? null),
    clipboardTransformHeaderGroup: signal(props.clipboardTransformHeaderGroup ?? null),
    clipboardTransformPaste: signal(props.clipboardTransformPaste ?? null),

    columnPivotModeIsOn: signal(props.columnPivotModeIsOn ?? false),
    columnPivotModel: signal(props.columnPivotModel ?? []),

    filterQuickSearch: signal(props.filterQuickSearch ?? null),

    floatingFrames: signal(props.floatingFrames ?? {}),

    measureModel: measuresComputed([], api), // We post initialize this

    panelFrameButtons: signal(props.panelFrameButtons ?? []),
    panelFrames: signal(props.panelFrames ?? {}),

    treeData: signal(props.treeData ?? false),
  } satisfies InitialStateEnterprise<D, E>;

  Object.assign(state, s);
}
