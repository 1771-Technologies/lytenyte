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
} from "@1771technologies/grid-client-data-source-community";

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

  return {
    init: () => {},
    clean: () => {},

    rowByIndex: () => null,
    rowById: () => null,
    rowGetMany: () => [],

    rowChildCount: () => 0,
    rowDepth: () => 0,
    rowParentIndex: () => null,

    rowGroupToggle: () => {},

    rowSetData: () => {},
    rowSetDataMany: () => {},
    rowReplaceTopData: () => {},
    rowReplaceData: () => {},
    rowReplaceBottomData: () => {},

    rowSelectionAllRowsSelected: () => false,
    rowSelectionClear: () => {},
    rowSelectionDeselect: () => {},
    rowSelectionGetSelected: () => [],
    rowSelectionIsIndeterminate: () => false,
    rowSelectionIsSelected: () => false,
    rowSelectionSelect: () => {},
    rowSelectionSelectAll: () => {},

    columnInFilterItems: () => [],
    columnPivotGetDefinitions: () => [],

    rowTopCount: () => 0,
    rowCount: () => 0,
    rowBottomCount: () => 0,

    paginateGetCount: () => 0,
    paginateRowStartAndEndForPage: () => [0, 0],

    // Not relevant for client data source.
    rowReload: () => {},
    rowRetryExpansion: () => {},
    rowRetryFailed: () => {},
  };
}
