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
  RowDataSourceClientPaginated,
  FilterIn,
} from "../+types.js";
import { type ClientRowDataSourceParams, type Grid, type RowNode } from "../+types.js";
import { useRef } from "react";
import { atom, createStore } from "@1771technologies/atom";
import { traverse } from "./tree/traverse.js";
import type { TreeNode } from "./+types.js";
import {
  dateComparator,
  makeGridAtom,
  numberComparator,
  stringComparator,
} from "@1771technologies/lytenyte-shared";
import { clamp, equal, get } from "@1771technologies/lytenyte-js-utils";
import { makeClientTree, type ClientData } from "./tree/client-tree.js";
import { computeFilteredRows } from "./filter/compute-filtered-rows.js";
import { builtIns } from "./built-ins/built-ins.js";

interface DataAtoms<T> {
  readonly top: GridAtom<T[]>;
  readonly center: GridAtom<T[]>;
  readonly bottom: GridAtom<T[]>;
}

export function makeClientDataSourcePaginated<T>(
  p: ClientRowDataSourceParams<T>,
): [RowDataSourceClientPaginated<T>, DataAtoms<T>] {
  const rdsStore = createStore();

  const pageInternal = atom(0);
  const rowsPerPage = atom(50);
  const pageCount = atom((g) => Math.max(Math.ceil(g(flatLength) / g(rowsPerPage)), 1));
  const page = atom(
    (g) => clamp(0, g(pageInternal), g(pageCount) - 1),
    (g, s, n: number | ((x: number) => number)) => {
      const res = typeof n === "function" ? n(g(pageInternal)) : n;

      s(pageInternal, clamp(0, res, g(pageCount) - 1));
    },
  );

  const data = atom(p.data);
  const topData = atom(p.topData ?? []);
  const bottomData = atom(p.bottomData ?? []);

  const dataToSrc$ = atom((g) => {
    return new Map(g(data).map((c, i) => [c, i]));
  });

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
    filter: Record<string, FilterModelItem<T>>;
    filterIn: Record<string, FilterIn>;
    quickSearch: string | null;
    group: RowGroupModelItem<T>[];
    groupExpansions: { [rowId: string]: boolean | undefined };
    agg: Record<string, { fn: AggModelFn<T> }>;
    sort: SortModelItem<T>[];
  }>({
    sort: [],
    filter: {},
    filterIn: {},
    quickSearch: null,
    agg: {},
    group: [],
    groupExpansions: {},
  });

  const sortModel = atom<SortModelItem<T>[]>((g) => g(models).sort);
  const filterModel = atom<Record<string, FilterModelItem<T>>>((g) => g(models).filter);
  const filterInModel = atom<Record<string, FilterIn>>((g) => g(models).filterIn);
  const rowGroupModel = atom<RowGroupModelItem<T>[]>((g) => g(models).group);
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
      g(filterInModel),
      g(quickSearch),
      grid?.state.quickSearchSensitivity.get() ?? "case-sensitive",
      false,
    );

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

  const idToNode = atom((g) => {
    const map = new Map<string, TreeNode<RowLeaf<T>>>();
    traverse(g(tree).root, (node) => {
      map.set(node.id, node);
    });

    return map;
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
    const rowCount = rdsStore.get(flatLength);
    const perPage = rdsStore.get(rowsPerPage);
    const currentPage = rdsStore.get(pageInternal);
    const center = clamp(0, rowCount - currentPage * perPage, perPage);

    store.rowCenterCount.set(center);
    cleanup.push(
      rdsStore.sub(flatLength, () => {
        grid.state.rowDataStore.rowClearCache();

        const rowCount = rdsStore.get(flatLength);
        const perPage = rdsStore.get(rowsPerPage);
        const currentPage = rdsStore.get(pageInternal);
        const center = clamp(0, rowCount - currentPage * perPage, perPage);
        store.rowCenterCount.set(center);
      }),
    );

    cleanup.push(
      rdsStore.sub(pageInternal, () => {
        grid.state.rowDataStore.rowClearCache();
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
    const filterIn = grid.state.filterInModel.get();
    const group = grid.state.rowGroupModel.get();
    const groupExpansions = grid.state.rowGroupExpansions.get();
    const agg = grid.state.aggModel.get();
    const quickSearch = grid.state.quickSearch.get();

    rdsStore.set(models, { agg, filter, filterIn, group, groupExpansions, sort, quickSearch });
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
    cleanup.push(
      grid.state.filterInModel.watch(() => {
        grid.state.filterInModel.watch(() => {
          rdsStore.set(models, (prev) => ({ ...prev, filterIn: grid.state.filterInModel.get() }));
          grid.state.rowDataStore.rowClearCache();
        });
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

  const rowById = (id: string): RowNode<T> | null => {
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
    if (index < centerOffset) {
      const pageOffset = index + rdsStore.get(rowsPerPage) * rdsStore.get(pageInternal);
      return center[pageOffset - topOffset];
    }
    if (index < botOffset) return bot[index - centerOffset];

    return null;
  };

  const rowUpdate = (updates: Map<string | number, any>) => {
    const grid = rdsStore.get(grid$)!;

    const d = rdsStore.get(data);
    const idMap = rdsStore.get(idToNode);
    const dataToSrc = rdsStore.get(dataToSrc$);

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

    rdsStore.set(data, [...d]);
    rdsStore.set(snapshot, (prev) => prev + 1);
    grid.state.rowDataStore.rowClearCache();
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
      page: {
        current: makeGridAtom(page, rdsStore),
        pageCount: makeGridAtom(pageCount, rdsStore),
        perPage: makeGridAtom(rowsPerPage, rdsStore),
      },
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

        if (p.transformInFilterItem) {
          return p.transformInFilterItem({ column: c, values: [...values] });
        }

        return [...values].map((x) => ({ id: `${x}`, label: `${x}`, value: x }));
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
      rowSetCenterData: (d: any[]) => {
        rdsStore.set(data, d);
        const grid = rdsStore.get(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },
      rowSetTopData: (data: any[]) => {
        rdsStore.set(topData, data);
        const grid = rdsStore.get(grid$);
        grid?.state.rowDataStore.rowClearCache();
      },

      rowData: (section) => {
        const d: T[] = [];
        if (section === "top" || section === "flat") {
          d.push(...rdsStore.get(topData));
        }
        if (section === "center" || section === "flat") {
          d.push(...rdsStore.get(data));
        }
        if (section === "bottom" || section === "flat") {
          d.push(...rdsStore.get(bottomData));
        }

        return d;
      },

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

export function useClientRowDataSourcePaginated<T>(p: ClientRowDataSourceParams<T>) {
  const ds = useRef<RowDataSourceClientPaginated<T>>(null as any);
  const dataAtomRef = useRef<DataAtoms<T>>(null as any);

  if (!ds.current) [ds.current, dataAtomRef.current] = makeClientDataSourcePaginated(p);

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
