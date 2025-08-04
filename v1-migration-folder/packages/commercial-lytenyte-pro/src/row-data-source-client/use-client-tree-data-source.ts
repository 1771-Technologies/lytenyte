import type {
  GridAtom,
  RowLeaf,
  SortModelItem,
  FilterModelItem,
  FieldDataParam,
  AggModelFn,
  RowDataSourceClient,
  FilterInFilterItem,
  ClientTreeDataSourceParams,
} from "../+types";
import { type Grid, type RowNode } from "../+types";
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
import { equal } from "@1771technologies/lytenyte-js-utils";
import { makeClientTree, type ClientData } from "./tree/client-tree";
import { computeFilteredRows } from "./filter/compute-filtered-rows";
import { builtIns } from "./built-ins/built-ins";

interface DataAtoms<T> {
  readonly top: GridAtom<T[]>;
  readonly center: GridAtom<T[]>;
  readonly bottom: GridAtom<T[]>;
}

export function makeClientTreeDataSource<T>(
  p: ClientTreeDataSourceParams<T>,
): [RowDataSourceClient<T>, DataAtoms<T>] {
  const rdsStore = createStore();

  const data = atom(p.data);
  const topData = atom(p.topData ?? []);
  const bottomData = atom(p.bottomData ?? []);

  const cache = new Map<number, RowLeaf<T>>();
  const centerNodes = atom((g) => {
    const nodes: RowLeaf<T>[] = [];
    const d = g(data);
    for (let i = 0; i < d.length; i++) {
      if (!cache.has(i)) {
        cache.set(i, {
          id: "",
          kind: "leaf",
          data: d[i],
        });
      }
      const node = cache.get(i)!;
      (node as any).data = d[i];

      nodes.push(node);
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
    quickSearch: string | null;
    groupExpansions: { [rowId: string]: boolean | undefined };
    columnPivotGroupExpansions: { [rowId: string]: boolean | undefined };
    agg: Record<string, { fn: AggModelFn<T> }>;
    sort: SortModelItem<T>[];
  }>({
    sort: [],
    filter: [],
    quickSearch: null,
    agg: {},
    groupExpansions: {},
    columnPivotGroupExpansions: {},
  });

  const sortModel = atom<SortModelItem<T>[]>((g) => g(models).sort);
  const filterModel = atom<FilterModelItem<T>[]>((g) => g(models).filter);
  const groupExpansions = atom<{ [rowId: string]: boolean | undefined }>(
    (g) => g(models).groupExpansions,
  );
  const aggModel = atom<Record<string, { fn: AggModelFn<T> }>>((g) => g(models).agg);
  const quickSearch = atom((g) => g(models).quickSearch);

  const grid$ = atom<Grid<T> | null>(null);
  const snapshot = atom<number>(0);

  const tree = atom<ClientData<RowLeaf<T>>>((g) => {
    g(snapshot);

    const grid = g(grid$);

    const rows = g(centerNodes);
    const filtered = computeFilteredRows(
      rows,
      grid,
      g(filterModel),
      g(quickSearch),
      grid?.state.quickSearchSensitivity.get() ?? "case-sensitive",
    );

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
      rowBranchModel: p.getPathFromData,
      rowIdGroup: p.rowIdBranch,
      rowIdLeaf: p.rowIdLeaf,
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
          l.kind === 2
            ? { kind: "branch", data: l.data, key: l.key }
            : { kind: "leaf", data: l.data.data };
        const rd: FieldDataParam<T> =
          r.kind === 2
            ? { kind: "branch", data: r.data, key: r.key }
            : { kind: "leaf", data: r.data.data };

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
        const centerCount = rdsStore.get(flatLength);
        store.rowCenterCount.set(centerCount);

        grid.state.rowDataStore.rowClearCache();
      }),
    );

    const top = rdsStore.get(topData).length;
    store.rowTopCount.set(top);
    cleanup.push(
      rdsStore.sub(topData, () => {
        const top = rdsStore.get(topData).length;
        store.rowTopCount.set(top);

        grid.state.rowDataStore.rowClearCache();
      }),
    );

    const bottom = rdsStore.get(bottomData).length;
    store.rowBottomCount.set(bottom);
    cleanup.push(
      rdsStore.sub(bottomData, () => {
        const bot = rdsStore.get(bottomData).length;
        store.rowBottomCount.set(bot);

        grid.state.rowDataStore.rowClearCache();
      }),
    );

    const sort = grid.state.sortModel.get();
    const filter = grid.state.filterModel.get();
    const groupExpansions = grid.state.rowGroupExpansions.get();
    const agg = grid.state.aggModel.get();
    const quickSearch = grid.state.quickSearch.get();
    const columnPivotGroupExpansions = grid.state.columnPivotRowGroupExpansions.get();

    rdsStore.set(models, {
      agg,
      filter,
      quickSearch,
      groupExpansions,
      sort,
      columnPivotGroupExpansions,
    });
    rdsStore.set(initialized, true);

    // Sort model monitoring
    cleanup.push(
      grid.state.sortModel.watch(() => {
        rdsStore.set(models, (prev) => ({ ...prev, sort: grid.state.sortModel.get() }));
        grid.state.rowDataStore.rowClearCache();
      }),
    );

    // Filter model monitoring
    cleanup.push(
      grid.state.filterModel.watch(() => {
        rdsStore.set(models, (prev) => ({ ...prev, filter: grid.state.filterModel.get() }));
        grid.state.rowDataStore.rowClearCache();
      }),
    );
    cleanup.push(
      grid.state.quickSearch.watch(() => {
        rdsStore.set(models, (prev) => ({ ...prev, quickSearch: grid.state.quickSearch.get() }));
        grid.state.rowDataStore.rowClearCache();
      }),
    );

    // Row group model monitoring
    cleanup.push(
      grid.state.rowGroupModel.watch(() => {
        rdsStore.set(models, (prev) => ({ ...prev, group: grid.state.rowGroupModel.get() }));
        grid.state.rowDataStore.rowClearCache();
      }),
    );

    // Row group expansions monitoring
    cleanup.push(
      grid.state.rowGroupExpansions.watch(() => {
        rdsStore.set(models, (prev) => ({
          ...prev,
          groupExpansions: grid.state.rowGroupExpansions.get(),
        }));
        grid.state.rowDataStore.rowClearCache();
      }),
    );

    // Agg model monitoring
    cleanup.push(
      grid.state.aggModel.watch(() => {
        rdsStore.set(models, (prev) => ({ ...prev, agg: grid.state.aggModel.get() }));
        grid.state.rowDataStore.rowClearCache();
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

  const rowUpdate = (updates: Map<string | number, any>) => {
    const grid = rdsStore.get(grid$)!;
    const t = rdsStore.get(tree);

    const d = rdsStore.get(data);
    for (const [key, data] of updates.entries()) {
      const rowIndex = typeof key === "number" ? key : rowToIndex(key);

      const row = rowByIndex(rowIndex);
      if (!row || !grid) {
        console.error(`Failed to find the row at index ${rowIndex} which is being updated.`);
        continue;
      }

      if (row.kind === "branch") {
        (row as any).data = data;
      } else {
        const source = t.idToSourceIndex.get(row.id);
        if (source == null) {
          console.error(`Failed to find the row at index ${rowIndex} which is being updated.`);
          continue;
        }

        d[source] = data;
      }

      grid.state.rowDataStore.rowInvalidateIndex(rowIndex);
    }

    rdsStore.set(data, [...d]);
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

      inFilterItems: (c) => {
        const grid = rdsStore.get(grid$);

        if (!grid) return [];

        const data = rdsStore.get(centerNodes);

        const values = new Set(
          data.map((row) => {
            const field = grid.api.columnField(c, row);
            return field;
          }),
        );

        return [...values].map<FilterInFilterItem>((x) => {
          if (!p.transformInFilterItem) return { id: `${x}`, label: `${x}`, value: x };

          return p.transformInFilterItem({ field: x, column: c });
        });
      },

      rowAdd: (newRows, place = "end") => {
        rdsStore.set(data, (prev) => {
          if (!newRows.length) return prev;

          let next: any[];
          if (place === "beginning") next = [...newRows, ...prev];
          else if (place === "end") next = [...prev, ...newRows];
          else {
            next = [...prev];
            next.splice(place, 0, ...newRows);
          }

          return next;
        });

        const grid = rdsStore.get(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },

      rowDelete: (rows) => {
        const rowData = new Set(
          rows
            .map((c) => {
              if (typeof c === "number") return rowByIndex(c)?.data;
              else return rowById(c)?.data;
            })
            .filter((c) => !!c),
        );

        rdsStore.set(data, (prev) => {
          if (!rowData.size) return prev;
          return prev.filter((d) => !rowData.has(d));
        });

        const grid = rdsStore.get(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowSetBotData: (data: any[]) => {
        rdsStore.set(bottomData, data);
        const grid = rdsStore.get(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowSetTopData: (data: any[]) => {
        rdsStore.set(topData, data);
        const grid = rdsStore.get(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },

      rowExpand: (expansions) => {
        const grid = rdsStore.get(grid$);
        if (!grid) return;

        const mode = grid.state.columnPivotMode.get();

        if (mode)
          grid.state.columnPivotRowGroupExpansions.set((prev) => ({ ...prev, ...expansions }));
        else grid.state.rowGroupExpansions.set((prev) => ({ ...prev, ...expansions }));
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

      rowAreAllSelected: (rowId) => {
        const g = rdsStore.get(grid$);
        if (!g) return false;

        const selected = g.state.rowSelectedIds.get();

        if (rowId) {
          const row = rowById(rowId);
          if (!row) return false;
          const childIds = new Set(rowAllChildIds(rowId));
          return childIds.isSubsetOf(selected);
        }

        const f = rdsStore.get(tree);
        return f.idsAll.isSubsetOf(selected);
      },
    },
    {
      top: makeGridAtom(topData, rdsStore),
      center: makeGridAtom(data, rdsStore),
      bottom: makeGridAtom(bottomData, rdsStore),
    },
  ];
}

export function useClientTreeDataSource<T>(p: ClientTreeDataSourceParams<T>) {
  const ds = useRef<RowDataSourceClient<T>>(null as any);
  const dataAtomRef = useRef<DataAtoms<T>>(null as any);

  if (!ds.current) [ds.current, dataAtomRef.current] = makeClientTreeDataSource(p);

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
