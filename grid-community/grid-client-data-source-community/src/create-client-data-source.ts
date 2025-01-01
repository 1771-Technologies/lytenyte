import { evaluateClientFilter } from "@1771technologies/grid-client-filter";
import type {
  ApiCommunity,
  RowDataSourceBackingCommunity,
} from "@1771technologies/grid-types";
import type {
  RowDataSourceClient,
  RowNodeLeaf,
} from "@1771technologies/grid-types/community";
import { dataToRowNodes } from "./row-nodes";
import {
  cascada,
  computed,
  signal,
  type Signal,
} from "@1771technologies/cascada";

export interface ClientState<D, E> {
  original: Signal<RowDataSourceClient<D>>;
  api: Signal<ApiCommunity<D, E>>;

  rowTopNodes: Signal<RowNodeLeaf<D>[]>;
  rowCenterNodes: Signal<RowNodeLeaf<D>[]>;
  rowBottomNodes: Signal<RowNodeLeaf<D>[]>;
}

export function createClientDataSource<D, E>(
  r: RowDataSourceClient<D>
): RowDataSourceBackingCommunity<D, E> {
  let watchers: (() => void)[] = [];

  const state = cascada(() => {
    const api$ = signal<ApiCommunity<D, E>>(
      null as unknown as ApiCommunity<D, E>
    );
    const original = signal(r);

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(
      r.bottomData ?? [],
      "bottom",
      "bottom"
    );
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const rowTopNodes = signal(initialTopNodes);
    const rowCenterNodes = signal(initialCenterNodes);
    const rowBottomNodes = signal(initialBottomNodes);

    const filteredNodes = computed(() => {
      const api = api$.get();
      const sx = api.getState();

      const rowNodes = rowCenterNodes.get();
      const filterModel = sx.filterModel.get();

      if (filterModel.length === 0) return rowNodes;

      const filteredNodes: RowNodeLeaf<D>[] = [];
      for (let i = 0; i < rowNodes.length; i++) {
        if (!evaluateClientFilter(api, filterModel, rowNodes[i])) continue;
        filteredNodes.push(rowNodes[i]);
      }

      return filteredNodes;
    });

    const sortedNodes = computed(() => {
      const api = api$.get();
      const sx = api.getState();

      const nodes = filteredNodes.get();
      const sortModel = sx.sortModel.get();
      if (sortModel.length === 0) return nodes;
    });

    return {
      api: api$,
      original,

      rowTopNodes,
      rowCenterNodes,
      rowBottomNodes,
    } satisfies ClientState<D, E>;
  });

  return {
    init: (a) => {
      state.store.api.set(a);

      const sx = a.getState();

      // page size change
      watchers.push(sx.paginateChildRows.watch(() => {}));
      watchers.push(sx.paginatePageSize.watch(() => {}));
      watchers.push(sx.columns.watch(() => {}));
      watchers.push(sx.filterModel.watch(() => {}));
      watchers.push(sx.sortModel.watch(() => {}));
      watchers.push(sx.rowGroupModel.watch(() => {}));
      watchers.push(sx.rowDataSource.watch(() => {}));
      watchers.push(sx.rowTotalRow.watch(() => {}));
      watchers.push(sx.rowTotalsPinned.watch(() => {}));
    },
    clean: () => {
      watchers.forEach((c) => c());
      watchers = [];

      state.dispose();
    },

    rowByIndex: () => null,
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
