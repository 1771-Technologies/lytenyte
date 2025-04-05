import { createPathTree, type PathTreeInputItem } from "@1771technologies/path-tree";
import {
  dataToRowNodes,
  rowChildCount,
  rowDepth,
  rowParentIndex,
  rowSetData,
  rowSetDataMany,
} from "@1771technologies/grid-client-data-source-community";
import type {
  ApiEnterprise,
  ColumnEnterprise,
  RowDataSourceEnterprise,
} from "@1771technologies/grid-types";
import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import type { RowNodeGroup, RowNodeLeaf } from "@1771technologies/grid-types/core";
import { ROW_DEFAULT_PATH_SEPARATOR } from "@1771technologies/grid-constants";
import { BlockGraph } from "@1771technologies/grid-graph";
import { rowByIndex } from "./api/row-by-index";
import { rowById } from "./api/row-by-id";
import { rowGetMany } from "./api/row-get-many";
import { treeToPayload } from "./utils/tree-to-payload";
import { filterNodesComputed } from "./utils/filterNodesComputed";
import { sortedNodesComputed } from "./utils/sorted-nodes-computed";

export interface TreeDataSourceInitial<D, E> {
  readonly pathFromData: (d: D) => string[];
  readonly getDataForGroup: (
    row: RowNodeGroup,
    api: ApiEnterprise<D, E>,
  ) => Record<string, unknown>;

  readonly data: D[];
  readonly topData?: D[];
  readonly bottomData?: D[];
  readonly pathSeparator?: string;
  readonly distinctNonAdjacentPaths?: boolean;

  readonly filterToDate?: (value: unknown, column: ColumnEnterprise<D, E>) => Date;
  readonly sortToDate?: (value: unknown, column: ColumnEnterprise<D, E>) => Date;
}

export interface ClientState<D, E> {
  api: Signal<ApiEnterprise<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;
  cache: Signal<Record<string, any>>;

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;

  getRowDataForGroup: (row: RowNodeGroup) => Record<string, unknown>;
}

export function createTreeDataSource<D, E>(
  r: TreeDataSourceInitial<D, E>,
): RowDataSourceEnterprise<D, E> {
  const state = cascada<ClientState<D, E>>(() => {
    const api$ = signal<ApiEnterprise<D, E>>(null as unknown as ApiEnterprise<D, E>);

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const rowTopNodes = signal(initialTopNodes);
    const rowCenterNodes = signal(initialCenterNodes);
    const rowBottomNodes = signal(initialBottomNodes);

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

    const paths = computed(() => {
      return sortedNodes
        .get()
        .map<PathTreeInputItem<RowNodeLeaf<D>>>((c) => ({ data: c, path: r.pathFromData(c.data) }));
    });

    const tree = computed(() => createPathTree(paths.get()));

    const payloads = computed(() =>
      treeToPayload(tree.get(), r.pathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR),
    );

    const graph$ = computed<BlockGraph<D>>(() => {
      const separator = r.pathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
      const g = new BlockGraph<D>(2000, separator);

      const p = payloads.get();

      for (const z of p.sizes) g.blockSetSize(z.path, z.size);
      g.blockAdd(p.payloads);

      return g;
    });

    const graph = computed(() => {
      const graph = graph$.get();
      const api = api$.get();
      const sx = api.getState();

      const expansions = sx.rowGroupExpansions.get();
      const expansionDefault = sx.rowGroupDefaultExpansion.peek();

      graph.blockFlatten(expansions, expansionDefault);

      api.rowRefresh();

      return graph;
    });

    const getRowDataForGroup = (row: RowNodeGroup) => r.getDataForGroup(row, api$.get());

    return {
      api: api$,
      graph,

      getRowDataForGroup,
      cache: signal({}),

      rowTopNodes,
      rowCenterNodes,
      rowBottomNodes,
    } satisfies ClientState<D, E>;
  });

  return {
    init: (a) => {
      state.api.set(a);
    },
    clean: () => {},

    rowByIndex: (r) => rowByIndex(state, r),
    rowById: (r) => rowById(state, r),
    rowGetMany: (s, e) => rowGetMany(state, s, e),

    rowChildCount: (r) => rowChildCount(state, r),
    rowDepth: (r) => rowDepth(state, r),
    rowParentIndex: (r) => rowParentIndex(state, r),

    rowSetData: (row, d) => rowSetData(state, row, d),
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

    rowIdToRowIndex: (id) => state.graph.peek().rowIdToRowIndex(id),
    rowSelectionIndeterminateSupported: () => true,
    rowSelectionSelectAllSupported: () => true,

    columnInFilterItems: () => [],
    rowBottomCount: () => state.graph.peek().rowBotCount(),
    rowTopCount: () => state.graph.peek().rowTopCount(),
    rowCount: () => state.graph.peek().rowCount(),

    // Not relevant for the tree data source
    columnPivots: () => [],
    paginateGetCount: () => 0,
    paginateRowStartAndEndForPage: () => [0, 0],

    rowReload: () => {},
    rowReloadExpansion: () => {},
    rowReset: () => {},
  };
}
