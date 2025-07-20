import { atom, createStore } from "@1771technologies/atom";
import type { ColumnPivotModel, Grid, RowDataSource } from "../+types";
import { useRef } from "react";
import { makeAsyncTree } from "./async-tree/make-async-tree";
import type {
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

export interface ServerDataSourceParams<T> {
  readonly dataFetcher: DataFetcher<T>;
  readonly pageSize?: number;
}

export function makeServerDataSource<T>({
  dataFetcher,
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

  const makeGlobalRequest = async (p: DataRequest[]) => {
    if (!grid) return;

    const t = tree.get();

    try {
      isLoading.set(true);
      const res = await dataFetcher({
        grid,
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
    } catch {
      // TODO Handle request error
    } finally {
      isLoading.set(false);
      rdsStore.set(snapshot$, Date.now());
    }
  };

  const flat$ = atom((g) => {
    g(snapshot$);
    const t = g(tree$);

    type RowItem = LeafOrParent<DataResponseBranchItem, DataResponseLeafItem>;

    const rowIdToRow = new Map<string, RowItem>();
    const rowIndexToRow = new Map<number, RowItem>();
    const rowIdToRowIndex = new Map<string, number>();

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
        const rowIndex = i + start + offset;
        const row = rows[i];

        rowIndexToRow.set(rowIndex, row);
        rowIdToRowIndex.set(row.data.id, rowIndex);
        rowIdToRow.set(row.data.id, row);

        if (row.kind === "parent") {
          offset += processParent(row, rowIndex + 1);
        }
      }

      return offset + node.size;
    }

    const size = processParent(t, 0);

    return {
      size,
      rowIndexToRow,
      rowIdToRow,
      rowIdToRowIndex,
    };
  });
  const flat = makeGridAtom(flat$, rdsStore);

  const init: RowDataSource<T>["init"] = (g) => {
    grid = g;

    const sorts = grid.state.sortModel.get();

    const filters = grid.state.filterModel.get();
    const quickSearch = grid.state.quickSearch.get();

    const group = grid.state.rowGroupModel.get();
    const groupExpansions = grid.state.rowGroupExpansions.get();
    const aggregations = grid.state.aggModel.get();

    const pivotMode = grid.state.columnPivotMode.get();
    const pivotModel = grid.state.columnPivotModel.get();
    const pivotGroupExpansions = grid.state.columnPivotRowGroupExpansions.get();

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

    // Initialize the grid.
    const initialDataRequest: DataRequest = {
      path: [],
      id: "__ROOT__INIT",
      rowStartIndex: 0,
      rowEndIndex: pageSize,
      start: 0,
      end: pageSize,
    };

    makeGlobalRequest([initialDataRequest]);

    rdsStore.sub(flat$, () => {
      const f = rdsStore.get(flat$);
      g.state.rowDataStore.rowCenterCount.set(f.size);
    });
  };

  const rowById: RowDataSource<T>["rowById"] = () => {
    return null;
  };
  const rowAllChildIds: RowDataSource<T>["rowAllChildIds"] = () => {
    return [];
  };

  const rowByIndex: RowDataSource<T>["rowByIndex"] = (ri) => {
    const f = flat.get();

    const node = f.rowIndexToRow.get(ri);

    console.log(ri);

    if (!node) {
      return { kind: "leaf", data: null as T, id: `loading-${ri}`, loading: true, error: null };
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

  const rowExpand: RowDataSource<T>["rowExpand"] = () => {};
  const rowSelect: RowDataSource<T>["rowSelect"] = () => {};
  const rowSelectAll: RowDataSource<T>["rowSelectAll"] = () => {};
  const rowSetBotData: RowDataSource<T>["rowSetBotData"] = () => {};
  const rowSetTopData: RowDataSource<T>["rowSetTopData"] = () => {};
  const rowToIndex: RowDataSource<T>["rowToIndex"] = () => {
    return null;
  };

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
