import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/cascada";
import type { ApiEnterprise, RowDataSourceEnterprise } from "@1771technologies/grid-types";
import { BlockGraph } from "@1771technologies/grid-graph";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";
import { filterNodesComputed } from "./utils/filterNodesComputed";
import { sortedNodesComputed } from "./utils/sorted-nodes-computed";
import {
  BLOCK_SIZE,
  dataToRowNodes,
  flatBlockPayloadsComputed,
  paginateGetCount,
  paginateRowStartAndEndForPage,
  rowById,
  rowByIndex,
  rowChildCount,
  rowDepth,
  rowGetMany,
  rowGroupToggle,
  rowParentIndex,
  rowSelection,
  rowSetData,
  rowSetDataMany,
} from "@1771technologies/grid-client-data-source-community";
import { columnInFilterItems } from "./api/column-in-filter-items";
import { createColumnPivots } from "./api/column-pivots/create-pivot-columns";

export interface ClientState<D, E> {
  api: Signal<ApiEnterprise<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;
  selectedIds: Signal<Set<string>>;

  cache: Signal<Record<string, any>>;

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;
}

export interface ClientDataSourceInitial<D> {
  readonly data: D[];
  readonly topData?: D[];
  readonly bottomData?: D[];
}

export function createClientDataSource<D, E>(
  r: ClientDataSourceInitial<D>,
): RowDataSourceEnterprise<D, E> {
  const { store: state, dispose } = cascada(() => {
    const api$ = signal<ApiEnterprise<D, E>>(null as unknown as ApiEnterprise<D, E>);

    const cache = signal<Record<string, any>>({});
    const selectedIds = signal<Set<string>>(new Set());

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const rowTopNodes = signal(initialTopNodes);
    const rowCenterNodes = signal(initialCenterNodes);
    const rowBottomNodes = signal(initialBottomNodes);

    const filteredNodes = filterNodesComputed(api$, rowCenterNodes);
    const sortedNodes = sortedNodesComputed(api$, filteredNodes);

    const flatPayload = flatBlockPayloadsComputed(sortedNodes);
    const groupPayload = flatBlockPayloadsComputed(sortedNodes);

    const graph$ = signal(new BlockGraph<D>(BLOCK_SIZE));

    const graph = computed(() => {
      const graph = graph$.get();
      const api = api$.get();
      const sx = api.getState();

      const rowModel = sx.rowGroupModel.get();

      graph.blockReset();

      const p = rowModel.length > 0 ? groupPayload.get() : flatPayload.get();

      for (const z of p.sizes) graph.blockSetSize(z.path, z.size);
      graph.blockAdd(p.payloads);

      const totals = sx.rowTotalRow.get();
      graph.setTotalPosition(totals);
      const pinTotals = sx.rowTotalsPinned.get();
      graph.setTotalPin(pinTotals);

      graph.setTop(rowTopNodes.get());
      graph.setBottom(rowBottomNodes.get());

      graph.blockFlatten();

      return graph;
    });

    return {
      api: api$,

      graph,
      cache,
      selectedIds,

      rowTopNodes,
      rowBottomNodes,
      rowCenterNodes,
    } satisfies ClientState<D, E>;
  });

  let watchers: (() => void)[] = [];

  const selected = rowSelection(state);
  return {
    init: (a) => {
      state.api.set(a);

      const sx = a.getState();

      watchers.push(sx.columnBase.watch(() => state.cache.set({})));
      watchers.push(sx.columnsVisible.watch(() => state.cache.set({})));

      const reloadPivots = () => {
        if (!sx.columnPivotModeIsOn.peek()) return;
        a.columnPivotsReload();
      };

      watchers.push(sx.rowDataSource.watch(reloadPivots, false));
      watchers.push(sx.columnPivotModel.watch(reloadPivots, false));
      watchers.push(sx.measureModel.watch(reloadPivots, false));
      watchers.push(sx.columnPivotModeIsOn.watch(reloadPivots, false));
    },
    clean: () => {
      watchers.forEach((c) => c());
      watchers = [];

      dispose();
    },

    rowByIndex: (r) => rowByIndex(state, r),
    rowById: (id) => rowById(state, id),
    rowGetMany: (start, end) => rowGetMany(state, start, end),

    rowChildCount: (r) => rowChildCount(state, r),
    rowDepth: (r) => rowDepth(state, r),
    rowParentIndex: (r) => rowParentIndex(state, r),

    rowGroupToggle: (id, s) => rowGroupToggle(state, id, s),

    rowSetData: (id, d) => rowSetData(state, id, d),
    rowSetDataMany: (updates) => rowSetDataMany(state, updates),
    rowReplaceBottomData: (d) => state.rowBottomNodes.set(dataToRowNodes(d, "bottom", "bottom")),
    rowReplaceData: (d) => state.rowCenterNodes.set(dataToRowNodes(d, null, "center")),
    rowReplaceTopData: (d) => state.rowTopNodes.set(dataToRowNodes(d, "top", "top")),

    rowSelectionAllRowsSelected: selected.rowSelectionAllRowsSelected,
    rowSelectionClear: selected.rowSelectionClear,
    rowSelectionDeselect: selected.rowSelectionDeselect,
    rowSelectionGetSelected: selected.rowSelectionGetSelected,
    rowSelectionIsIndeterminate: selected.rowSelectionIsIndeterminate,
    rowSelectionIsSelected: selected.rowSelectionIsSelected,
    rowSelectionSelect: selected.rowSelectionSelect,
    rowSelectionSelectAll: selected.rowSelectionSelectAll,

    columnInFilterItems: (c) => columnInFilterItems(state, c),
    columnPivotGetDefinitions: () => {
      const columns = createColumnPivots(state.api.peek(), state.rowCenterNodes.peek());
      return columns;
    },

    rowBottomCount: () => state.graph.peek().rowBotCount(),
    rowTopCount: () => state.graph.peek().rowTopCount(),
    rowCount: () => state.graph.peek().rowCount(),

    paginateGetCount: () => paginateGetCount(state),
    paginateRowStartAndEndForPage: (i) => paginateRowStartAndEndForPage(state, i),

    // Not relevant for client data source.
    rowReload: () => {},
    rowRetryExpansion: () => {},
    rowRetryFailed: () => {},
  };
}
