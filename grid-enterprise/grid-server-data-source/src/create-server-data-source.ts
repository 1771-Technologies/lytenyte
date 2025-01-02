import type { RowDataSourceEnterprise } from "@1771technologies/grid-types";
import type { ColumnInFilterItemFetcher, ColumnPivotsFetcher, DataFetcher } from "./types";

export interface ServerDataSourceInitial<D, E> {
  readonly rowDataFetcher: DataFetcher<D, E>;
  readonly rowBlockSize?: number;

  readonly rowClearGroupChildrenOnCollapse?: boolean;
  readonly rowClearOutOfViewBlocks?: boolean;
  readonly columnInFilterFetcher?: ColumnInFilterItemFetcher<D, E>;
  readonly columnPivotsFetcher?: ColumnPivotsFetcher<D, E>;
}

export function createServerDataSource<D, E>(
  _: ServerDataSourceInitial<D, E>,
): RowDataSourceEnterprise<D, E> {
  return {
    init: () => {},
    clean: () => {},

    rowById: () => null,
    rowByIndex: () => null,
    rowGetMany: () => [],

    rowChildCount: () => 0,
    rowDepth: () => 0,
    rowParentIndex: () => null,

    rowGroupToggle: () => {},

    rowSelectionAllRowsSelected: () => false,
    rowSelectionClear: () => {},
    rowSelectionDeselect: () => {},
    rowSelectionGetSelected: () => [],
    rowSelectionIsIndeterminate: () => false,
    rowSelectionIsSelected: () => false,
    rowSelectionSelect: () => {},
    rowSelectionSelectAll: () => {},

    columnInFilterItems: () => [],
    columnPivots: () => [],

    rowBottomCount: () => 0,
    rowCount: () => 0,
    rowTopCount: () => 0,

    paginateGetCount: () => 0,
    paginateRowStartAndEndForPage: () => [0, 0],

    rowReload: () => {},
    rowRetryExpansion: () => {},
    rowRetryFailed: () => {},

    // Server data source is read only
    rowSetData: () => {},
    rowSetDataMany: () => {},
    rowReplaceBottomData: () => {},
    rowReplaceTopData: () => {},
    rowReplaceData: () => {},
  };
}
