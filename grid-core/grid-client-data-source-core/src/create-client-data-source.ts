import { BlockGraph } from "@1771technologies/grid-graph";
import { dataToRowNodes } from "./row-nodes";
import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import { filterNodesComputed } from "./utils/filter-nodes-computed";
import { sortedNodesComputed } from "./utils/sorted-nodes-computed";
import { BLOCK_SIZE, flatBlockPayloadsComputed } from "./utils/flat-block-payloads-computed";
import { rowByIndex } from "./api/row-by-index";
import { rowById } from "./api/row-by-id";
import { rowGetMany } from "./api/row-get-many";
import { rowChildCount } from "./api/row-child-count";
import { rowDepth } from "./api/row-depth";
import { rowParentIndex } from "./api/row-parent-index";
import { rowSetData } from "./api/row-set-data";
import { rowSetDataMany } from "./api/row-set-data-many";
import { paginateGetCount } from "./api/paginate-get-count";
import { paginateRowStartAndEndForPage } from "./api/paginate-row-stand-and-end-for-page";
import { groupBlockPayloadsComputed } from "./utils/group-block-payloads-computed";
import type {
  ApiCore,
  RowDataSourceClient,
  RowDataSourceCore,
  RowNodeLeafCore,
} from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export interface ClientState<D, E> {
  api: Signal<ApiCore<D, E>> | Signal<ApiPro<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;

  cache: Signal<Record<string, any>>;

  rowTopNodes: Signal<RowNodeLeafCore<D>[]>;
  rowCenterNodes: Signal<RowNodeLeafCore<D>[]>;
  rowBottomNodes: Signal<RowNodeLeafCore<D>[]>;
}

export function createClientDataSource<D, E>(
  r: RowDataSourceClient<D, E>,
): RowDataSourceCore<D, E> {
  let watchers: (() => void)[] = [];

  const state = cascada(() => {
    const api$ = signal<ApiCore<D, E>>(null as unknown as ApiCore<D, E>);

    const cache = signal<Record<string, any>>({});

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const rowTopNodes = signal(initialTopNodes, { postUpdate: () => cache.set({}) });
    const rowCenterNodes = signal(initialCenterNodes, { postUpdate: () => cache.set({}) });
    const rowBottomNodes = signal(initialBottomNodes, { postUpdate: () => cache.set({}) });

    const filteredNodes = filterNodesComputed(
      api$,
      rowCenterNodes,
      r.filterToDate ?? (((c: number) => new Date(c)) as any),
    );
    const sortedNodes = sortedNodesComputed(
      api$,
      filteredNodes,
      r.sortToDate ?? (((c: number) => new Date(c)) as any),
    );

    const flatPayload = flatBlockPayloadsComputed(sortedNodes);
    const groupPayload = groupBlockPayloadsComputed(api$, sortedNodes);

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

      graph.setTop(rowTopNodes.get());
      graph.setBottom(rowBottomNodes.get());

      graph.blockFlatten();

      api.rowRefresh();

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

      const sx = a.getState();

      watchers.push(sx.columnBase.watch(() => state.cache.set({})));
      watchers.push(sx.columnsVisible.watch(() => state.cache.set({})));
    },
    clean: () => {
      watchers.forEach((c) => c());
      watchers = [];
    },

    rowByIndex: (r: number) => rowByIndex(state, r),
    rowById: (id) => rowById(state, id),
    rowGetMany: (start, end) => rowGetMany(state, start, end),
    rowIdToRowIndex: (id) => state.graph.peek().rowIdToRowIndex(id),

    rowChildCount: (r) => rowChildCount(state, r),
    rowDepth: (r) => rowDepth(state, r),
    rowParentIndex: (r) => rowParentIndex(state, r),

    rowSetData: (id, d) => rowSetData(state, id, d),
    rowSetDataMany: (updates) => rowSetDataMany(state, updates),
    rowReplaceBottomData: (d) => state.rowBottomNodes.set(dataToRowNodes(d, "bottom", "bottom")),
    rowReplaceData: (d) => state.rowCenterNodes.set(dataToRowNodes(d, null, "center")),
    rowReplaceTopData: (d) => state.rowTopNodes.set(dataToRowNodes(d, "top", "top")),

    rowGetAllChildrenIds: (rowByIndex) => {
      const children = state.graph
        .peek()
        .rowAllChildren(rowByIndex)
        .map((c) => c.id);

      return children;
    },
    rowGetAllIds: () => {
      const graph = state.graph.peek();
      const allRows = graph.rowGetAllRows();

      return allRows.map((c) => c.id);
    },
    rowSelectionIndeterminateSupported: () => true,
    rowSelectionSelectAllSupported: () => true,

    rowBottomCount: () => state.graph.peek().rowBotCount(),
    rowTopCount: () => state.graph.peek().rowTopCount(),
    rowCount: () => state.graph.peek().rowCount(),

    paginateGetCount: () => paginateGetCount(state),
    paginateRowStartAndEndForPage: (i) => paginateRowStartAndEndForPage(state, i),
  } satisfies RowDataSourceCore<D, E>;
}
