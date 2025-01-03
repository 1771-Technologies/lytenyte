import type { ApiEnterprise, RowDataSourceEnterprise } from "@1771technologies/grid-types";
import type { ColumnInFilterItemFetcher, ColumnPivotsFetcher, DataFetcher } from "./types";
import { cascada, signal, type Signal } from "@1771technologies/cascada";
import type { RowNode } from "@1771technologies/grid-types/community";
import { BlockGraph } from "@1771technologies/grid-graph";
import { ROW_DEFAULT_PATH_SEPARATOR } from "@1771technologies/grid-constants";

export interface ServerDataSourceInitial<D, E> {
  readonly rowDataFetcher: DataFetcher<D, E>;
  readonly rowBlockSize?: number;
  readonly rowPathSeparator?: string;

  readonly rowClearGroupChildrenOnCollapse?: boolean;
  readonly rowClearOutOfViewBlocks?: boolean;
  readonly columnInFilterFetcher?: ColumnInFilterItemFetcher<D, E>;
  readonly columnPivotsFetcher?: ColumnPivotsFetcher<D, E>;
}

export interface ServerState<D, E> {
  readonly rowDataFetcher: DataFetcher<D, E>;
  readonly rowClearOutOfView: boolean;
  readonly rowClearOnCollapse: boolean;
  readonly rowPathSeparator: string;
  readonly columnInFilterFetcher: ColumnInFilterItemFetcher<D, E>;
  readonly columnPivotsFetcher: ColumnPivotsFetcher<D, E>;
  readonly blockSize: number;
  readonly controller: Signal<AbortController>;

  readonly rowGroupExpansions: Map<string, boolean>;

  readonly blockLoadTimeLookup: Signal<Map<string, number>>;

  readonly selectedIds: Signal<Set<string>>;

  readonly api: Signal<ApiEnterprise<D, E>>;
  readonly graph: BlockGraph<D>;
  readonly errorCache: Signal<string[]>;
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

    const blockSize = init.rowBlockSize ?? 100;
    const separator = init.rowPathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
    const graph = new BlockGraph<D>(blockSize, separator);

    const errorCache = signal<string[]>([]);

    const selectedIds = signal(new Set<string>());

    const controller = signal(new AbortController());
    const blockLoadTimeLookup = signal(new Map<string, number>());

    return {
      api: api$,
      rowDataFetcher,
      graph,
      blockSize,
      controller,

      errorCache,

      selectedIds,
      blockLoadTimeLookup,

      rowClearOutOfView,
      rowClearOnCollapse,
      rowPathSeparator: separator,
      rowGroupExpansions: new Map(),

      columnInFilterFetcher,
      columnPivotsFetcher,
    } satisfies ServerState<D, E>;
  });
  const source: RowDataSourceEnterprise<D, E> = {
    init: (a) => {
      state.api.set(a);
    },
    clean: () => {
      dispose();
    },

    rowById: (id) => state.graph.rowById(id),
    rowByIndex: (r) => state.graph.rowByIndex(r),
    rowGetMany: (s, e) => {
      const rows: RowNode<D>[] = [];

      for (let i = s; i < e; i++) {
        const row = state.graph.rowByIndex(i);
        if (row) rows.push(row);
      }

      return rows;
    },

    rowChildCount: (r) => state.graph.rowChildCount(r),
    rowDepth: (r) => Math.max(state.graph.rowRangesForIndex(r).length - 1, 0),
    rowParentIndex: (r) => {
      const range = state.graph.rowRangesForIndex(r).at(-1);
      if (!range) return null;

      const parentIndex = range.rowStart - 1;
      return parentIndex === -1 ? null : parentIndex;
    },

    rowGroupToggle: (id, toggleState) => {
      const api = state.api.peek();
      const row = state.graph.rowById(id);
      if (!row || !api.rowIsGroup(row)) return;

      const next = toggleState != null ? toggleState : !row.expanded;
      if (next === row.expanded) return;

      (row as { expanded: boolean }).expanded = next;

      state.graph.blockFlatten();
      api.rowRefresh();
    },

    rowSelectionAllRowsSelected: () => false,
    rowSelectionSelectAllSupported: () => false,
    rowSelectionClear: () => {
      state.selectedIds.set(new Set());
      state.api.peek().rowRefresh();
    },
    rowSelectionDeselect: (ids) => {
      const selectedIds = state.selectedIds.peek();
      for (let i = 0; i < ids.length; i++) selectedIds.delete(ids[i]);

      state.api.peek().rowRefresh();
    },
    rowSelectionGetSelected: () => {
      const selected = state.selectedIds.peek();
      return [...selected];
    },
    rowSelectionIsIndeterminate: () => false,
    rowSelectionIsSelected: (id) => {
      return state.selectedIds.peek().has(id);
    },
    rowSelectionSelect: (ids: string[]) => {
      const selectedIds = state.selectedIds.peek();
      for (let i = 0; i < ids.length; i++) selectedIds.add(ids[i]);

      state.api.peek().rowRefresh();
    },
    rowSelectionSelectAll: () => {},

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

  return source;
}
