import {
  cascada,
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import { filterNodesComputed } from "./utils/filterNodesComputed";
import { dataToRowNodes } from "@1771technologies/grid-client-data-source-core";
import { columnInFilterItems } from "./api/column-in-filter-items";
import { createColumnPivots } from "./api/column-pivots/create-pivot-columns";
import type {
  ApiPro,
  ColumnPro,
  RowDataSourcePro,
  RowNodeLeafPro,
} from "@1771technologies/grid-types/pro";
import { makeRowTree, type RowTree } from "./tree/make-row-tree";
import type { RowNodeCore, RowNodeLeafCore } from "@1771technologies/grid-types/core";
import { getComparatorsForModel, makeCombinedComparator } from "@1771technologies/grid-client-sort";
import { getFlattenedTree } from "./tree/get-flattened-tree";

export interface ClientState<D, E> {
  api: Signal<ApiPro<D, E>>;

  rowTree: ReadonlySignal<RowTree<D>>;
  tree: ReadonlySignal<{
    rowById: {
      [x: string]: RowNodeLeafCore<D> | RowNodeCore<D>;
    };
    rowByIndex: Map<number, RowNodeCore<any>>;
    rowIdToRowIndex: Map<string, number>;
    rowIdToDepth: Map<string, number> | undefined;
    rowIdToParent: Map<string, string | null> | undefined;
    rows: RowNodeCore<D>[];
  }>;
  refreshSignal: Signal<number>;

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

    const initialTopNodes = dataToRowNodes(r.topData ?? [], "top", "top");
    const initialBottomNodes = dataToRowNodes(r.bottomData ?? [], "bottom", "bottom");
    const initialCenterNodes = dataToRowNodes(r.data, null, "center");

    const postUpdate = () => {
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

    const refreshSignal = signal(0);

    const tree = computed(() => {
      const api = api$.get();
      const sx = api.getState();
      const rows = filteredNodes.get();
      const indices = Array.from({ length: rows.length }, (_, i) => i);

      void refreshSignal.get();

      const groupKeys = sx.rowGroupModel
        .get()
        .map((c) => api.columnById(c)!)
        .map((c) => {
          return (r: RowNodeLeafCore<any>) =>
            api.columnFieldGroup(r, c) as string | null | undefined;
        });

      void sx.aggModel.get();
      void sx.aggFns.get();

      const tree = makeRowTree(api, rows, indices, groupKeys.length ? groupKeys : []);

      return tree;
    });

    const flattenTree = computed(() => {
      const api = api$.get();
      const sx = api.getState();

      const expansions = sx.rowGroupExpansions.get();

      const mode = sx.columnPivotModeIsOn.peek();
      const sortModel = mode ? sx.internal.columnPivotSortModel.get() : sx.sortModel.get();

      let sorter = null;
      if (sortModel.length) {
        const comparators = getComparatorsForModel(
          api as any,
          sortModel,
          sx.internal.columnLookup.get() as any,
          r.sortToDate ?? (((v: number) => new Date(v)) as any),
        );
        sorter = makeCombinedComparator(api as any, sortModel, comparators);
      }

      const flattened = getFlattenedTree(
        tree.get(),
        expansions,
        sx.rowGroupDefaultExpansion.peek(),
        sx.rowGroupModel.get().length > 0,
        sorter,
        rowTopNodes.get().length,
      );
      return flattened;
    });

    const final = computed(() => {
      const flat = flattenTree.get();
      const rowTree = tree.get();

      const top = rowTopNodes.get();
      const bot = rowBottomNodes.get();

      const rowById = {
        ...rowTree.rowIdToRowNode,
        ...Object.fromEntries(top.map((c) => [c.id, c])),
        ...Object.fromEntries(bot.map((c) => [c.id, c])),
      };

      const rowByIndex = new Map<number, RowNodeCore<any>>(flat.rowIndexToRow);
      const rowIdToRowIndex = new Map<string, number>(flat.rowIdToRowIndex);

      top.forEach((c, i) => {
        rowByIndex.set(i, c);
        rowIdToRowIndex.set(c.id, i);
      });

      const botOffset = rowByIndex.size;
      bot.forEach((c, i) => {
        const index = i + botOffset;
        rowByIndex.set(index, c);
        rowIdToRowIndex.set(c.id, index);
      });

      queueMicrotask(api$.peek().rowRefresh);

      return {
        rowById,
        rowByIndex,
        rowIdToRowIndex,
        rowIdToDepth: flat.rowIdToDepth,
        rowIdToParent: flat.rowIdToParentId,
        rows: flat.rows,
      };
    });

    return {
      api: api$,

      rowTree: tree,
      tree: final,
      refreshSignal,

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

      const reloadPivots = () => {
        if (!sx.columnPivotModeIsOn.peek()) return;
        a.columnPivotsReload();
      };

      watchers.push(sx.rowDataSource.watch(reloadPivots, false));
      watchers.push(sx.columnPivotModel.watch(reloadPivots, false));
      watchers.push(sx.measureModel.watch(reloadPivots, false));
      watchers.push(sx.columnPivotModeIsOn.watch(reloadPivots, false));

      setTimeout(() => {
        reloadPivots();
      }, 0);
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

    rowByIndex: (r) => state.tree.peek().rowByIndex.get(r),
    rowById: (id) => state.tree.peek().rowById[id],
    rowIdToRowIndex: (id) => state.tree.peek().rowIdToRowIndex.get(id),
    rowGetMany: (start, end) => {
      const rows: RowNodeCore<D>[] = [];
      const s = state.tree.peek();
      for (let i = start; i < end; i++) {
        const row = s.rowByIndex.get(i);
        if (row) rows.push(row);
      }
      return rows;
    },

    rowDepth: (r) => {
      const s = state.tree.peek();
      const id = s.rowByIndex.get(r)?.id;
      if (!id) return 0;

      return s.rowIdToDepth?.get(id) ?? 0;
    },

    rowSetData: (id, d) => {
      const t = state.tree.peek();

      const row = t.rowById[id];
      if (!row) return;

      (row as any).data = d;

      state.refreshSignal.set((prev) => prev + 1);
      state.api.peek().rowRefresh();
    },
    rowSetDataMany: (updates) => {
      const entries = Object.entries(updates);
      const s = state.tree.peek();

      for (let i = 0; i < entries.length; i++) {
        const [id, update] = entries[i];
        const row = s.rowById[id];
        if (!row) continue;

        (row as any).data = update;
      }

      state.refreshSignal.set((prev) => prev + 1);
      state.api.peek().rowRefresh();
    },
    rowReplaceBottomData: (d) => state.rowBottomNodes.set(dataToRowNodes(d, "bottom", "bottom")),
    rowReplaceData: (d) => state.rowCenterNodes.set(dataToRowNodes(d, null, "center")),
    rowReplaceTopData: (d) => state.rowTopNodes.set(dataToRowNodes(d, "top", "top")),

    rowGetAllChildrenIds: (rowByIndex) => {
      const t = state.rowTree.peek();
      const v = state.tree.peek();

      const id = v.rowByIndex.get(rowByIndex)?.id;

      if (!id) return [];

      const s = new Set<string>();

      const stack = [...(t.rowGroupIdToChildRowIds[id] ?? [])];
      while (stack.length) {
        const childId = stack.pop()!;
        s.add(childId);

        stack.push(...(t.rowGroupIdToChildRowIds[childId] ?? []));
      }

      return [...s.values()];
    },
    rowGetAllIds: () => {
      const s = state.tree.peek();
      return Object.keys(s.rowById);
    },
    rowSelectionIndeterminateSupported: () => true,
    rowSelectionSelectAllSupported: () => true,

    columnInFilterItems: (c) => columnInFilterItems(state, c),
    columnPivots: () => {
      const columns = createColumnPivots(state.api.peek(), state.rowCenterNodes.peek());
      return columns;
    },

    rowBottomCount: () => state.rowBottomNodes.peek().length,
    rowTopCount: () => state.rowTopNodes.peek().length,
    rowCount: () =>
      state.tree.peek().rows.length +
      state.rowTopNodes.peek().length +
      state.rowBottomNodes.peek().length,

    paginateGetCount: () => {
      const api = state.api.peek();
      const sx = api.getState();

      const flatRowCount = state.tree.peek().rows.length;
      const pageSize = sx.paginatePageSize.peek();

      const pageCount = Math.ceil(flatRowCount / pageSize);
      return pageCount;
    },
    paginateRowStartAndEndForPage: (page) => {
      const api = state.api.peek();
      const sx = api.getState();
      const pageCount = sx.internal.paginatePageCount.peek();

      if (page > pageCount) {
        throw new Error(`There are only ${pageCount} pages, but page ${page} was requested`);
      }

      const topCount = state.rowTopNodes.peek().length;
      const bottomCount = state.rowBottomNodes.peek().length;
      const rowCount = state.tree.peek().rows.length + topCount + bottomCount;

      const pageOffset = sx.paginatePageSize.peek();

      const startIndex = page * pageOffset + topCount;
      const endIndex = Math.min(startIndex + pageOffset, rowCount - bottomCount);

      return [startIndex, endIndex];
    },

    // Not relevant for client data source.
    rowReload: () => {},
    rowReloadExpansion: () => {},
    rowReset: () => {},
  };
}
