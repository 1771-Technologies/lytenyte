import type { PathTreeInputItem } from "@1771technologies/path-tree";
import { dataToRowNodes } from "@1771technologies/grid-client-data-source-community";
import type { ApiEnterprise, RowDataSourceEnterprise } from "@1771technologies/grid-types";
import { cascada, signal, type ReadonlySignal, type Signal } from "@1771technologies/cascada";
import { BlockGraph } from "../../../grid-community/grid-graph/src";
import type { RowNodeGroup, RowNodeLeaf } from "@1771technologies/grid-types/community";

export interface TreeDataSourceInitial<D extends Record<string, unknown>, E> {
  readonly data: PathTreeInputItem<D>;
  readonly topData?: D[];
  readonly bottomData?: D[];

  readonly getDataForGroup: (
    row: RowNodeGroup,
    api: ApiEnterprise<D, E>,
  ) => Record<string, unknown>;

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

    const graph = signal(new BlockGraph(2000));

    const selectedIds = signal(new Set<string>());

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
