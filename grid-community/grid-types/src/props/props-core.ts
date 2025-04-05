import type {
  AggFns,
  CellEditPointerActivator,
  CellEditProviders,
  CellRenderers,
  ColumnHeaderHeightProperty,
  ColumnHeaderRenderers,
  FloatingCellRenderers,
  KeyBindingMap,
  RowDataSourceClient,
  RowDetailHeight,
  rowDetailEnabled,
  RowDetailRenderer,
  RowDragPredicate,
  RowFullWidthPredicate,
  RowFullWidthRenderer,
  RowGroupDisplayMode,
  RowGroupExpansions,
  RowHeight,
  RowPin,
  RowSelectionCheckbox,
  RowSelectionMode,
  RowSelectionPointerActivator,
  RowSelectionPredicate,
  SortComparatorFn,
  SortModelItem,
  ColumnFilterModel,
  AggModel,
} from "../types";

export interface PropsCommunity<A, D, C, E, Base, Group> {
  readonly aggFns?: AggFns<A>;
  readonly aggModel?: AggModel<A>;

  readonly autosizeDoubleClickHeader?: boolean;

  readonly cellEditPointerActivator?: CellEditPointerActivator;
  readonly cellEditProviders?: CellEditProviders<A, D, C, E>;

  readonly cellRenderers?: CellRenderers<A, D, C, E>;

  readonly columnHeaderHeight?: ColumnHeaderHeightProperty;
  readonly columnHeaderRenderers?: ColumnHeaderRenderers<A, C, E>;
  readonly columnGroupHeaderHeight?: ColumnHeaderHeightProperty;
  readonly columnGroupStickyHeaders?: boolean;

  readonly columnGroupIdDelimiter?: string;
  readonly columnGroupExpansionState?: Record<string, boolean>;
  readonly columnGroupDefaultExpansion?: (group: string) => boolean;

  readonly columnSpanScanDistance?: number;

  readonly columns?: C[];
  readonly columnBase?: Base;

  readonly filterModel?: ColumnFilterModel<A, D>;

  readonly floatingRowEnabled?: boolean;
  readonly floatingRowHeight?: ColumnHeaderHeightProperty;
  readonly floatingCellRenderers?: FloatingCellRenderers<A, C, E>;

  readonly gridId: string;

  readonly keyBindings?: KeyBindingMap<A>;

  readonly rowDataSource?: RowDataSourceClient<D, E>;
  readonly rowUpdateStackMaxSize?: number;
  readonly rowUpdateStackEnabled?: boolean;

  readonly rowDetailMarker?: boolean;
  readonly rowDetailRenderer?: RowDetailRenderer<A, D, E> | null;
  readonly rowDetailEnabled?: rowDetailEnabled<A, D>;
  readonly rowDetailHeight?: RowDetailHeight<A, D>;
  readonly rowDetailExpansions?: Set<string>;

  readonly rowDragEnabled?: boolean;
  readonly rowDragMultiRow?: boolean;
  readonly rowDragExternalGrids?: A[];
  readonly rowDragPredicate?: RowDragPredicate<A, D> | null;

  readonly rowGroupColumnTemplate?: null | Group;
  readonly rowGroupModel?: string[];
  readonly rowGroupDisplayMode?: RowGroupDisplayMode;
  readonly rowGroupDefaultExpansion?: boolean | number;
  readonly rowGroupExpansions?: RowGroupExpansions;

  readonly paginate?: boolean;
  readonly paginatePageSize?: number;
  readonly paginateCurrentPage?: number;

  readonly rowHeight?: RowHeight;

  readonly rowSelectionCheckbox?: RowSelectionCheckbox;
  readonly rowSelectionPointerActivator?: RowSelectionPointerActivator;
  readonly rowSelectionMode?: RowSelectionMode;
  readonly rowSelectionSelectedIds?: Set<string>;
  readonly rowSelectionPredicate?: "all" | "group-only" | "leaf-only" | RowSelectionPredicate<A, D>;
  readonly rowSelectionSelectChildren?: boolean;
  readonly rowSelectionMultiSelectOnClick?: boolean;

  readonly rowSpanScanDistance?: number;

  readonly rowTotalRow?: RowPin;
  readonly rowTotalsPinned?: boolean;
  readonly rowFullWidthPredicate?: null | RowFullWidthPredicate<A, D>;
  readonly rowFullWidthRenderer?: null | RowFullWidthRenderer<A, D, E>;
  readonly rowUseAbsolutePositioning?: boolean;

  readonly rtl?: boolean;

  readonly sortModel?: SortModelItem[];
  readonly sortComparatorFns?: Record<string, SortComparatorFn<A, D>>;
}
