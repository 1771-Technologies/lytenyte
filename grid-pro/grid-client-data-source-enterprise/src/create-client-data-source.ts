import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import { BlockGraph } from "@1771technologies/grid-graph";
import { filterNodesComputed } from "./utils/filterNodesComputed";
import { sortedNodesComputed } from "./utils/sorted-nodes-computed";
import {
  BLOCK_SIZE,
  dataToRowNodes,
  flatBlockPayloadsComputed,
  groupBlockPayloadsComputed,
  paginateGetCount,
  paginateRowStartAndEndForPage,
  rowById,
  rowByIndex,
  rowChildCount,
  rowDepth,
  rowGetMany,
  rowParentIndex,
  rowSetData,
  rowSetDataMany,
} from "@1771technologies/grid-client-data-source-community";
import { columnInFilterItems } from "./api/column-in-filter-items";
import { createColumnPivots } from "./api/column-pivots/create-pivot-columns";
import type {
  ApiPro,
  ColumnPro,
  RowDataSourcePro,
  RowNodeLeafPro,
} from "@1771technologies/grid-types/pro";

export interface ClientState<D, E> {
  api: Signal<ApiPro<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;

  cache: Signal<Record<string, any>>;

  rowTopNodes: Signal<RowNodeLeafPro<D>[]>;
  rowCenterNodes: Signal<RowNodeLeafPro<D>[]>;
  rowBottomNodes: Signal<RowNodeLeafPro<D>[]>;
}

export interface ClientDataSourceInitial<D, E> {
  readonly data: D[];
  readonly topData?: D[];
  readonly bottomData?: D[];

  readonly filterToDate?: (value: unknown, column: ColumnPro<D, E>) => Date;
  readonly sortToDate?: (value: unknown, column: ColumnPro<D, E>) => Date;
}

export interface ClientRowDataSource<D, E> extends RowDataSourcePro<D, E> {
  readonly data: (section?: "top" | "center" | "bottom") => D[];
}

export function createClientDataSource<D, E>(
  r: ClientDataSourceInitial<D, E>,
): ClientRowDataSource<D, E> {
  const state = cascada(() => {
    const api$ = signal<ApiPro<D, E>>(null as unknown as ApiPro<D, E>);

    const cache = signal<Record<string, any>>({});

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const postUpdate = () => {
      cache.set({});

      const api = api$.peek();
      const mode = api.getState().columnPivotModeIsOn.peek();
      if (!mode) return;

      api.columnPivotsReload();
    };

    const rowTopNodes = signal(initialTopNodes, { postUpdate: postUpdate });
    const rowCenterNodes = signal(initialCenterNodes, { postUpdate: postUpdate });
    const rowBottomNodes = signal(initialBottomNodes, { postUpdate: postUpdate });

    const filteredNodes = filterNodesComputed(
      api$,
      rowCenterNodes,
      r.filterToDate ?? (((v: number) => new Date(v)) as any),
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

      const expansions = sx.rowGroupExpansions.get();
      const expansionDefault = sx.rowGroupDefaultExpansion.peek();

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

      graph.blockFlatten(expansions, expansionDefault);

      api.rowRefresh();

      return graph;
    });

    return {
      api: api$,

      graph,
      cache,

      rowTopNodes,
      rowBottomNodes,
      rowCenterNodes,
    } satisfies ClientState<D, E>;
  });

  let watchers: (() => void)[] = [];

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
    },

    data: (section) => {
      if (!section) {
        return [
          ...state.rowTopNodes.peek(),
          ...state.rowCenterNodes.peek(),
          ...state.rowBottomNodes.peek(),
        ].map((c) => c.data);
      }
      if (section === "bottom") return state.rowBottomNodes.peek().map((c) => c.data);
      if (section === "top") return state.rowTopNodes.peek().map((c) => c.data);

      return state.rowCenterNodes.peek().map((c) => c.data);
    },

    rowByIndex: (r) => rowByIndex(state, r),
    rowById: (id) => rowById(state, id),
    rowIdToRowIndex: (id) => state.graph.peek().rowIdToRowIndex(id),
    rowGetMany: (start, end) => rowGetMany(state, start, end),

    rowChildCount: (r) => rowChildCount(state, r),
    rowDepth: (r) => rowDepth(state, r),
    rowParentIndex: (r) => rowParentIndex(state, r),

    rowSetData: (id, d) => rowSetData(state, id, d),
    rowSetDataMany: (updates) => rowSetDataMany(state, updates),
    rowReplaceBottomData: (d) => state.rowBottomNodes.set(dataToRowNodes(d, "bottom", "bottom")),
    rowReplaceData: (d) => state.rowCenterNodes.set(dataToRowNodes(d, null, "center")),
    rowReplaceTopData: (d) => state.rowTopNodes.set(dataToRowNodes(d, "top", "top")),

    rowGetAllChildrenIds: (rowByIndex) => {
      return state.graph
        .peek()
        .rowAllChildren(rowByIndex)
        .map((c) => c.id);
    },
    rowGetAllIds: () => {
      const graph = state.graph.peek();
      const allRows = graph.rowGetAllRows();

      return allRows.map((c) => c.id);
    },
    rowSelectionIndeterminateSupported: () => true,
    rowSelectionSelectAllSupported: () => true,

    columnInFilterItems: (c) => columnInFilterItems(state, c),
    columnPivots: () => {
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
    rowReloadExpansion: () => {},
    rowReset: () => {},
  };
}
