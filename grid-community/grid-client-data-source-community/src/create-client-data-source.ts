import { evaluateClientFilter } from "@1771technologies/grid-client-filter";
import { BlockGraph, type BlockPayload } from "@1771technologies/grid-graph";
import type { ApiCommunity, RowDataSourceBackingCommunity } from "@1771technologies/grid-types";
import type { RowDataSourceClient, RowNodeLeaf } from "@1771technologies/grid-types/community";
import { dataToRowNodes } from "./row-nodes";
import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/cascada";
import { filterNodesComputed } from "./utils/filter-nodes-computed";
import { sortedNodesComputed } from "./utils/sorted-nodes-computed";
import { BLOCK_SIZE, flatBlockPayloadsComputed } from "./utils/flat-block-payloads-computed";

export interface ClientState<D, E> {
  original: Signal<RowDataSourceClient<D>>;
  api: Signal<ApiCommunity<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;
}

export function createClientDataSource<D, E>(
  r: RowDataSourceClient<D>,
): RowDataSourceBackingCommunity<D, E> {
  let watchers: (() => void)[] = [];

  const state = cascada(() => {
    const api$ = signal<ApiCommunity<D, E>>(null as unknown as ApiCommunity<D, E>);
    const original = signal(r);

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
      original,

      graph,

      rowTopNodes,
      rowCenterNodes,
      rowBottomNodes,
    } satisfies ClientState<D, E>;
  });

  return {
    init: (a) => {
      state.store.api.set(a);
    },
    clean: () => {
      watchers.forEach((c) => c());
      watchers = [];

      state.dispose();
    },

    rowByIndex: (r: number) => {
      const graph = state.store.graph.peek();
      const api = state.store.api.peek();

      const row = graph.rowByIndex(r);

      if (!row) return row;

      if (api.rowIsGroup(row)) {
        // Compute aggregations here.
        return row;
      }
    },
    rowById: () => null,
    rowGetMany: () => [],

    rowChildCount: () => 0,
    rowDepth: () => 0,

    rowGroupToggle: () => {},
    rowParentIndex: () => null,

    rowSetData: () => {},
    rowSetDataMany: () => {},
    rowReplaceBottomData: () => {},
    rowReplaceData: () => {},
    rowReplaceTopData: () => {},

    rowSelectionSelectAll: () => {},
    rowSelectionAllRowsSelected: () => false,
    rowSelectionClear: () => {},
    rowSelectionDeselect: () => {},
    rowSelectionSelect: () => {},
    rowSelectionGetSelected: () => [],
    rowSelectionIsIndeterminate: () => false,
    rowSelectionIsSelected: () => false,

    rowBottomCount: () => 0,
    rowTopCount: () => 0,
    rowCount: () => 0,

    paginateGetCount: () => 0,
    paginateRowStartAndEndForPage: () => [0, 0],
  } satisfies RowDataSourceBackingCommunity<D, E>;
}
