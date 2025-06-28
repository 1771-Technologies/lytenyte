import type { GridAtom, RowLeaf, SortModelItem, FilterModelItem } from "../+types";
import {
  type ClientRowDataSourceParams,
  type Grid,
  type RowDataSource,
  type RowNode,
} from "../+types";
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

interface DataAtoms<T> {
  readonly top: GridAtom<T[]>;
  readonly center: GridAtom<T[]>;
  readonly bottom: GridAtom<T[]>;
}

export function makeClientDataSource<T>(
  p: ClientRowDataSourceParams<T>,
): [RowDataSource<T>, DataAtoms<T>] {
  const rdsStore = createStore();

  const data = atom(p.data);
  const topData = atom(p.topData ?? []);
  const bottomData = atom(p.bottomData ?? []);

  const topNodes = atom((g) => {
    return g(topData).map<RowLeaf<T>>((c) => ({ data: c, id: `top-${c}`, kind: "leaf" }));
  });
  const botNodes = atom((g) => {
    return g(bottomData).map<RowLeaf<T>>((c) => ({ data: c, id: `bottom-${c}`, kind: "leaf" }));
  });

  const pinnedIdMap = atom((g) => {
    const combined = new Map([...g(topNodes), ...g(botNodes)].map((c) => [c.id, c]));
    return combined;
  });

  const filterModel = atom<FilterModelItem<T>[]>([]);

  const grid$ = atom<Grid<T> | null>(null);
  const tree = atom<ClientData<T>>((g) => {
    const rows = g(data);
    const model = g(filterModel);

    const filtered = computeFilteredRows(rows, g(grid$), model);

    return makeClientTree({ rowData: filtered, rowAggModel: [], rowBranchModel: [] });
  });

  const sortModel = atom<SortModelItem<T>[]>([]);
  const sortComparator = atom((g) => {
    const model = g(sortModel);
    const grid = g(grid$);
    if (!model.length || !grid) return () => 0;

    const comparator = (l: TreeNode<T>, r: TreeNode<T>) => {
      let res = 0;
      for (const sortSpec of model) {
        const sort = sortSpec.sort;
        const columnId = sortSpec.columnId;

        if (sort.kind === "custom") {
          res = sort.comparator(l.data, r.data, sort.options ?? {});
        } else if (sort.kind === "number") {
          const left = grid.api.fieldForColumn(columnId!, l.data);
          const right = grid.api.fieldForColumn(columnId!, r.data);
          res = numberComparator(left as number, right as number, sort.options ?? {});
        } else if (sort.kind === "date") {
          const left = grid.api.fieldForColumn(columnId!, l.data);
          const right = grid.api.fieldForColumn(columnId!, r.data);
          res = dateComparator(left as string, right as string, sort.options ?? {});
        } else if (sort.kind === "string") {
          const left = grid.api.fieldForColumn(columnId!, l.data);
          const right = grid.api.fieldForColumn(columnId!, r.data);
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

  const flat = atom((g) => {
    const idMap = new Map<string, RowNode<T>>();
    const flattened: RowNode<T>[] = [];
    const comparator = g(sortComparator);

    traverse(
      g(tree).root,
      (node) => {
        if (node.kind === 1) {
          flattened.push({
            kind: "leaf",
            data: node.data,
            id: node.id,
          });
        } else {
          flattened.push({
            kind: "branch",
            data: node.data,
            id: node.id,
            key: node.key,
          });
        }
        idMap.set(node.id, flattened.at(-1)!);
      },
      comparator,
    );

    return { flat: flattened, idMap };
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

    // Sort model monitoring
    rdsStore.set(sortModel, grid.state.sortModel.get());
    cleanup.push(
      grid.state.sortModel.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(sortModel, grid.state.sortModel.get());
      }),
    );

    // Filter model monitoring
    rdsStore.set(filterModel, grid.state.filterModel.get());
    cleanup.push(
      grid.state.filterModel.watch(() => {
        grid.state.rowDataStore.rowClearCache();
        rdsStore.set(filterModel, grid.state.filterModel.get());
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

  return [
    { init, rowById, rowByIndex },
    {
      top: makeGridAtom(topData, rdsStore),
      center: makeGridAtom(data, rdsStore),
      bottom: makeGridAtom(bottomData, rdsStore),
    },
  ];
}

export function useClientRowDataSource<T>(p: ClientRowDataSourceParams<T>) {
  const ds = useRef<RowDataSource<T>>(null as any);
  const dataAtomRef = useRef<DataAtoms<T>>(null as any);

  if (!ds.current) [ds.current, dataAtomRef.current] = makeClientDataSource(p);

  const da = dataAtomRef.current;
  // Need to queue the microtask since it we cannot update state during render.
  if (p.data !== da.center.get()) queueMicrotask(() => da.center.set(p.data));
  if (!equal(p.topData ?? [], da.top.get())) {
    queueMicrotask(() => da.top.set(p.topData ?? []));
  }
  if (!equal(p.bottomData ?? [], da.bottom.get()))
    queueMicrotask(() => da.bottom.set(p.bottomData ?? []));

  return ds.current;
}
