import { atom, createStore } from "@1771technologies/atom";
import type { ColumnPivotModel, Grid, RowDataSource } from "../+types";
import { useRef } from "react";
import { makeAsyncTree } from "./async-tree/make-async-tree";
import type {
  DataColumnPivotFetcher,
  DataFetcher,
  DataRequest,
  DataRequestModel,
  DataResponseBranchItem,
  DataResponseLeafItem,
  ServerRowDataSource,
} from "./+types";
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

export interface ServerDataSourceParams<T> {
  readonly dataFetcher: DataFetcher<T>;
  readonly dataColumnPivotFetcher?: DataColumnPivotFetcher<T>;

  readonly pageSize?: number;
}

export function makeServerDataSource<T>({
  dataFetcher,
  dataColumnPivotFetcher,
  pageSize = 200,
}: ServerDataSourceParams<T>): ServerRowDataSource<T> {
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
    filters: [],
    quickSearch: null,

    group: [],
    groupExpansions: {},
    aggregations: {},

    pivotGroupExpansions: {},
    pivotMode: false,
    pivotModel: {
      columns: [],
      filters: [],
      rows: [],
      sorts: [],
      values: [],
    } satisfies ColumnPivotModel<T>,
  } satisfies DataRequestModel<T>);
  const model = makeGridAtom(model$, rdsStore);

  const rowGroupExpansions = atom((g) => g(model$).groupExpansions);

  const seenRequests = new Set<string>();

  const dataRequestHandler = async (p: DataRequest[], force = false, onSuccess?: () => void) => {
    if (!grid) return;

    const unseen = p.filter((x) => force || !seenRequests.has(x.id));

    unseen.forEach((x) => seenRequests.add(x.id));

    if (unseen.length === 0) {
      onSuccess?.();
      return;
    }

    const t = tree.get();

    try {
      const res = await dataFetcher({
        grid: grid,
        model: model.get(),
        reqTime: Date.now(),
        requests: p,
      });
      res.sort((l, r) => l.path.length - r.path.length);

      res.forEach((r) => {
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
          const blockIndex = Math.floor(i / pageSize);

          const start = blockIndex * pageSize;
          const end = Math.min(start + pageSize, c.parent.size);

          const reqId = getRequestId([], start, end);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size = start + pageSize > c.parent.size ? c.parent.size - start : pageSize;

          requests.push({
            id: reqId,
            path: [],
            start,
            end,
            rowStartIndex: i,
            rowEndIndex: i + size,
          });
        } else {
          const blockIndex = Math.floor(c.parent.relIndex / pageSize);

          const start = blockIndex * pageSize;
          const end = Math.min(start + pageSize, c.parent.size);

          const path = getNodePath(c.parent);
          const reqId = getRequestId(path, start, end);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size = start + pageSize > c.parent.size ? c.parent.size - start : pageSize;

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
      id: getRequestId([], 0, pageSize),
      rowStartIndex: 0,
      rowEndIndex: pageSize,
      start: 0,
      end: pageSize,
    };

    isLoading.set(true);
    await dataRequestHandler([initialDataRequest]);
    isLoading.set(false);
  };

  const flat$ = atom((g) => {
    g(snapshot$);
    const expansions = g(rowGroupExpansions);
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
    rdsStore.sub(flat$, () => {
      const f = flat.get();
      g.state.rowDataStore.rowCenterCount.set(f.size);
      viewChange();
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
    if (!node) return null;

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
  const rowAllChildIds: RowDataSource<T>["rowAllChildIds"] = () => {
    return [];
  };

  const rowByIndex: RowDataSource<T>["rowByIndex"] = (ri) => {
    const f = flat.get();
    const node = f.rowIndexToRow.get(ri);

    if (!node) {
      return { kind: "leaf", data: null, id: `loading-${ri}`, loading: true, error: null };
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
          id: getRequestId(path, 0, Math.min(pageSize, row.size)),
          start: 0,
          end: Math.min(pageSize, row.size),
          path,
          rowStartIndex: rowIndex + 1,
          rowEndIndex: Math.min(row.size, rowIndex + pageSize + 1),
        };
      })
      .filter((c) => !!c);

    dataRequestHandler(requests, false, () => {
      grid?.state.rowGroupExpansions.set((prev) => ({ ...prev, ...p }));
    });
  };

  const rowToIndex: RowDataSource<T>["rowToIndex"] = (rowId) => {
    const f = flat.get();
    return f.rowIdToRowIndex.get(rowId) ?? null;
  };

  const rowSelect: RowDataSource<T>["rowSelect"] = () => {};
  const rowSelectAll: RowDataSource<T>["rowSelectAll"] = () => {};
  const rowSetBotData: RowDataSource<T>["rowSetBotData"] = () => {};
  const rowSetTopData: RowDataSource<T>["rowSetTopData"] = () => {};

  // CRUD ops
  const rowAdd: RowDataSource<T>["rowAdd"] = () => {};
  const rowDelete: RowDataSource<T>["rowDelete"] = () => {};
  const rowUpdate: RowDataSource<T>["rowUpdate"] = () => {
    return;
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

    isLoading,
  };
}

export function useServerDataSource<T>(p: ServerDataSourceParams<T>) {
  const ds = useRef<ServerRowDataSource<T>>(null as any);

  if (!ds.current) {
    ds.current = makeServerDataSource(p);
  }

  return ds.current;
}
