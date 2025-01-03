import type { ApiEnterprise, RowDataSourceEnterprise } from "@1771technologies/grid-types";
import type { ColumnInFilterItemFetcher, ColumnPivotsFetcher, DataFetcher } from "./types";
import { cascada, signal } from "@1771technologies/cascada";
import { BlockGraph } from "../../../grid-community/grid-graph/src";

export interface ServerDataSourceInitial<D, E> {
  readonly rowDataFetcher: DataFetcher<D, E>;
  readonly rowBlockSize?: number;

  readonly rowClearGroupChildrenOnCollapse?: boolean;
  readonly rowClearOutOfViewBlocks?: boolean;
  readonly columnInFilterFetcher?: ColumnInFilterItemFetcher<D, E>;
  readonly columnPivotsFetcher?: ColumnPivotsFetcher<D, E>;
}

export function createServerDataSource<D, E>(
  init: ServerDataSourceInitial<D, E>,
): RowDataSourceEnterprise<D, E> {
  const { store: state, dispose } = cascada(() => {
    const api$ = signal(null as unknown as ApiEnterprise<D, E>);
    const rowDataFetcher = init.rowDataFetcher;
    const rowClearOutOfView = init.rowClearOutOfViewBlocks ?? false;
    const rowClearOnCollapse = init.rowClearGroupChildrenOnCollapse ?? false;

    const columnInFilterFetcher =
      init.columnInFilterFetcher ??
      (() => {
        throw new Error(
          "A `columnInFilterFetcher` function must be provided to support in filters when using the server data source.",
        );
      });

    const columnPivotsFetcher =
      init.columnPivotsFetcher ??
      (() => {
        throw new Error(
          "A `columnPivotsFetcher` function must be provided to support column pivots when using the server data source.",
        );
      });

    const graph = new BlockGraph(init.rowBlockSize ?? 100);

    return {
      api: api$,
      rowDataFetcher,
      graph,

      rowClearOutOfView,
      rowClearOnCollapse,

      columnInFilterFetcher,
      columnPivotsFetcher,
    };
  });
  return {
    init: (a) => {
      state.api.set(a);
    },
    clean: () => {
      dispose();
    },

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
