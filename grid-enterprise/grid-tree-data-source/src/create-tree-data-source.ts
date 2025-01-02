import {
  createPathTree,
  type PathTreeInputItem,
  type PathTreeNode,
} from "@1771technologies/path-tree";
import { BLOCK_SIZE, dataToRowNodes } from "@1771technologies/grid-client-data-source-community";
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

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;
}

export function createTreeDataSource<D extends Record<string, unknown>, E>(
  r: TreeDataSourceInitial<D, E>,
): RowDataSourceEnterprise<D, E> {
  const { store: state, dispose } = cascada(() => {
    const api$ = signal<ApiEnterprise<D, E>>(null as unknown as ApiEnterprise<D, E>);

    const selectedIds = signal(new Set<string>());

    const tree = signal(createPathTree(r.data));

    const graph = computed(() => {
      const separator = r.pathSeparator ?? ROW_DEFAULT_PATH_SEPARATOR;
      const g = new BlockGraph(2000, separator);
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

        return g;
      }
    });

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes([], null, "center");

    const rowTopNodes = signal(initialTopNodes);
    const rowCenterNodes = signal(initialCenterNodes);
    const rowBottomNodes = signal(initialBottomNodes);

    return {
      api: api$,
      graph,
      selectedIds,

      rowTopNodes,
      rowCenterNodes,
      rowBottomNodes,
    };
  });

  return {
    init: (a) => {
      state.api.set(a);
    },
    clean: () => {
      dispose();
    },

    rowByIndex: () => null,
    rowById: () => null,
    rowGetMany: () => [],

    rowChildCount: () => 0,
    rowDepth: () => 0,
    rowParentIndex: () => null,

    rowGroupToggle: () => {},

    rowSetData: () => {},
    rowSetDataMany: () => {},
    rowReplaceBottomData: () => {},
    rowReplaceData: () => {},
    rowReplaceTopData: () => {},

    rowSelectionAllRowsSelected: () => false,
    rowSelectionClear: () => false,
    rowSelectionDeselect: () => false,
    rowSelectionGetSelected: () => [],
    rowSelectionIsIndeterminate: () => false,
    rowSelectionIsSelected: () => false,
    rowSelectionSelect: () => {},
    rowSelectionSelectAll: () => {},

    columnInFilterItems: () => [],
    rowBottomCount: () => 0,
    rowTopCount: () => 0,
    rowCount: () => 0,

    // Not relevant for the tree data source
    columnPivotGetDefinitions: () => [],
    paginateGetCount: () => 0,
    paginateRowStartAndEndForPage: () => [0, 0],

    rowReload: () => {},
    rowRetryExpansion: () => {},
    rowRetryFailed: () => {},
  };
}
