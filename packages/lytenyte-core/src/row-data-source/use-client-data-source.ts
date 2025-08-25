import type {
  RowLeaf,
  SortModelItem,
  FilterModelItem,
  RowGroupModelItem,
  FieldRowGroupFn,
  FieldPath,
  FieldDataParam,
  AggModelFn,
  RowDataSourceClient,
  GridAtom,
} from "../+types";
import { type ClientRowDataSourceParams, type Grid, type RowNode } from "../+types";
import { useRef } from "react";
import { traverse } from "./tree/traverse";
import type { TreeNode } from "./+types";
import {
  computed,
  dateComparator,
  effect,
  makeAtom,
  numberComparator,
  peek,
  signal,
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
  const data = signal(p.data);
  const topData = signal(p.topData ?? []);
  const bottomData = signal(p.bottomData ?? []);

  const dataToSrc$ = computed(() => {
    return new Map(data().map((c, i) => [c, i]));
  });

  const cache = new Map<number, RowLeaf<T>>();
  const centerNodes = computed(() => {
    const nodes: RowLeaf<T>[] = [];
    const d = data();
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

  const topNodes = computed(() => {
    return topData().map<RowLeaf<T>>((c, i) => ({ data: c, id: `top-${i}`, kind: "leaf" }));
  });
  const botNodes = computed(() => {
    return bottomData().map<RowLeaf<T>>((c, i) => ({ data: c, id: `bottom-${i}`, kind: "leaf" }));
  });

  const pinnedIdMap = computed(() => {
    const combined = new Map([...topNodes(), ...botNodes()].map((c) => [c.id, c]));
    return combined;
  });

  const models = signal<{
    filter: Record<string, FilterModelItem<T>>;
    group: RowGroupModelItem<T>[];
    groupExpansions: { [rowId: string]: boolean | undefined };
    agg: Record<string, { fn: AggModelFn<T> }>;
    sort: SortModelItem<T>[];
  }>({
    sort: [],
    filter: {},
    agg: {},
    group: [],
    groupExpansions: {},
  });

  const sortModel = computed<SortModelItem<T>[]>(() => models().sort);
  const filterModel = computed<Record<string, FilterModelItem<T>>>(() => models().filter);
  const rowGroupModel = computed<RowGroupModelItem<T>[]>(() => models().group);
  const groupExpansions = computed<{ [rowId: string]: boolean | undefined }>(
    () => models().groupExpansions,
  );
  const aggModel = computed<Record<string, { fn: AggModelFn<T> }>>(() => models().agg);

  const grid$ = signal<Grid<T> | null>(null);
  const snapshot = signal<number>(0);
  const tree = computed<ClientData<RowLeaf<T>>>(() => {
    snapshot();

    const grid = grid$();

    const rows = centerNodes();
    const filtered = computeFilteredRows(rows, grid, filterModel());

    const rowGroups = rowGroupModel()
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

    const rowAggModel = Object.entries(aggModel()).map(([name, agg]) => {
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
      rowIdGroup: p.rowIdBranch,
      rowIdLeaf: p.rowIdLeaf,
    });
  });

  const sortComparator = computed(() => {
    const model = sortModel();
    const grid = grid$();
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

  const idToNode = computed(() => {
    const map = new Map<string, TreeNode<RowLeaf<T>>>();
    traverse(tree().root, (node) => {
      map.set(node.id, node);
    });

    return map;
  });

  const initialized = signal(false);
  const flat = computed(() => {
    if (!initialized()) return { flat: [], idMap: new Map(), idToIndexMap: new Map() };

    const idMap = new Map<string, RowNode<T>>();
    const idToIndexMap = new Map<string, number>();

    const flattened: RowNode<T>[] = [];
    const comparator = sortComparator();

    const expansions = groupExpansions();
    const defaultExpansion = grid$()?.state.rowGroupDefaultExpansion.get() ?? false;

    let index = topNodes().length;

    traverse(
      tree().root,
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
  const flatLength = computed(() => flat().flat.length);

  const cleanup: (() => void)[] = [];
  const init = (grid: Grid<T>) => {
    while (cleanup.length) cleanup.pop()?.();

    grid$.set(grid);

    const store = grid.state.rowDataStore;

    // Monitor row count changes
    const centerCount = flatLength();
    const top = topData().length;
    const bottom = bottomData().length;

    store.rowCenterCount.set(centerCount);
    store.rowTopCount.set(top);
    store.rowBottomCount.set(bottom);

    cleanup.push(
      effect(() => {
        store.rowCenterCount.set(flatLength());
        store.rowTopCount.set(topData().length);
        store.rowBottomCount.set(bottomData().length);
        grid.state.rowDataStore.rowClearCache();
      }),
    );

    const sort = grid.state.sortModel.get();
    const filter = grid.state.filterModel.get();
    const group = grid.state.rowGroupModel.get();
    const groupExpansions = grid.state.rowGroupExpansions.get();
    const agg = grid.state.aggModel.get();

    models.set({ agg, filter, group, groupExpansions, sort });
    initialized.set(true);

    cleanup.push(
      effect(() => {
        models.set({
          sort: grid.state.sortModel.get(),
          agg: grid.state.aggModel.get(),
          filter: grid.state.filterModel.get(),
          group: grid.state.rowGroupModel.get(),
          groupExpansions: grid.state.rowGroupExpansions.get(),
        });
      }),
    );
  };

  const rowById = (id: string): RowNode<T> | null => {
    const pinned = peek(pinnedIdMap);
    if (pinned.has(id)) return pinned.get(id)!;

    const t = peek(flat);
    return t.idMap.get(id) ?? null;
  };
  const rowByIndex = (index: number) => {
    const top = peek(topNodes);
    const bot = peek(botNodes);
    const center = peek(flat).flat;

    const topOffset = top.length;
    const centerOffset = topOffset + center.length;
    const botOffset = centerOffset + bot.length;

    if (index < topOffset) return top[index];
    if (index < centerOffset) return center[index - topOffset];
    if (index < botOffset) return bot[index - centerOffset];

    return null;
  };

  const rowUpdate = (updates: Map<string | number, any>) => {
    const grid = peek(grid$)!;
    const d = peek(data);
    const idMap = peek(idToNode);
    const dataToSrc = peek(dataToSrc$);

    for (const [key, next] of updates.entries()) {
      const row = typeof key === "string" ? rowById(key) : rowByIndex(key);
      const treeNode = typeof key === "string" ? idMap.get(key) : null;

      if ((!row && !treeNode) || !grid) {
        console.error(`Failed to find the row with identifier ${key} which is being updated.`);
        continue;
      }

      if (row?.kind === "branch") {
        (row as any).data = next;
      } else {
        const data = row?.kind === "leaf" ? row.data : treeNode?.data.data;

        const source = dataToSrc.get(data as T);
        if (source == null) {
          console.error(`Failed to find the row with identifier ${key} which is being updated.`);
          continue;
        }

        d[source] = next as any;
      }
    }

    data.set([...d]);
    snapshot.set((prev) => prev + 1);
    grid.state.rowDataStore.rowClearCache();
  };

  const rowToIndex = (rowId: string) => {
    const f = peek(flat);
    const top = peek(topNodes);
    const bot = peek(botNodes);

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
    const t = peek(tree);

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
      rowAdd: (newRows, place = "end") => {
        data.set((prev) => {
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

        const grid = peek(grid$);
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

        data.set((prev) => {
          if (!rowData.size) return prev;
          return prev.filter((d) => !rowData.has(d));
        });

        const grid = peek(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowSetBotData: (data: any[]) => {
        bottomData.set(data);
        const grid = peek(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowSetTopData: (data: any[]) => {
        topData.set(data);
        const grid = peek(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowSetCenterData: (d: any[]) => {
        data.set(d);
        const grid = peek(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowExpand: (expansions) => {
        const grid = peek(grid$);
        if (!grid) return;

        grid.state.rowGroupExpansions.set((prev) => ({ ...prev, ...expansions }));
      },
      rowToIndex,

      rowAreAllSelected: (rowId) => {
        const g = peek(grid$);
        if (!g) return false;

        const selected = g.state.rowSelectedIds.get();

        if (rowId) {
          const row = rowById(rowId);
          if (!row) return false;
          const childIds = new Set(rowAllChildIds(rowId));
          return childIds.isSubsetOf(selected);
        }

        const f = peek(tree);
        return f.idsAll.isSubsetOf(selected);
      },

      rowSelect: (params) => {
        const grid = peek(grid$);
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

      rowData: (section) => {
        const d: T[] = [];
        if (section === "top" || section === "flat") {
          d.push(...peek(topData));
        }
        if (section === "center" || section === "flat") {
          d.push(...peek(data));
        }
        if (section === "bottom" || section === "flat") {
          d.push(...peek(bottomData));
        }

        return d;
      },
      rowSelectAll: (params) => {
        const grid = peek(grid$);
        if (!grid) return;
        if (params.deselect) {
          grid.state.rowSelectedIds.set(new Set());
          return;
        }

        const t = peek(tree);
        grid.state.rowSelectedIds.set(new Set(t.idsAll));
      },
    },
    {
      top: makeAtom(topData),
      center: makeAtom(data),
      bottom: makeAtom(bottomData),
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
    if (p.data !== da.center.get()) queueMicrotask(() => ds.current.rowSetCenterData(p.data));
    if (!equal(p.topData ?? [], da.top.get())) {
      queueMicrotask(() => ds.current.rowSetTopData(p.topData ?? []));
    }
    if (!equal(p.bottomData ?? [], da.bottom.get()))
      queueMicrotask(() => ds.current.rowSetBotData(p.bottomData ?? []));
  }

  return ds.current;
}
