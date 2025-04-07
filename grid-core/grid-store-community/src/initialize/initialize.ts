import { signal } from "@1771technologies/react-cascada";
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
import type {
  ApiCore,
  InitialStateCore,
  RowDataSourceClient,
  StateCore,
  StateInitCore,
} from "@1771technologies/grid-types/core";

const rowDataSource: RowDataSourceClient<any, any> = {
  kind: "client",
  data: [],
};

export function initialize<D, E>(
  props: StateInitCore<D, E>,
  state: StateCore<D, E>,
  api: ApiCore<D, E>,
) {
  Object.assign(state, {
    aggFns: signal(props.aggFns ?? {}),
    aggModel: signal(props.aggModel ?? {}, { postUpdate: () => queueMicrotask(api.rowRefresh) }),

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

    filterModel: filterModelComputed(props.filterModel ?? {}, api) as any,

    floatingCellRenderers: signal(props.floatingCellRenderers ?? {}),
    floatingRowEnabled: signal(props.floatingRowEnabled ?? false),
    floatingRowHeight: signal(props.floatingRowHeight ?? COLUMN_HEADER_HEIGHT),

    gridId: signal(props.gridId ?? ""),

    paginate: signal(props.paginate ?? false),
    paginatePageSize: signal(props.paginatePageSize ?? PAGINATE_PAGE_SIZE),
    paginateCurrentPage: signal(props.paginateCurrentPage ?? 0),

    rowDataSource: signal(props.rowDataSource ?? rowDataSource),

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
    rowGroupDisplayMode: rowDisplayModeComputed(props.rowGroupDisplayMode ?? "single-column", api),
    rowGroupModel: rowGroupModelComputed(props.rowGroupModel ?? [], api),
    rowGroupExpansions: signal(props.rowGroupExpansions ?? {}),

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

    sortComparatorFns: signal(props.sortComparatorFns ?? {}),
    sortModel: sortModelComputed(props.sortModel ?? [], api),
  } satisfies InitialStateCore<D, E>);
}
