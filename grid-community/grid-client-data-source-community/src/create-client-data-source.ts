import { BlockGraph } from "@1771technologies/grid-graph";
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
import { rowByIndex } from "./api/row-by-index";
import { rowById } from "./api/row-by-id";
import { rowGetMany } from "./api/row-get-many";
import { rowChildCount } from "./api/row-child-count";
import { rowDepth } from "./api/row-depth";
import { rowGroupToggle } from "./api/row-group-toggle";
import { rowParentIndex } from "./api/row-parent-index";
import { rowSetData } from "./api/row-set-data";
import { rowSetDataMany } from "./api/row-set-data-many";
import { paginateGetCount } from "./api/paginate-get-count";
import { paginateRowStartAndEndForPage } from "./api/paginate-row-stand-and-end-for-page";

export interface ClientState<D, E> {
  api: Signal<ApiCommunity<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;

  cache: Signal<Record<string, any>>;

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;
}

export function createClientDataSource<D, E>(
  r: RowDataSourceClient<D>,
): RowDataSourceBackingCommunity<D, E> {
  let watchers: (() => void)[] = [];

  const { store: state, dispose } = cascada(() => {
    const api$ = signal<ApiCommunity<D, E>>(null as unknown as ApiCommunity<D, E>);

    const cache = signal<Record<string, any>>({});

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

      rowTopNodes,
      rowCenterNodes,
      rowBottomNodes,
    } satisfies ClientState<D, E>;
  });

  return {
    init: (a) => {
      state.api.set(a);
    },
    clean: () => {
      watchers.forEach((c) => c());
      watchers = [];

      dispose();
    },

    rowByIndex: (r: number) => rowByIndex(state, r),
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

    rowSelectionSelectAll: () => {},
    rowSelectionAllRowsSelected: () => false,
    rowSelectionClear: () => {},
    rowSelectionDeselect: () => {},
    rowSelectionSelect: () => {},
    rowSelectionGetSelected: () => [],
    rowSelectionIsIndeterminate: () => false,
    rowSelectionIsSelected: () => false,

    rowBottomCount: () => state.graph.peek().rowBotCount(),
    rowTopCount: () => state.graph.peek().rowTopCount(),
    rowCount: () => state.graph.peek().rowCount(),

    paginateGetCount: () => paginateGetCount(state),
    paginateRowStartAndEndForPage: (i) => paginateRowStartAndEndForPage(state, i),
  } satisfies RowDataSourceBackingCommunity<D, E>;
}
