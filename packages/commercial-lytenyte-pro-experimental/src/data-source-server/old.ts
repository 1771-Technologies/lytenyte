import { effect, makeAtom, signal } from "@1771technologies/lytenyte-core/yinternal";
import type {
  ColumnPivotModel,
  DataRequest,
  DataRequestModel,
  Grid,
  RowDataSource,
  RowDataSourceServer,
  RowDataSourceServerParams,
} from "../+types.js";
import { useRef } from "react";
import { ServerData, type FlatView } from "./server-data.js";
import { equal } from "@1771technologies/lytenyte-shared";

export function makeServerDataSource<T>({
  dataFetcher,
  dataInFilterItemFetcher,

  dataColumnPivotFetcher,

  cellUpdateHandler,
  cellUpdateOptimistically,

  blockSize = 200,
}: Omit<RowDataSourceServerParams<T>, "dataFetchExternals">): RowDataSourceServer<T> {
  let grid: Grid<T> | null = null;
  let flat!: FlatView;
  let source!: ServerData;
  void grid;

  const isLoading = makeAtom(signal(false));
  const loadError = makeAtom(signal<unknown>(null));
  const requestsForView = makeAtom(signal<DataRequest[]>([]));

  const cleanup: (() => void)[] = [];
  const init: RowDataSource<T>["init"] = (g) => {
    grid = g;

    source = new ServerData({
      defaultExpansion: g.state.rowGroupDefaultExpansion.get(),
      blocksize: blockSize,
      expansions: g.state.rowGroupExpansions.get(),
      pivotExpansions: g.state.columnPivotRowGroupExpansions.get(),
      pivotMode: g.state.columnPivotMode.get(),
      onResetLoadBegin: () => {
        isLoading.set(true);
        loadError.set(null);
      },
      onInvalidate: () => g.state.rowDataStore.rowClearCache(),
      onResetLoadEnd: () => isLoading.set(false),
      onResetLoadError: (e) => loadError.set(e),
      onFlatten: (f) => {
        const store = g.state.rowDataStore;
        flat = f;

        store.rowTopCount.set(f.top);
        store.rowCenterCount.set(f.center);
        store.rowBottomCount.set(f.bottom);

        store.rowClearCache();
      },
    });

    let prevModel: Omit<DataRequestModel<any>, "pivotGroupExpansions" | "groupExpansions"> = {
      sorts: g.state.sortModel.get(),
      groups: g.state.rowGroupModel.get(),
      filters: g.state.filterModel.get(),
      filtersIn: g.state.filterInModel.get(),
      quickSearch: g.state.quickSearch.get(),
      aggregations: g.state.aggModel.get(),
      pivotMode: g.state.columnPivotMode.get(),
      pivotModel: g.state.columnPivotModel.get(),
    };

    cleanup.push(
      effect(() => {
        const newModel: Omit<DataRequestModel<any>, "pivotGroupExpansions" | "groupExpansions"> = {
          // @ts-expect-error this is fine - just a hidden type
          sorts: g.state.sortModel.$(),
          // @ts-expect-error this is fine - just a hidden type
          groups: g.state.rowGroupModel.$(),
          // @ts-expect-error this is fine - just a hidden type
          filters: g.state.filterModel.$(),
          // @ts-expect-error this is fine - just a hidden type
          filtersIn: g.state.filterInModel.$(),
          // @ts-expect-error this is fine - just a hidden type
          quickSearch: g.state.quickSearch.$(),
          // @ts-expect-error this is fine - just a hidden type
          aggregations: g.state.aggModel.$(),
          // @ts-expect-error this is fine - just a hidden type
          pivotMode: g.state.columnPivotMode.$(),
          // @ts-expect-error this is fine - just a hidden type
          pivotModel: g.state.columnPivotModel.$(),
        };

        if (equal(newModel, prevModel)) return;

        source.dataFetcher = (req, expansions, pivotExpansions) => {
          return dataFetcher({
            grid: g,
            model: {
              ...newModel,
              groupExpansions: expansions,
              pivotGroupExpansions: pivotExpansions,
            },
            reqTime: Date.now(),
            requests: req,
          });
        };

        prevModel = newModel;
      }),
    );

    const pivotModel = g.state.columnPivotModel.get();
    let prevPivotColumnModel = pivotModel.columns;
    let prevPivotColumnValues = pivotModel.values;
    const updatePivotColumns = async (
      model: ColumnPivotModel<T>,
      ignoreEqualCheck: boolean = false,
    ) => {
      if (
        !ignoreEqualCheck &&
        equal(prevPivotColumnModel, model.columns) &&
        equal(prevPivotColumnValues, model.values)
      )
        return;

      const pivotColumns = await dataColumnPivotFetcher?.({
        grid: g,
        model: {
          ...prevModel,
          pivotMode: g.state.columnPivotMode.get(),
          pivotModel: model,
          groupExpansions: g.state.rowGroupExpansions.get(),
          pivotGroupExpansions: g.state.columnPivotColumnGroupExpansions.get(),
        },
        reqTime: Date.now(),
      });

      g.state.columnPivotColumns.set(pivotColumns ?? []);
      g.state.rowDataStore.rowClearCache();

      prevPivotColumnModel = model.columns;
      prevPivotColumnValues = model.values;
    };

    if (g.state.columnPivotMode.get()) updatePivotColumns(pivotModel);

    // Pivot model monitoring
    cleanup.push(
      grid.state.columnPivotMode.watch(() => {
        const model = g.state.columnPivotModel.get();
        updatePivotColumns(model);
      }),
    );
    cleanup.push(
      grid.state.columnPivotModel.watch(() => {
        const model = g.state.columnPivotModel.get();
        updatePivotColumns(model);
      }),
    );

    cleanup.push(
      g.state.rowGroupDefaultExpansion.watch(() => {
        source.defaultExpansion = g.state.rowGroupDefaultExpansion.get();
      }),
    );

    cleanup.push(
      g.state.viewBounds.watch(() => {
        const bounds = g.state.viewBounds.get();
        source.rowViewBounds = [bounds.rowCenterStart, bounds.rowCenterEnd];

        const requests = source.requestsForView();
        const current = requestsForView.get();
        if (equal(requests, current)) return;

        requestsForView.set(requests);
      }),
    );

    source.dataFetcher = (req, expansions, pivotExpansions) => {
      return dataFetcher({
        grid: g,
        model: {
          ...prevModel,
          groupExpansions: expansions,
          pivotGroupExpansions: pivotExpansions,
        },
        reqTime: Date.now(),
        requests: req,
      });
    };
  };

  const rowById: RowDataSource<T>["rowById"] = (id) => {
    return flat.rowIdToRow.get(id) ?? null;
  };

  const rowAllChildIds: RowDataSource<T>["rowAllChildIds"] = (rowId) => {
    const f = flat;
    const row = f.rowIdToRow.get(rowId);
    if (!row || row.kind === "leaf") return [];

    const ids: Set<string> = new Set();
    const node = f.rowIdToTreeNode.get(row.id);
    if (!node || node.kind === "leaf") return [];

    const stack = [...node.byPath.values()];
    while (stack.length) {
      const item = stack.pop()!;
      if (item?.kind === "leaf") {
        ids.add(item.data.id);
      } else {
        stack.push(...item.byPath.values());
        ids.add(item.data.id);
      }
    }

    return [...ids];
  };

  const rowByIndex: RowDataSource<T>["rowByIndex"] = (i) => {
    const row = flat.rowIndexToRow.get(i);
    const isLoading = flat.loading.has(i);
    const isGroupLoading = flat.loadingGroup.has(i);
    const errorGroup = flat.erroredGroup.get(i);
    const error = flat.errored.get(i);
    if (!row)
      return {
        id: `__loading__placeholder__${i}`,
        data: null,
        kind: "leaf",
        loading: isLoading,
        error: error,
      };

    if (row.kind === "leaf") {
      if (error || isLoading) {
        return { ...row, loading: isLoading, error: error?.error };
      }
    } else if (row.kind === "branch") {
      if (error || isLoading || isGroupLoading || errorGroup) {
        return {
          ...row,
          loading: isLoading,
          error: error?.error,
          errorGroup: errorGroup?.error,
          loadingGroup: isGroupLoading,
        };
      }
    }

    return row ?? null;
  };

  const rowExpand: RowDataSource<T>["rowExpand"] = (expansions) => {
    if (!grid) return;

    const mode = grid.state.columnPivotMode.get();

    if (mode) {
      const current = grid.state.columnPivotColumnGroupExpansions.get();
      const next = { ...current, ...expansions };
      source.pivotExpansions = next;
      grid.state.columnPivotRowGroupExpansions.set(next);
    } else {
      const current = grid.state.rowGroupExpansions.get();
      const next = { ...current, ...expansions };
      source.expansions = next;
      grid.state.rowGroupExpansions.set(next);
    }
  };

  const rowToIndex: RowDataSource<T>["rowToIndex"] = (rowId) => {
    return flat.rowIdToRowIndex.get(rowId) ?? null;
  };

  const rowSelect: RowDataSource<T>["rowSelect"] = (params) => {
    if (!grid || params.mode === "none") return;

    if (params.mode === "single") {
      if (params.deselect) {
        grid.state.rowSelectedIds.set(new Set());
      } else {
        grid.state.rowSelectedIds.set(new Set([params.startId]));
      }

      return;
    }

    const ids = new Set<string>();
    if (params.startId === params.endId) {
      ids.add(params.startId);
      if (params.selectChildren) {
        rowAllChildIds(params.startId).forEach((c) => ids.add(c));
      }
    } else {
      const first = rowToIndex(params.startId);
      const last = rowToIndex(params.endId);
      if (first == null || last == null) return;

      const start = Math.min(first, last);
      const end = Math.max(first, last);

      for (let i = start; i <= end; i++) {
        const row = rowByIndex(i);

        if (!row) continue;

        if (params.selectChildren) {
          rowAllChildIds(row.id).forEach((c) => ids.add(c));
        }
        if (row?.id) ids.add(row.id);
      }
    }

    if (params.deselect) {
      const current = grid.state.rowSelectedIds.get();
      const next = current.difference(ids);
      grid.state.rowSelectedIds.set(next);
    } else {
      const current = grid.state.rowSelectedIds.get();
      const next = current.union(ids);
      grid.state.rowSelectedIds.set(next);
    }
  };
  const rowSelectAll: RowDataSource<T>["rowSelectAll"] = (params) => {
    if (!grid) return;
    if (params.deselect) {
      grid.state.rowSelectedIds.set(new Set());
      return;
    }

    const t = flat;
    grid.state.rowSelectedIds.set(new Set(t.rowIdToRow.keys()));
  };

  const rowSetBotData: RowDataSource<T>["rowSetBotData"] = () => {
    console.error("Directly setting bottom data in the server data model is not supported.");
  };
  const rowSetTopData: RowDataSource<T>["rowSetTopData"] = () => {
    console.error("Directly setting top data in the server data model is not supported.");
  };
  const rowSetCenterData: RowDataSource<T>["rowSetCenterData"] = () => {
    console.error("Directly setting center data in the server data model is not supported.");
  };

  // CRUD ops
  const rowAdd: RowDataSource<T>["rowAdd"] = () => {
    throw new Error(
      `Server data source does not support adding rows directly. Instead push updates via the pushResponses or pushRequests method`,
    );
  };
  const rowDelete: RowDataSource<T>["rowDelete"] = () => {
    throw new Error(
      `Server data source does not support deleting rows directly. Instead push updates via the pushResponses or pushRequests method`,
    );
  };

  const rowUpdate: RowDataSource<T>["rowUpdate"] = (updates) => {
    const idMap = new Map(
      [...updates.entries()]
        .map(([key, data]) => {
          if (typeof key === "string") return [key, data];

          const row = rowByIndex(key);
          if (!row) return null;

          return [row.id, data];
        })
        .filter((n) => n != null) as [string, any][],
    );

    cellUpdateHandler?.(idMap);

    if (!cellUpdateOptimistically) return;

    idMap.forEach((data, id) => {
      source.updateRow(id, data);
    });

    source.flatten();
  };

  const inFilterItems: RowDataSource<T>["inFilterItems"] = (c) => {
    if (!dataInFilterItemFetcher || !grid) return [];

    return dataInFilterItemFetcher({ column: c, grid, reqTime: Date.now() });
  };

  const rowAreAllSelected: RowDataSource<T>["rowAreAllSelected"] = () => {
    return false;
  };

  const reset: RowDataSourceServer<T>["reset"] = () => {
    source.reset();
  };
  const pushResponses: RowDataSourceServer<T>["pushResponses"] = (responses) => {
    source.handleResponses(responses);
  };
  const pushRequests: RowDataSourceServer<T>["pushRequests"] = (requests) => {
    source.handleRequests(requests);
  };

  const retry: RowDataSourceServer<T>["retry"] = () => {
    source.retry();

    grid?.state.rowDataStore.rowClearCache();
  };

  const refresh: RowDataSourceServer<T>["refresh"] = (onSuccess, onError) => {
    const requests = source.requestsForView();
    pushRequests(requests, onSuccess, onError);
  };

  const requestForGroup: RowDataSourceServer<T>["requestForGroup"] = (row) => {
    const index = typeof row === "number" ? row : flat.rowIdToRowIndex.get(row.id);
    if (index == null) return null;

    return source.requestForGroup(index);
  };

  const requestForNextSlice: RowDataSourceServer<T>["requestForNextSlice"] = (req) => {
    return source.requestForNextSlice(req);
  };

  return {
    init,
    rowAdd,
    rowById,
    rowAllChildIds,
    rowByIndex,
    rowDelete,
    rowExpand,
    rowSelect,
    rowSelectAll,
    rowSetBotData,
    rowSetCenterData,
    rowSetTopData,

    rowToIndex,
    rowUpdate,

    inFilterItems,
    rowAreAllSelected,

    isLoading,
    loadError,
    pushResponses,
    pushRequests,
    reset,
    retry,
    refresh,
    requestsForView: requestsForView,
    requestForGroup,
    requestForNextSlice,

    get seenRequests() {
      return flat.seenRequests;
    },
  };
}

export function useServerDataSource<T>(p: RowDataSourceServerParams<T>) {
  const ds = useRef<RowDataSourceServer<T>>(null as any);

  const fetcherRef = useRef(p.dataFetcher);
  const prevExternal = useRef(p.dataFetchExternals ?? []);
  const animRef = useRef(false);

  if (!arrayShallow(prevExternal.current, p.dataFetchExternals ?? [])) {
    prevExternal.current = p.dataFetchExternals ?? [];
    fetcherRef.current = p.dataFetcher;
    if (ds.current && !animRef.current) {
      animRef.current = true;
      queueMicrotask(() => {
        ds.current.reset();
        animRef.current = false;
      });
    }
  }

  if (!ds.current) {
    ds.current = makeServerDataSource({
      ...p,
      dataFetcher: (params) => {
        return fetcherRef.current(params);
      },
    });
  }

  return ds.current;
}

function arrayShallow(left: any[], right: any[]) {
  if (left.length !== right.length) return false;

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return false;
  }

  return true;
}
