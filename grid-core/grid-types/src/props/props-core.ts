import type { RowDataSourceClient } from "../row-data-source/rds-core";
import type { AggFns, AggModel } from "../types/aggregations";
import type { CellEditPointerActivator, CellEditProviders } from "../types/cell-edit";
import type { CellRenderers } from "../types/cell-renderer";
import type {
  ColumnGroupHeaderRenderer,
  ColumnHeaderHeightProperty,
  ColumnHeaderRenderers,
} from "../types/column-header";
import type { ColumnFilterModel } from "../types/filters";
import type { FloatingCellRenderers } from "../types/floating-cell";
import type { RowDetailEnabled, RowDetailHeight, RowDetailRenderer } from "../types/row-detail";
import type { RowDragPredicate } from "../types/row-drag";
import type { RowFullWidthPredicate, RowFullWidthRenderer } from "../types/row-full-width";
import type { RowGroupDisplayMode, RowGroupExpansions } from "../types/row-group";
import type { RowHeight } from "../types/row-height";
import type {
  RowSelectionCheckbox,
  RowSelectionMode,
  RowSelectionPointerActivator,
  RowSelectionPredicate,
} from "../types/row-selection";
import type { SortComparatorFn, SortModelItem } from "../types/sort";

export interface PropsCoreRaw<A, D, C, E, Base, Group> {
  readonly aggFns?: AggFns<A>;
  readonly aggModel?: AggModel<A>;

  readonly autosizeDoubleClickHeader?: boolean;

  readonly cellEditPointerActivator?: CellEditPointerActivator;
  readonly cellEditProviders?: CellEditProviders<A, D, C, E>;

  readonly cellRenderers?: CellRenderers<A, D, C, E>;

  readonly columnHeaderHeight?: ColumnHeaderHeightProperty;
  readonly columnHeaderRenderers?: ColumnHeaderRenderers<A, C, E>;
  readonly columnGroupHeaderHeight?: ColumnHeaderHeightProperty;
  readonly columnGroupHeaderRenderer?: ColumnGroupHeaderRenderer<A, E> | null;
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

  readonly rowDataSource?: RowDataSourceClient<D, E>;
  readonly rowUpdateStackMaxSize?: number;
  readonly rowUpdateStackEnabled?: boolean;

  readonly rowDetailMarker?: boolean;
  readonly rowDetailRenderer?: RowDetailRenderer<A, D, E> | null;
  readonly rowDetailEnabled?: RowDetailEnabled<A, D>;
  readonly rowDetailHeight?: RowDetailHeight<A, D>;
  readonly rowDetailExpansions?: Set<string>;

  readonly rowDragEnabled?: boolean;
  readonly rowDragMultiRow?: boolean;
  readonly rowDragExternalGrids?: A[];
  readonly rowDragPredicate?: RowDragPredicate<A, D> | null;

  readonly rowGroupAutoApplyAggDefaults?: boolean;
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

  readonly rowFullWidthPredicate?: null | RowFullWidthPredicate<A, D>;
  readonly rowFullWidthRenderer?: null | RowFullWidthRenderer<A, D, E>;

  readonly rtl?: boolean;

  readonly sortModel?: SortModelItem[];
  readonly sortComparatorFns?: Record<string, SortComparatorFn<A, D>>;
}
