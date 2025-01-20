import type {
  AggFuncs,
  CellEditPointerActivator,
  CellEditProviders,
  CellRenderers,
  ColumnFilter,
  ColumnHeaderHeightProperty,
  ColumnHeaderRenderers,
  FilterRegisteredFuncs,
  FloatingCellRenderers,
  KeyBindingMap,
  OverlayId,
  Overlays,
  RowDataSourceClient,
  RowDetailHeight,
  RowDetailPredicate,
  RowDetailRenderer,
  RowDragActivator,
  RowDragPredicate,
  RowFullWidthPredicate,
  RowFullWidthRenderer,
  RowGroupDisplayMode,
  RowGroupFullWidthRenderer,
  RowHeight,
  RowPin,
  RowSelectionCheckbox,
  RowSelectionMode,
  RowSelectionPointerActivator,
  RowSelectionPredicate,
  SortComparatorFunc,
  SortModelItem,
  SortPostFunc,
} from "../types";

export interface PropsCommunity<A, D, C, E, Base, Group> {
  readonly aggFuncs?: AggFuncs<A>;

  readonly autosizeDoubleClickHeader?: boolean;

  readonly cellEditFullRow?: boolean;
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

  readonly filterModel?: ColumnFilter<A, D>[];
  readonly filterFunctions?: FilterRegisteredFuncs<A, D>;

  readonly floatingRowEnabled?: boolean;
  readonly floatingRowHeight?: ColumnHeaderHeightProperty;
  readonly floatingCellRenderers?: FloatingCellRenderers<A, C, E>;

  readonly gridId: string;

  readonly keyBindings?: KeyBindingMap<A>;

  readonly overlayToShow?: OverlayId | null;
  readonly overlays?: Overlays<A, E>;

  readonly rowDataSource?: RowDataSourceClient<D>;
  readonly rowUpdateStackMaxSize?: number;
  readonly rowUpdateStackEnabled?: boolean;

  readonly rowDetailMarker?: boolean;
  readonly rowDetailRenderer?: RowDetailRenderer<A, D, E> | null;
  readonly rowDetailPredicate?: RowDetailPredicate<A, D>;
  readonly rowDetailHeight?: RowDetailHeight<A, D>;
  readonly rowDetailExpansions?: Set<string>;

  readonly rowDragEnabled?: boolean;
  readonly rowDragActivator?: RowDragActivator;
  readonly rowDragMultiRow?: boolean;
  readonly rowDragExternalGrids?: A[];
  readonly rowDragPredicate?: RowDragPredicate<A, D> | null;

  readonly rowGroupColumnTemplate?: null | Group;
  readonly rowGroupModel?: string[];
  readonly rowGroupDisplayMode?: RowGroupDisplayMode;
  readonly rowGroupDefaultExpansion?: boolean | number;
  readonly rowGroupExpansions?: { [level: number]: { [rowId: string]: boolean } };
  readonly rowGroupFullWidthRowRenderer?: null | RowGroupFullWidthRenderer<A, E>;

  readonly paginate?: boolean;
  readonly paginatePageSize?: number;
  readonly paginateCurrentPage?: number;

  readonly rowHeight?: RowHeight;

  readonly rowSelectionCheckbox?: RowSelectionCheckbox;
  readonly rowSelectionPointerActivator?: RowSelectionPointerActivator;
  readonly rowSelectionMode?: RowSelectionMode;
  readonly rowSelectionAllowDeselect?: boolean;

  readonly rowSelectionPredicate?: RowSelectionPredicate<A, D> | null;
  readonly rowSelectionGroupRowsAllowed?: boolean;
  readonly rowSelectionTotalsRowAllowed?: boolean;
  readonly rowSelectionLeafRowsAllowed?: boolean;

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
  readonly sortMultiColumnEnabled?: boolean;
  readonly sortPostFunc?: null | SortPostFunc<A>;
  readonly sortComparatorFuncs?: Record<string, SortComparatorFunc<A, D>>;
}
