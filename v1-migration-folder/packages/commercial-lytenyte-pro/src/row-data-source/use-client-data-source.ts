import type {
  GridAtom,
  RowLeaf,
  SortModelItem,
  FilterModelItem,
  RowGroupModelItem,
  FieldRowGroupFn,
  FieldPath,
  FieldDataParam,
  AggModelFn,
  RowUpdateParams,
  RowDataSourceClient,
} from "../+types";
import { type ClientRowDataSourceParams, type Grid, type RowNode } from "../+types";
import { useRef } from "react";
import { atom, createStore } from "@1771technologies/atom";
import { traverse } from "./tree/traverse";
import type { TreeNode } from "./+types";
import {
  dateComparator,
  makeGridAtom,
  numberComparator,
  stringComparator,
} from "@1771technologies/lytenyte-shared";
import { equal, get } from "@1771technologies/lytenyte-js-utils";
import { makeClientTree, type ClientData } from "./tree/client-tree";
import { computeFilteredRows } from "./filter/compute-filtered-rows";
import { builtIns } from "./built-ins/built-ins";

interface DataAtoms<T> {
  readonly top: GridAtom<T[]>;
  readonly center: GridAtom<T[]>;
  readonly bottom: GridAtom<T[]>;
}

export function makeClientDataSource<T>(
  p: ClientRowDataSourceParams<T>,
): [RowDataSourceClient<T>, DataAtoms<T>] {
  const rdsStore = createStore();

  const data = atom(p.data);
  const topData = atom(p.topData ?? []);
  const bottomData = atom(p.bottomData ?? []);

  const centerNodes = atom((g) => {
    const nodes: RowLeaf<T>[] = [];
    const d = g(data);
    for (let i = 0; i < d.length; i++) {
      nodes.push({
        id: "",
        kind: "leaf",
        data: d[i],
      });
    }
    return nodes;
  });

  const topNodes = atom((g) => {
    return g(topData).map<RowLeaf<T>>((c, i) => ({ data: c, id: `top-${i}`, kind: "leaf" }));
  });
  const botNodes = atom((g) => {
    return g(bottomData).map<RowLeaf<T>>((c, i) => ({ data: c, id: `bottom-${i}`, kind: "leaf" }));
  });

  const pinnedIdMap = atom((g) => {
    const combined = new Map([...g(topNodes), ...g(botNodes)].map((c) => [c.id, c]));
    return combined;
  });

  const models = atom<{
    filter: FilterModelItem<T>[];
    group: RowGroupModelItem<T>[];
    groupExpansions: { [rowId: string]: boolean | undefined };
    agg: Record<string, { fn: AggModelFn<T> }>;
    sort: SortModelItem<T>[];
  }>({
    sort: [],
    filter: [],
    agg: {},
    group: [],
    groupExpansions: {},
  });

  const sortModel = atom<SortModelItem<T>[]>((g) => g(models).sort);
  const filterModel = atom<FilterModelItem<T>[]>((g) => g(models).filter);
  const rowGroupModel = atom<RowGroupModelItem<T>[]>((g) => g(models).group);
  const groupExpansions = atom<{ [rowId: string]: boolean | undefined }>(
    (g) => g(models).groupExpansions,
  );
  const aggModel = atom<Record<string, { fn: AggModelFn<T> }>>((g) => g(models).agg);

  const grid$ = atom<Grid<T> | null>(null);
  const snapshot = atom<number>(0);
  const tree = atom<ClientData<RowLeaf<T>>>((g) => {
    g(snapshot);

    const grid = g(grid$);

    const rows = g(centerNodes);
    const filtered = computeFilteredRows(rows, grid, g(filterModel));

    const rowGroups = g(rowGroupModel)
      .map((c) => {
        if (typeof c === "string")
          return (r: RowLeaf<T>) => grid!.api.columnField(c, { kind: "leaf", data: r.data });

        if (typeof c.field === "string" || typeof c.field === "number")
          return (r: RowLeaf<T>) => (r.data as any)[c.field as any];

        if (typeof c.field === "function")
          return (r: RowLeaf<T>) => (c.field as FieldRowGroupFn<T>)({ data: r.data, grid: grid! });

        return (r: RowLeaf<T>) => get(r.data, (c.field as FieldPath).path as string);
      })
      .map((c) => ({ fn: c }));

    const rowAggModel = Object.entries(g(aggModel)).map(([name, agg]) => {
      if (typeof agg.fn === "function") {
        const fn = agg.fn;
        return {
          name,
          fn: (rows: RowLeaf<T>[]) =>
            fn(
              rows.map((c) => c.data),
              grid!,
            ),
        };
      }

      const key = agg.fn;
      const fn = (data: RowLeaf<T>[]) => {
        const fieldData = data.map((r) =>
          grid?.api.columnField(name, { kind: "leaf", data: r.data }),
        );
        return builtIns[key as keyof typeof builtIns](fieldData as any);
      };

      return { name, fn };
    });

    return makeClientTree({
      rowData: filtered,
      rowAggModel: grid ? rowAggModel : [],
      rowBranchModel: grid ? rowGroups : [],
    });
  });

  const sortComparator = atom((g) => {
    const model = g(sortModel);
    const grid = g(grid$);
    if (!model.length || !grid) return () => 0;

    const comparator = (l: TreeNode<RowLeaf<T>>, r: TreeNode<RowLeaf<T>>) => {
      let res = 0;
      for (const sortSpec of model) {
        const sort = sortSpec.sort;
        const columnId = sortSpec.columnId;

        const ld: FieldDataParam<T> =
          l.kind === 2 ? { kind: "branch", data: l.data } : { kind: "leaf", data: l.data.data };
        const rd: FieldDataParam<T> =
          r.kind === 2 ? { kind: "branch", data: r.data } : { kind: "leaf", data: r.data.data };

        if (sort.kind === "custom") {
          res = sort.comparator(ld, rd, sort.options ?? {});
        } else if (sort.kind === "number") {
          const left = grid.api.columnField(columnId!, ld);
          const right = grid.api.columnField(columnId!, rd);
          res = numberComparator(left as number, right as number, sort.options ?? {});
        } else if (sort.kind === "date") {
          const left = grid.api.columnField(columnId!, ld);
          const right = grid.api.columnField(columnId!, rd);
          res = dateComparator(left as string, right as string, sort.options ?? {});
        } else if (sort.kind === "string") {
          const left = grid.api.columnField(columnId!, ld);
          const right = grid.api.columnField(columnId!, rd);
          res = stringComparator(left as string, right as string, sort.options ?? {});
        } else {
          res = 0;
        }
        res = sortSpec.isDescending ? -res : res;

        if (res !== 0) break;
      }

      return res;
    };

    return comparator;
  });

  const initialized = atom(false);
  const flat = atom((g) => {
    if (!g(initialized)) return { flat: [], idMap: new Map(), idToIndexMap: new Map() };

    const idMap = new Map<string, RowNode<T>>();
    const idToIndexMap = new Map<string, number>();

    const flattened: RowNode<T>[] = [];
    const comparator = g(sortComparator);

    const expansions = g(groupExpansions);
    const defaultExpansion = g(grid$)?.state.rowGroupDefaultExpansion.get() ?? false;

    let index = g(topNodes).length;

    traverse(
      g(tree).root,
      (node) => {
        if (node.kind === 1) {
          (node.data as any).id = node.id;
          flattened.push(node.data);
        } else {
          flattened.push({
            kind: "branch",
            data: node.data,
            id: node.id,
            key: node.key,
            depth: node.depth,
          });
        }
        idMap.set(node.id, flattened.at(-1)!);
        idToIndexMap.set(node.id, index);
        index++;

        if (node.kind === 2) {
          const expanded =
            expansions[node.id] ??
            (typeof defaultExpansion === "number"
              ? node.depth <= defaultExpansion
              : defaultExpansion);

          return expanded;
        }
      },
      comparator,
    );

    return { flat: flattened, idMap, idToIndexMap };
  });
  const flatLength = atom((g) => g(flat).flat.length);

  const cleanup: (() => void)[] = [];
  const init = (grid: Grid<T>) => {
    while (cleanup.length) cleanup.pop()?.();

    rdsStore.set(grid$, grid);

    const store = grid.state.rowDataStore;

    // Monitor row count changes
    const centerCount = rdsStore.get(flatLength);
    store.rowCenterCount.set(centerCount);
    cleanup.push(
      rdsStore.sub(flatLength, () => {
        grid.state.rowDataStore.rowClearCache();

        const centerCount = rdsStore.get(flatLength);
        store.rowCenterCount.set(centerCount);
      }),
    );

    const top = rdsStore.get(topData).length;
    store.rowTopCount.set(top);
    cleanup.push(
      rdsStore.sub(topData, () => {
        grid.state.rowDataStore.rowClearCache();

        const top = rdsStore.get(topData).length;
        store.rowTopCount.set(top);
      }),
    );

    const bottom = rdsStore.get(bottomData).length;
    store.rowBottomCount.set(bottom);
    cleanup.push(
      rdsStore.sub(bottomData, () => {
        grid.state.rowDataStore.rowClearCache();

        const bot = rdsStore.get(bottomData).length;
        store.rowBottomCount.set(bot);
      }),
    );

    const sort = grid.state.sortModel.get();
    const filter = grid.state.filterModel.get();
    const group = grid.state.rowGroupModel.get();
    const groupExpansions = grid.state.rowGroupExpansions.get();
    const agg = grid.state.aggModel.get();

    rdsStore.set(models, { agg, filter, group, groupExpansions, sort });
    rdsStore.set(initialized, true);

    // Sort model monitoring
    cleanup.push(
      grid.state.sortModel.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(models, (prev) => ({ ...prev, sort: grid.state.sortModel.get() }));
      }),
    );

    // Filter model monitoring
    cleanup.push(
      grid.state.filterModel.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(models, (prev) => ({ ...prev, filter: grid.state.filterModel.get() }));
      }),
    );

    // Row group model monitoring
    cleanup.push(
      grid.state.rowGroupModel.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(models, (prev) => ({ ...prev, group: grid.state.rowGroupModel.get() }));
      }),
    );

    // Row group expansions monitoring
    cleanup.push(
      grid.state.rowGroupExpansions.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(models, (prev) => ({
          ...prev,
          groupExpansions: grid.state.rowGroupExpansions.get(),
        }));
      }),
    );

    // Agg model monitoring
    cleanup.push(
      grid.state.aggModel.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(models, (prev) => ({ ...prev, agg: grid.state.aggModel.get() }));
      }),
    );
  };

  const rowById = (id: string) => {
    const pinned = rdsStore.get(pinnedIdMap);
    if (pinned.has(id)) return pinned.get(id)!;

    const t = rdsStore.get(flat);
    return t.idMap.get(id) ?? null;
  };
  const rowByIndex = (index: number) => {
    const top = rdsStore.get(topNodes);
    const bot = rdsStore.get(botNodes);
    const center = rdsStore.get(flat).flat;

    const topOffset = top.length;
    const centerOffset = topOffset + center.length;
    const botOffset = centerOffset + bot.length;

    if (index < topOffset) return top[index];
    if (index < centerOffset) return center[index - topOffset];
    if (index < botOffset) return bot[index - centerOffset];

    return null;
  };

  const rowUpdate = ({ rowIndex, data }: RowUpdateParams) => {
    const grid = rdsStore.get(grid$)!;
    const row = rowByIndex(rowIndex);
    if (!row || !grid) {
      console.error(`Failed to find the row at index ${rowIndex} which is being updated.`);
      return;
    }

    (row as any).data = data;

    grid.state.rowDataStore.rowInvalidateIndex(rowIndex);

    rdsStore.set(snapshot, (prev) => prev + 1);
  };

  const rowToIndex = (rowId: string) => {
    const f = rdsStore.get(flat);

    const top = rdsStore.get(topNodes);
    const bot = rdsStore.get(botNodes);

    const topCount = top.length;
    const center = f.flat.length;

    const rowIndex = f.idToIndexMap.get(rowId);
    if (rowIndex != null) return rowIndex;

    if (rowIndex == null) {
      const foundTop = top.findIndex((row) => row.id === rowId);
      if (foundTop !== -1) return foundTop;

      const foundBot = bot.findIndex((row) => row.id === rowId);
      if (foundBot !== -1) return foundBot + topCount + center;
    }

    return null;
  };

  const rowAllChildIds = (rowId: string) => {
    const t = rdsStore.get(tree);

    const ids: string[] = [];
    const node = t.idToNode.get(rowId);

    if (node?.kind === 2) {
      traverse(node, (n) => {
        ids.push(n.id);
      });
    }

    return ids;
  };

  return [
    {
      init,
      rowById,
      rowByIndex,
      rowAllChildIds,
      rowUpdate,
      rowExpand: (expansions) => {
        const grid = rdsStore.get(grid$);
        if (!grid) return;

        grid.state.rowGroupExpansions.set((prev) => ({ ...prev, ...expansions }));
      },
      rowToIndex,

      rowSelect: (params) => {
        const grid = rdsStore.get(grid$);
        if (!grid) return;

        if (params.mode === "none") return;
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
      },
      rowSelectAll: (params) => {
        const grid = rdsStore.get(grid$);
        if (!grid) return;
        if (params.deselect) {
          grid.state.rowSelectedIds.set(new Set());
          return;
        }

        const t = rdsStore.get(tree);
        grid.state.rowSelectedIds.set(new Set(t.idsAll));
      },
    },
    {
      top: makeGridAtom(topData, rdsStore),
      center: makeGridAtom(data, rdsStore),
      bottom: makeGridAtom(bottomData, rdsStore),
    },
  ];
}

export function useClientRowDataSource<T>(p: ClientRowDataSourceParams<T>) {
  const ds = useRef<RowDataSourceClient<T>>(null as any);
  const dataAtomRef = useRef<DataAtoms<T>>(null as any);

  if (!ds.current) [ds.current, dataAtomRef.current] = makeClientDataSource(p);

  const da = dataAtomRef.current;
  if (p.reflectData) {
    // Need to queue the microtask since it we cannot update state during render.
    if (p.data !== da.center.get()) queueMicrotask(() => da.center.set(p.data));
    if (!equal(p.topData ?? [], da.top.get())) {
      queueMicrotask(() => da.top.set(p.topData ?? []));
    }
    if (!equal(p.bottomData ?? [], da.bottom.get()))
      queueMicrotask(() => da.bottom.set(p.bottomData ?? []));
  }

  return ds.current;
}
