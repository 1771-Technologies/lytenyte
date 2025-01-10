import { createPathTree, type PathTreeInputItem } from "@1771technologies/path-tree";
import {
  dataToRowNodes,
  rowChildCount,
  rowDepth,
  rowGroupToggle,
  rowParentIndex,
  rowSelection,
  rowSetData,
  rowSetDataMany,
} from "@1771technologies/grid-client-data-source-community";
import type { ApiEnterprise, RowDataSourceEnterprise } from "@1771technologies/grid-types";
import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import type { RowNodeGroup, RowNodeLeaf } from "@1771technologies/grid-types/community";
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
}

export interface ClientState<D, E> {
  api: Signal<ApiEnterprise<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;
  selectedIds: Signal<Set<string>>;
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

    const selectedIds = signal(new Set<string>());

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const rowTopNodes = signal(initialTopNodes);
    const rowCenterNodes = signal(initialCenterNodes);
    const rowBottomNodes = signal(initialBottomNodes);

    const filteredNodes = filterNodesComputed(api$, rowCenterNodes);
    const sortedNodes = sortedNodesComputed(api$, filteredNodes);

    const paths = computed(() => {
      return sortedNodes
        .get()
        .map<PathTreeInputItem<RowNodeLeaf<D>>>((c) => ({ data: c, path: r.pathFromData(c.data) }));
    });

    const tree = computed(() => createPathTree(paths.get()));

    const payloads = computed(() =>
      treeToPayload(
        tree.get(),
        api$.get().getState().rowGroupDefaultExpansion.peek(),
        r.pathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR,
      ),
    );

    const graph = computed<BlockGraph<D>>(() => {
      const separator = r.pathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
      const g = new BlockGraph<D>(2000, separator);

      const p = payloads.get();

      for (const z of p.sizes) g.blockSetSize(z.path, z.size);
      g.blockAdd(p.payloads);

      return g;
    });

    const getRowDataForGroup = (row: RowNodeGroup) => r.getDataForGroup(row, api$.get());

    return {
      api: api$,
      graph,
      selectedIds,

      getRowDataForGroup,
      cache: signal({}),

      rowTopNodes,
      rowCenterNodes,
      rowBottomNodes,
    } satisfies ClientState<D, E>;
  });

  const selection = rowSelection(state);

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

    rowGroupToggle: (id, s) => rowGroupToggle(state, id, s),

    rowSetData: (row, d) => rowSetData(state, row, d),
    rowSetDataMany: (updates) => rowSetDataMany(state, updates),
    rowReplaceBottomData: (d) => state.rowBottomNodes.set(dataToRowNodes(d, "bottom", "bottom")),
    rowReplaceData: (d) => state.rowCenterNodes.set(dataToRowNodes(d, null, "center")),
    rowReplaceTopData: (d) => state.rowTopNodes.set(dataToRowNodes(d, "top", "top")),

    rowSelectionAllRowsSelected: selection.rowSelectionAllRowsSelected,
    rowSelectionClear: selection.rowSelectionClear,
    rowSelectionDeselect: selection.rowSelectionDeselect,
    rowSelectionGetSelected: selection.rowSelectionGetSelected,
    rowSelectionIsIndeterminate: selection.rowSelectionIsIndeterminate,
    rowSelectionIsSelected: selection.rowSelectionIsSelected,
    rowSelectionSelect: selection.rowSelectionSelect,
    rowSelectionSelectAll: selection.rowSelectionSelectAll,
    rowSelectionSelectAllSupported: selection.rowSelectionSelectAllSupported,

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
