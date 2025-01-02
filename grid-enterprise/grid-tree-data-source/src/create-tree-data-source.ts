import {
  createPathTree,
  type PathTreeInputItem,
  type PathTreeNode,
} from "@1771technologies/path-tree";
import {
  BLOCK_SIZE,
  dataToRowNodes,
  rowChildCount,
  rowDepth,
  rowGroupToggle,
  rowParentIndex,
  rowSelection,
} from "@1771technologies/grid-client-data-source-community";
import type { ApiEnterprise, RowDataSourceEnterprise } from "@1771technologies/grid-types";
import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/cascada";
import type { RowNode, RowNodeGroup, RowNodeLeaf } from "@1771technologies/grid-types/community";
import {
  ROW_DEFAULT_PATH_SEPARATOR,
  ROW_GROUP_KIND,
  ROW_LEAF_KIND,
} from "@1771technologies/grid-constants";
import { BlockGraph, type BlockPayload } from "@1771technologies/grid-graph";
import { rowByIndex } from "./api/row-by-index";
import { rowById } from "./api/row-by-id";
import { rowGetMany } from "./api/row-get-many";

export interface TreeDataSourceInitial<D extends Record<string, unknown>, E> {
  readonly data: PathTreeInputItem<D>[];

  readonly getIdFromData: (d: D) => string;
  readonly getDataForGroup: (
    row: RowNodeGroup,
    api: ApiEnterprise<D, E>,
  ) => Record<string, unknown>;

  readonly topData?: D[];
  readonly bottomData?: D[];
  readonly pathSeparator?: string;
  readonly distinctNonAdjacentPaths?: boolean;
}

export interface ClientState<D extends Record<string, unknown>, E> {
  api: Signal<ApiEnterprise<D, E>>;

  graph: ReadonlySignal<BlockGraph<D>>;
  selectedIds: Signal<Set<string>>;
  cache: Signal<Record<string, any>>;

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;

  getRowDataForGroup: (row: RowNodeGroup) => Record<string, unknown>;
}

export function createTreeDataSource<D extends Record<string, unknown>, E>(
  r: TreeDataSourceInitial<D, E>,
): RowDataSourceEnterprise<D, E> {
  const { store: state, dispose } = cascada<ClientState<D, E>>(() => {
    const api$ = signal<ApiEnterprise<D, E>>(null as unknown as ApiEnterprise<D, E>);

    const selectedIds = signal(new Set<string>());

    const tree = signal(createPathTree(r.data));

    const graph = computed<BlockGraph<D>>(() => {
      const separator = r.pathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
      const g = new BlockGraph<D>(2000, separator);
      const api = api$.get();
      const sx = api.getState();
      const defaultExpansion = sx.rowGroupDefaultExpansion.peek();

      const stack = [...tree.get().map((c) => ["", c, 0] as [string, PathTreeNode<D>, number])];

      const paths: Record<string, RowNode<D>[]> = {};
      while (stack.length) {
        const [path, item, depth] = stack.pop()!;

        if (item.type === "leaf") {
          paths[path] ??= [];
          paths[path].push({
            kind: ROW_LEAF_KIND,
            data: item.data,
            id: r.getIdFromData(item.data),
            rowIndex: null,
            rowPin: null,
          });
        }

        if (item.type === "parent") {
          paths[path] ??= [];
          paths[path].push({
            kind: ROW_GROUP_KIND,
            data: {},
            id: item.occurrence,
            rowIndex: null,
            expanded:
              typeof defaultExpansion === "number" ? depth <= defaultExpansion : defaultExpansion,
            pathKey: item.path.at(-1)!,
          });

          stack.unshift(
            ...item.children.map(
              (c) => [item.path.join(separator), c, depth + 1] as [string, PathTreeNode<D>, number],
            ),
          );
        }

        const pathPayloads: {
          sizes: { path: string; size: number }[];
          payloads: BlockPayload<D>[];
        } = {
          sizes: [],
          payloads: [],
        };
        for (const [path, data] of Object.entries(paths)) {
          pathPayloads.sizes.push({ path, size: data.length });

          const blockCnt = Math.ceil(data.length / BLOCK_SIZE);
          for (let i = 0; i < blockCnt; i++) {
            pathPayloads.payloads.push({
              data: data.slice(i * BLOCK_SIZE, i * BLOCK_SIZE + BLOCK_SIZE),
              path,
              index: i,
            });
          }
        }

        for (const z of pathPayloads.sizes) g.blockSetSize(z.path, z.size);
        g.blockAdd(pathPayloads.payloads);
      }
      return g;
    });

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes([], null, "center");

    const rowTopNodes = signal(initialTopNodes);
    const rowCenterNodes = signal<RowNodeLeaf<D>[]>(initialCenterNodes);
    const rowBottomNodes = signal(initialBottomNodes);

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
    clean: () => {
      dispose();
    },

    rowByIndex: (r) => rowByIndex(state, r),
    rowById: (r) => rowById(state, r),
    rowGetMany: (s, e) => rowGetMany(state, s, e),

    rowChildCount: (r) => rowChildCount(state, r),
    rowDepth: (r) => rowDepth(state, r),
    rowParentIndex: (r) => rowParentIndex(state, r),

    rowGroupToggle: (id, s) => rowGroupToggle(state, id, s),

    rowSetData: () => {},
    rowSetDataMany: () => {},
    rowReplaceBottomData: () => {},
    rowReplaceData: () => {},
    rowReplaceTopData: () => {},

    rowSelectionAllRowsSelected: selection.rowSelectionAllRowsSelected,
    rowSelectionClear: selection.rowSelectionClear,
    rowSelectionDeselect: selection.rowSelectionDeselect,
    rowSelectionGetSelected: selection.rowSelectionGetSelected,
    rowSelectionIsIndeterminate: selection.rowSelectionIsIndeterminate,
    rowSelectionIsSelected: selection.rowSelectionIsSelected,
    rowSelectionSelect: selection.rowSelectionSelect,
    rowSelectionSelectAll: selection.rowSelectionSelectAll,

    columnInFilterItems: () => [],
    rowBottomCount: () => state.graph.peek().rowBotCount(),
    rowTopCount: () => state.graph.peek().rowTopCount(),
    rowCount: () => state.graph.peek().rowCount(),

    // Not relevant for the tree data source
    columnPivotGetDefinitions: () => [],
    paginateGetCount: () => 0,
    paginateRowStartAndEndForPage: () => [0, 0],

    rowReload: () => {},
    rowRetryExpansion: () => {},
    rowRetryFailed: () => {},
  };
}
