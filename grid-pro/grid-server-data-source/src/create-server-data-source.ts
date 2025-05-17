import type {
  AsyncDataRequestBlock,
  ColumnInFilterItemFetcher,
  ColumnPivotsFetcher,
  DataFetcher,
} from "./types";
import { cascada, signal, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import { BlockGraph } from "@1771technologies/grid-graph";
import { ROW_DEFAULT_PATH_SEPARATOR } from "@1771technologies/grid-constants";
import { currentViewComputed } from "./utils/current-view-computed";
import { handleViewChange } from "./utils/handle-view-change";
import { loadRowExpansion } from "./utils/load-row-expansion";
import { getAsyncDataRequestBlocks } from "./utils/get-async-data-request-blocks";
import { loadBlockData } from "./utils/load-block-data";
import { loadInitialData } from "./utils/load-initial";
import type {
  ApiPro,
  RowDataSourcePro,
  RowNodeLeafPro,
  RowNodePro,
} from "@1771technologies/grid-types/pro";
import { loadRowGroups } from "./utils/load-row-groups";

export interface ServerDataSourceInitial<D, E> {
  readonly rowDataFetcher: DataFetcher<D, E>;
  readonly rowBlockSize?: number;
  readonly rowPathSeparator?: string;

  readonly columnInFilterFetcher?: ColumnInFilterItemFetcher<D, E>;
  readonly columnPivotsFetcher?: ColumnPivotsFetcher<D, E>;
}

export interface ServerState<D, E> {
  readonly rowDataFetcher: DataFetcher<D, E>;
  readonly rowPathSeparator: string;
  readonly rowGroupExpansions: Map<string, boolean>;

  readonly columnInFilterFetcher: ColumnInFilterItemFetcher<D, E>;
  readonly columnPivotsFetcher: ColumnPivotsFetcher<D, E>;

  readonly blockSize: number;
  readonly blockLoadTimeLookup: Signal<Map<string, number>>;

  readonly controller: Signal<AbortController>;
  readonly selectedIds: Signal<Set<string>>;

  readonly api: Signal<ApiPro<D, E>>;
  readonly graph: BlockGraph<D>;

  readonly currentView: ReadonlySignal<AsyncDataRequestBlock[]>;
  readonly previousView: Signal<AsyncDataRequestBlock[]>;

  requestedBlocks: Set<string>;
  requestedRows: Set<number>;
  requestedFails: Set<number>;
}

const baseLoadingRow: RowNodeLeafPro<any> = {
  data: null,
  id: `##REVERSED##__LYTENYTE__LOADING_ROW`,
  kind: 1,
  rowIndex: null,
  rowPin: null,
  loading: true,
};
const baseErrorRow: RowNodeLeafPro<any> = {
  data: null,
  id: `##REVERSED##__LYTENYTE__ERROR_ROW`,
  kind: 1,
  rowIndex: null,
  rowPin: null,
  loading: false,
  error: true,
};

export function createServerDataSource<D, E>(
  init: ServerDataSourceInitial<D, E>,
): RowDataSourcePro<D, E> {
  const state = cascada(() => {
    const api$ = signal(null as unknown as ApiPro<D, E>);
    const rowDataFetcher = init.rowDataFetcher;

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

    const blockSize = init.rowBlockSize ?? 100;
    const separator = init.rowPathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
    const graph = new BlockGraph<D>(blockSize, separator);

    const selectedIds = signal(new Set<string>());

    const controller = signal(new AbortController());
    const blockLoadTimeLookup = signal(new Map<string, number>());

    const currentView = currentViewComputed(api$, graph, blockSize, separator);
    const previousView = signal<AsyncDataRequestBlock[]>([]);

    return {
      api: api$,
      rowDataFetcher,
      graph,
      blockSize,
      controller,

      selectedIds,
      blockLoadTimeLookup,
      currentView,
      previousView,
      requestedBlocks: new Set(),
      requestedRows: new Set(),
      requestedFails: new Set(),

      rowPathSeparator: separator,
      rowGroupExpansions: new Map(),

      columnInFilterFetcher,
      columnPivotsFetcher,
    } satisfies ServerState<D, E>;
  });

  const watchers: (() => void)[] = [];

  const reset = () => {
    state.graph.blockReset();
    state.graph.blockFlatten();
    state.blockLoadTimeLookup.set(new Map());

    state.controller.peek().abort();
    state.controller.set(new AbortController());

    state.previousView.set([]);
    state.requestedBlocks = new Set();
    state.requestedRows = new Set();
    state.requestedFails = new Set();

    loadInitialData(state);
  };
  const pivotReset = () => {
    if (!state.api.peek().getState().columnPivotModeIsOn.peek()) return;
    reset();
  };

  const source: RowDataSourcePro<D, E> = {
    init: (a) => {
      state.api.set(a);

      reset();

      watchers.push(
        state.currentView.watch(() => {
          setTimeout(() => {
            handleViewChange(state);
          });
        }),
      );

      const sx = a.getState();

      watchers.push(sx.filterQuickSearch.watch(reset));
      watchers.push(sx.rowGroupModel.watch(reset));
      watchers.push(sx.columnPivotModeIsOn.watch(reset));
      watchers.push(sx.sortModel.watch(reset));
      watchers.push(sx.filterModel.watch(reset));

      watchers.push(sx.internal.columnPivotSortModel.watch(pivotReset));
      watchers.push(sx.internal.columnPivotFilterModel.watch(pivotReset));
      watchers.push(sx.columnPivotModel.watch(pivotReset));
      watchers.push(sx.measureModel.watch(pivotReset));

      watchers.push(
        sx.rowGroupExpansions.watch(() => {
          loadRowGroups(state);
        }),
      );
    },
    clean: () => {
      while (watchers.length) watchers.pop()!();
    },

    rowById: (id) => {
      const rowIndex = state.graph.rowIdToRowIndex(id);
      if (rowIndex == null) return null;

      if (state.requestedFails.has(rowIndex)) return baseErrorRow;

      return state.graph.rowById(id) ?? baseLoadingRow;
    },
    rowByIndex: (r) => {
      const row = state.graph.rowByIndex(r);

      if (state.requestedFails.has(r)) return baseErrorRow;

      if (row) {
        (row as any).rowIndex = r;
      }

      return row ?? baseLoadingRow;
    },
    rowIdToRowIndex: (id) => state.graph.rowIdToRowIndex(id),
    rowGetMany: (s, e) => {
      const rows: RowNodePro<D>[] = [];

      for (let i = s; i < e; i++) {
        const row = state.graph.rowByIndex(i);
        if (row) rows.push(row);
      }

      return rows;
    },

    rowDepth: (r) => {
      return Math.max(state.graph.rowRangesForIndex(r).length - 1, 0);
    },

    rowSelectionSelectAllSupported: () => false,
    rowSelectionIndeterminateSupported: () => false,

    rowGetAllChildrenIds: (r) => state.graph.rowAllChildren(r).map((c) => c.id),
    rowGetAllIds: () => state.graph.rowGetAllRows().map((c) => c.id),

    columnInFilterItems: (column) => state.columnInFilterFetcher({ api: state.api.peek(), column }),
    columnPivots: () => state.columnPivotsFetcher({ api: state.api.peek() }),

    rowBottomCount: () => state.graph.rowBotCount(),
    rowCount: () => state.graph.rowCount(),
    rowTopCount: () => state.graph.rowTopCount(),

    paginateGetCount: () => {
      const pageSize = state.api.peek().getState().paginatePageSize.peek();
      const graph = state.graph;

      const flatCount = graph.rowCount() - graph.rowTopCount() - graph.rowBotCount();

      const pageCount = Math.ceil(flatCount / pageSize);
      return pageCount;
    },
    paginateRowStartAndEndForPage: (page) => {
      const pageCount = source.paginateGetCount!();

      if (page > pageCount) {
        throw new Error(`There are only ${pageCount} pages, but page ${page} was requested`);
      }

      const graph = state.graph;
      const topCount = graph.rowTopCount();
      const bottomCount = graph.rowBotCount();
      const rowCount = graph.rowCount();

      const api = state.api.peek();
      const sx = api.getState();

      const pageOffset = sx.paginatePageSize.peek();

      const startIndex = page * pageOffset + topCount;
      const endIndex = Math.min(startIndex + pageOffset, rowCount - bottomCount);

      return [startIndex, endIndex];
    },

    rowReset: () => {
      state.selectedIds.set(new Set());
      state.rowGroupExpansions.clear();
      reset();
    },

    rowReload: (r?: number) => {
      if (r === undefined) {
        state.previousView.set([]);
        state.requestedFails = new Set();
        handleViewChange(state);
        state.api.peek().rowRefresh();
        return;
      }

      const blocks = getAsyncDataRequestBlocks(
        state.graph,
        r,
        state.blockSize,
        state.rowPathSeparator,
      );

      const rowsBeingRequest = new Set<number>();
      blocks.forEach((b) => {
        for (let i = b.rowStart; i < b.rowEnd; i++) rowsBeingRequest.add(i);
      });

      loadBlockData(state, blocks, {
        onFailure: () => {
          rowsBeingRequest.forEach((c) => state.requestedFails.add(c));
          state.api.peek().rowRefresh();
        },
        onSuccess: () => {
          state.graph.blockFlatten();
          state.api.peek().rowRefresh();
        },
      });
    },
    rowReloadExpansion: (row) => {
      loadRowExpansion(state, row, {});
    },

    // Server data source is read only
    rowSetData: () => {},
    rowSetDataMany: () => {},
    rowReplaceBottomData: () => {},
    rowReplaceTopData: () => {},
    rowReplaceData: () => {},
  };

  return source;
}
