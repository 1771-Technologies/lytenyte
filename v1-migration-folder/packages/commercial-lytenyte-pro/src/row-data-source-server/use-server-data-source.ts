import { atom, createStore } from "@1771technologies/atom";
import type {
  ColumnPivotModel,
  DataRequest,
  DataRequestModel,
  DataResponse,
  DataResponseBranchItem,
  DataResponseLeafItem,
  DataResponsePinned,
  Grid,
  RowDataSource,
  RowDataSourceServer,
  RowDataSourceServerParams,
} from "../+types";
import { useRef } from "react";
import { makeAsyncTree } from "./async-tree/make-async-tree";
import { makeGridAtom } from "@1771technologies/lytenyte-shared";
import type {
  LeafOrParent,
  SetDataAction,
  TreeParent,
  TreeRoot,
} from "./async-tree/+types.async-tree";
import { getNodeDepth } from "./utils/get-node-depth";
import { getRequestId } from "./utils/get-request-id";
import { RangeTree, type FlattenedRange } from "./range-tree/range-tree";
import { getNodePath } from "./utils/get-node-path";
import { equal } from "@1771technologies/lytenyte-js-utils";

export function makeServerDataSource<T>({
  dataFetcher,
  dataColumnPivotFetcher,
  dataInFilterItemFetcher,

  cellUpdateHandler,
  cellUpdateOptimistically = true,
  blockSize = 200,
}: RowDataSourceServerParams<T>): RowDataSourceServer<T> {
  let grid: Grid<T> | null = null;

  const snapshot$ = atom(Date.now());

  const rdsStore = createStore();
  const tree$ = atom(makeAsyncTree<DataResponseBranchItem, DataResponseLeafItem>());
  const tree = makeGridAtom(tree$, rdsStore);

  const isLoading$ = atom(false);
  const isLoading = makeGridAtom(isLoading$, rdsStore);

  const initialized = atom(false);
  const model$ = atom<DataRequestModel<T>>({
    sorts: [],
    filters: {},
    filtersIn: {},
    quickSearch: null,

    group: [],
    groupExpansions: {},
    aggregations: {},

    pivotGroupExpansions: {},
    pivotMode: false,
    pivotModel: {
      columns: [],
      filters: {},
      filtersIn: {},
      rows: [],
      sorts: [],
      values: [],
    } satisfies ColumnPivotModel<T>,
  } satisfies DataRequestModel<T>);
  const model = makeGridAtom(model$, rdsStore);

  const pivotGroupExpansions = atom((g) => g(model$).pivotGroupExpansions);
  const rowGroupExpansions = atom((g) => g(model$).groupExpansions);
  const pivotMode = atom((g) => g(model$).pivotMode);

  const topData = atom<DataResponseLeafItem[]>([]);
  const botData = atom<DataResponseLeafItem[]>([]);

  const seenRequests = new Set<string>();

  const dataResponseHandler = (res: (DataResponse | DataResponsePinned)[]) => {
    const t = tree.get();
    const dataResponses = res.filter((r) => {
      return !("kind" in r && (r.kind === "top" || r.kind === "bottom"));
    }) as DataResponse[];
    dataResponses.sort((l, r) => l.path.length - r.path.length);

    const pinResponses = res.filter((r) => {
      return "kind" in r && (r.kind === "top" || r.kind === "bottom");
    }) as DataResponsePinned[];

    pinResponses.forEach((p) => {
      if (p.kind === "top") {
        rdsStore.set(topData, p.data);
      } else {
        rdsStore.set(botData, p.data);
      }
    });

    dataResponses.forEach((r) => {
      t.set({
        path: r.path,
        items: r.data.map<Required<SetDataAction>["items"][number]>((c, i) => {
          if (c.kind === "leaf") {
            return {
              kind: "leaf",
              data: c,
              relIndex: r.start + i,
            };
          } else {
            return {
              kind: "parent",
              data: c,
              path: c.key,
              relIndex: r.start + i,
              size: c.childCount,
            };
          }
        }),
        size: r.size,
      });
    });
  };

  const dataRequestHandler = async (p: DataRequest[], force = false, onSuccess?: () => void) => {
    if (!grid) return;

    const unseen = p.filter((x) => force || !seenRequests.has(x.id));

    unseen.forEach((x) => seenRequests.add(x.id));

    if (unseen.length === 0) {
      onSuccess?.();
      return;
    }

    try {
      const res = await dataFetcher({
        grid: grid,
        model: model.get(),
        reqTime: Date.now(),
        requests: p,
      });

      dataResponseHandler(res);

      onSuccess?.();
    } catch (e) {
      // Mark them as unseen since the request failed.
      unseen.forEach((x) => seenRequests.delete(x.id));

      console.error(e);
    } finally {
      rdsStore.set(snapshot$, Date.now());
      grid.state.rowDataStore.rowClearCache();
    }
  };

  const viewChange = () => {
    if (!grid) return;

    const bounds = grid.state.viewBounds.get();
    const f = flat.get();

    const te = bounds.rowTopEnd;

    const seen = new Set();

    const requests: DataRequest[] = [];

    for (let i = bounds.rowCenterStart - te; i < bounds.rowCenterEnd - te; i++) {
      const ranges = f.rangeTree.findRangesForRowIndex(i);
      ranges.forEach((c) => {
        if (c.parent.kind === "root") {
          const blockIndex = Math.floor(i / blockSize);

          const start = blockIndex * blockSize;
          const end = Math.min(start + blockSize, c.parent.size);

          const reqId = getRequestId([], start, end);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size = start + blockSize > c.parent.size ? c.parent.size - start : blockSize;

          requests.push({
            id: reqId,
            path: [],
            start,
            end,
            rowStartIndex: i,
            rowEndIndex: i + size,
          });
        } else {
          const blockIndex = Math.floor(c.parent.relIndex / blockSize);

          const start = blockIndex * blockSize;
          const end = Math.min(start + blockSize, c.parent.size);

          const path = getNodePath(c.parent);
          const reqId = getRequestId(path, start, end);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size = start + blockSize > c.parent.size ? c.parent.size - start : blockSize;

          requests.push({
            id: reqId,
            path,
            start,
            end,
            rowStartIndex: i,
            rowEndIndex: i + size,
          });
        }
      });
    }

    dataRequestHandler(requests);
  };

  const resetRequest = async () => {
    seenRequests.clear();
    tree.set(makeAsyncTree<DataResponseBranchItem, DataResponseLeafItem>());

    // Initialize the grid.
    const initialDataRequest: DataRequest = {
      path: [],
      id: getRequestId([], 0, blockSize),
      rowStartIndex: 0,
      rowEndIndex: blockSize,
      start: 0,
      end: blockSize,
    };

    isLoading.set(true);
    await dataRequestHandler([initialDataRequest]);
    isLoading.set(false);
  };

  const flat$ = atom((g) => {
    g(snapshot$);
    const mode = rdsStore.get(pivotMode);
    const expansions = mode ? g(pivotGroupExpansions) : g(rowGroupExpansions);
    const t = g(tree$);

    type RowItem = LeafOrParent<DataResponseBranchItem, DataResponseLeafItem>;

    const rowIdToRow = new Map<string, RowItem>();
    const rowIndexToRow = new Map<number, RowItem>();
    const rowIdToRowIndex = new Map<string, number>();

    const ranges: FlattenedRange[] = [];

    function processParent(
      node:
        | TreeRoot<DataResponseBranchItem, DataResponseLeafItem>
        | TreeParent<DataResponseBranchItem, DataResponseLeafItem>,
      start: number,
    ) {
      const rows = [...node.byIndex.values()].sort((l, r) => l.relIndex - r.relIndex);

      // Track the additional rows added by expanded groups
      let offset = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowIndex = row.relIndex + start + offset;

        rowIndexToRow.set(rowIndex, row);
        rowIdToRowIndex.set(row.data.id, rowIndex);
        rowIdToRow.set(row.data.id, row);

        if (row.kind === "parent" && expansions[row.data.id]) {
          offset += processParent(row, rowIndex + 1);
        }
      }

      ranges.push({ rowStart: start, rowEnd: offset + node.size + start, parent: node });

      return offset + node.size;
    }

    const size = processParent(t, 0);
    const rangeTree = new RangeTree(ranges);

    return {
      size,
      rowIndexToRow,
      rowIdToRow,
      rowIdToRowIndex,
      rangeTree,
    };
  });
  const flat = makeGridAtom(flat$, rdsStore);

  const cleanup: (() => void)[] = [];
  const init: RowDataSource<T>["init"] = (g) => {
    grid = g;

    const sorts = g.state.sortModel.get();

    const filters = g.state.filterModel.get();
    const filtersIn = g.state.filterInModel.get();
    const quickSearch = g.state.quickSearch.get();

    const group = g.state.rowGroupModel.get();
    const groupExpansions = g.state.rowGroupExpansions.get();
    const aggregations = g.state.aggModel.get();

    const pivotMode = g.state.columnPivotMode.get();
    const pivotModel = g.state.columnPivotModel.get();
    const pivotGroupExpansions = g.state.columnPivotRowGroupExpansions.get();

    rdsStore.set(model$, {
      sorts,
      filters,
      filtersIn,
      quickSearch,

      aggregations,
      group,
      groupExpansions,

      pivotMode,
      pivotModel,
      pivotGroupExpansions,
    });
    rdsStore.set(initialized, true);

    // Handle row count changes
    const f = flat.get();
    g.state.rowDataStore.rowCenterCount.set(f.size);
    g.state.rowDataStore.rowBottomCount.set(rdsStore.get(botData).length);
    g.state.rowDataStore.rowTopCount.set(rdsStore.get(topData).length);

    rdsStore.sub(flat$, () => {
      const f = flat.get();
      g.state.rowDataStore.rowCenterCount.set(f.size);
      viewChange();
    });
    rdsStore.sub(topData, () => {
      g.state.rowDataStore.rowTopCount.set(rdsStore.get(topData).length);
      g.state.rowDataStore.rowClearCache();
    });
    rdsStore.sub(botData, () => {
      g.state.rowDataStore.rowBottomCount.set(rdsStore.get(botData).length);
      g.state.rowDataStore.rowClearCache();
    });

    resetRequest();

    // Watch the view bound changes.
    g.state.viewBounds.watch(() => {
      viewChange();
    });

    let prevPivotColumnModel = pivotModel.columns;
    let prevPivotColumnValues = pivotModel.values;
    const updatePivotColumns = async (
      mdl: ColumnPivotModel<T>,
      ignoreEqualCheck: boolean = false,
    ) => {
      if (
        !ignoreEqualCheck &&
        equal(prevPivotColumnModel, mdl.columns) &&
        equal(prevPivotColumnValues, mdl.values)
      )
        return;

      const cols = await dataColumnPivotFetcher?.({
        grid: grid!,
        model: model.get(),
        reqTime: Date.now(),
      });
      if (cols) grid?.state.columnPivotColumns.set(cols);

      resetRequest();

      prevPivotColumnModel = mdl.columns;
      prevPivotColumnValues = mdl.values;
    };

    if (pivotMode) updatePivotColumns(pivotModel);

    // Make these deep equality checks
    cleanup.push(
      g.state.columnPivotMode.watch(() => {
        const model = g.state.columnPivotModel.get();
        updatePivotColumns(model, true);

        rdsStore.set(model$, (prev) => ({ ...prev, pivotMode: g.state.columnPivotMode.get() }));
        g.state.rowDataStore.rowClearCache();
      }),
    );
    cleanup.push(
      g.state.columnPivotModel.watch(() => {
        const model = g.state.columnPivotModel.get();
        updatePivotColumns(model);

        rdsStore.set(model$, (prev) => ({
          ...prev,
          pivotModel: model,
        }));

        g.state.rowDataStore.rowClearCache();
      }),
    );
    g.state.columnPivotRowGroupExpansions.watch(() => {
      rdsStore.set(model$, (prev) => ({
        ...prev,
        columnPivotGroupExpansions: g.state.columnPivotRowGroupExpansions.get(),
      }));
      grid?.state.rowDataStore.rowClearCache();
    });

    // Sort model monitoring
    cleanup.push(
      g.state.sortModel.watch(() => {
        rdsStore.set(model$, (prev) => ({ ...prev, sorts: g.state.sortModel.get() }));
        resetRequest();
      }),
    );

    // Filter model monitoring
    cleanup.push(
      g.state.filterModel.watch(() => {
        rdsStore.set(model$, (prev) => ({ ...prev, filters: g.state.filterModel.get() }));
        resetRequest();
      }),
    );
    cleanup.push(
      g.state.quickSearch.watch(() => {
        rdsStore.set(model$, (prev) => ({ ...prev, quickSearch: g.state.quickSearch.get() }));
        resetRequest();
      }),
    );
    cleanup.push(
      g.state.filterInModel.watch(() => {
        rdsStore.set(model$, (prev) => ({ ...prev, filtersIn: g.state.filterInModel.get() }));
        resetRequest();
      }),
    );

    // Row group model monitoring
    cleanup.push(
      g.state.rowGroupModel.watch(() => {
        rdsStore.set(model$, (prev) => ({ ...prev, group: g.state.rowGroupModel.get() }));
        resetRequest();
      }),
    );

    // Row group expansions monitoring
    cleanup.push(
      g.state.rowGroupExpansions.watch(() => {
        rdsStore.set(model$, (prev) => ({
          ...prev,
          groupExpansions: g.state.rowGroupExpansions.get(),
        }));
        grid?.state.rowDataStore.rowClearCache();
      }),
    );

    // Agg model monitoring
    cleanup.push(
      g.state.aggModel.watch(() => {
        rdsStore.set(model$, (prev) => ({ ...prev, agg: g.state.aggModel.get() }));
        resetRequest();
      }),
    );
  };

  const rowById: RowDataSource<T>["rowById"] = (id) => {
    const f = flat.get();

    const node = f.rowIdToRow.get(id);
    if (!node) {
      {
        const top = rdsStore.get(topData);
        const node = top.find((c) => c.id === id);
        if (node) return { kind: "leaf", data: node.data, id: node.id };
      }

      {
        const bot = rdsStore.get(topData);
        const node = bot.find((c) => c.id === id);
        if (node) return { kind: "leaf", data: node.data, id: node.id };
      }

      return null;
    }

    if (node.kind === "parent") {
      return {
        kind: "branch",
        data: node.data.data,
        id: node.data.id,
        key: node.path,
        depth: getNodeDepth(node),
      };
    }

    return {
      kind: "leaf",
      data: node.data.data as T,
      id: node.data.id,
    };
  };
  const rowAllChildIds: RowDataSource<T>["rowAllChildIds"] = (rowId) => {
    const f = flat.get();
    const row = f.rowIdToRow.get(rowId);
    if (!row || row.kind === "leaf") return [];

    const ids: Set<string> = new Set();
    const stack = [...row.byPath.values()];
    while (stack.length) {
      const item = stack.pop()!;

      if (item.kind === "leaf") {
        ids.add(item.data.id);
      } else {
        stack.push(...item.byPath.values());
        ids.add(item.data.id);
      }
    }
    return [...ids];
  };

  const rowByIndex: RowDataSource<T>["rowByIndex"] = (ri) => {
    const f = flat.get();

    const top = rdsStore.get(topData);
    const bot = rdsStore.get(botData);

    if (ri == null || ri < 0 || ri >= f.size + top.length + bot.length) return null;

    // Top node
    if (ri < top.length) {
      const row = top[ri];
      if (!row) return null;
      return { kind: "leaf", data: row.data, id: row.id };
    }

    if (ri >= f.size + top.length) {
      const i = ri - f.size - top.length;
      const row = bot[i];
      if (!row) return null;
      return { kind: "leaf", data: row.data, id: row.id };
    }

    const node = f.rowIndexToRow.get(ri - top.length);
    if (!node) return { kind: "leaf", data: null, id: `loading-${ri}`, loading: true, error: null };

    if (node.kind === "parent") {
      return {
        kind: "branch",
        data: node.data.data,
        id: node.data.id,
        key: node.path,
        depth: getNodeDepth(node),
      };
    }

    return {
      kind: "leaf",
      data: node.data.data as T,
      id: node.data.id,
    };
  };

  const rowExpand: RowDataSource<T>["rowExpand"] = (p) => {
    const f = flat.get();
    const requests = Object.entries(p)
      .map<DataRequest | null>(([rowId, state]) => {
        if (!state) return null;

        const rowIndex = rowToIndex(rowId);

        if (rowIndex == null) return null;
        const row = f.rowIndexToRow.get(rowIndex);
        if (!row || row.kind === "leaf") return null;

        const path = getNodePath(row);

        return {
          id: getRequestId(path, 0, Math.min(blockSize, row.size)),
          start: 0,
          end: Math.min(blockSize, row.size),
          path,
          rowStartIndex: rowIndex + 1,
          rowEndIndex: Math.min(row.size, rowIndex + blockSize + 1),
        };
      })
      .filter((c) => !!c);

    const mode = rdsStore.get(pivotMode);
    dataRequestHandler(requests, false, () => {
      if (mode) grid?.state.columnPivotColumnGroupExpansions.set((prev) => ({ ...prev, ...p }));
      else grid?.state.rowGroupExpansions.set((prev) => ({ ...prev, ...p }));
    });
  };

  const rowToIndex: RowDataSource<T>["rowToIndex"] = (rowId) => {
    const f = flat.get();
    return f.rowIdToRowIndex.get(rowId) ?? null;
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

    const t = flat.get();
    grid.state.rowSelectedIds.set(new Set(t.rowIdToRow.keys()));
  };

  const rowSetBotData: RowDataSource<T>["rowSetBotData"] = () => {
    throw new Error(
      `Server data source does not support directly setting pinned rows. Instead send a DataResponsePinned object via the pushData method`,
    );
  };
  const rowSetTopData: RowDataSource<T>["rowSetTopData"] = () => {
    throw new Error(
      `Server data source does not support directly setting pinned rows. Instead send a DataResponsePinned object via the pushData method`,
    );
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
    const f = flat.get();

    const top = rdsStore.get(topData);
    const bot = rdsStore.get(botData);

    const firstBot = f.size + top.length;

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

    for (const [key, data] of updates.entries()) {
      const rowIndex = typeof key === "number" ? key : (rowToIndex(key) as number);

      const row = rowByIndex(rowIndex!);
      if (!row || !grid) {
        console.error(`Failed to find the row at index ${rowIndex} which is being updated.`);
        continue;
      }

      if (rowIndex < top.length) {
        (top[rowIndex] as any).data = data;
      } else if (rowIndex >= firstBot) {
        (bot[rowIndex] as any).data = data;
      } else {
        const node = f.rowIndexToRow.get(rowIndex - top.length);
        if (node) (node.data as any).data = data;
      }

      grid.state.rowDataStore.rowInvalidateIndex(rowIndex);
    }
  };

  const inFilterItems: RowDataSource<T>["inFilterItems"] = (c) => {
    if (!dataInFilterItemFetcher || !grid) return [];

    return dataInFilterItemFetcher({ column: c, grid, reqTime: Date.now() });
  };

  const rowAreAllSelected: RowDataSource<T>["rowAreAllSelected"] = () => {
    return false;
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
    rowSetTopData,
    rowToIndex,
    rowUpdate,

    inFilterItems,
    rowAreAllSelected,

    isLoading,
    pushResponses: (res) => {
      dataResponseHandler(res);
    },
    pushRequests: (req, onSuccess) => {
      dataRequestHandler(req, true, onSuccess);
    },
    reset: resetRequest,
  };
}

export function useServerDataSource<T>(p: RowDataSourceServerParams<T>) {
  const ds = useRef<RowDataSourceServer<T>>(null as any);

  if (!ds.current) {
    ds.current = makeServerDataSource(p);
  }

  return ds.current;
}
