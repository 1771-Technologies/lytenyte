import type { SortModelItem } from "../+types";
import {
  type ClientRowDataSourceParams,
  type Grid,
  type RowDataSource,
  type RowNode,
} from "../+types";
import { useRef } from "react";
import type { ClientData } from "./client-tree";
import { makeClientTree } from "./client-tree";
import { atom, createStore } from "@1771technologies/atom";
import { traverse } from "./traverse";
import type { TreeNode } from "./+types";
import {
  dateComparator,
  numberComparator,
  stringComparator,
} from "@1771technologies/lytenyte-shared";

export function makeClientDataSource<T>(p: ClientRowDataSourceParams<T>): RowDataSource<T> {
  const rdsStore = createStore();

  const tree = atom<ClientData<T>>(
    makeClientTree({ rowData: p.data, rowAggModel: [], rowBranchModel: [] }),
  );

  const grid$ = atom<Grid<T> | null>(null);

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

  const cleanup: (() => void)[] = [];
  const init = (grid: Grid<T>) => {
    while (cleanup.length) cleanup.pop()?.();

    const store = grid.state.rowDataStore;
    store.rowCenterCount.set(p.data.length);
    store.rowTopCount.set(p.topData?.length ?? 0);
    store.rowBottomCount.set(p.bottomData?.length ?? 0);

    rdsStore.set(grid$, grid);

    // Sort model monitoring
    rdsStore.set(sortModel, grid.state.sortModel.get());
    cleanup.push(
      grid.state.sortModel.watch(() => {
        rdsStore.set(sortModel, grid.state.sortModel.get());
      }),
    );
  };

  const rowById = (id: string) => {
    const t = rdsStore.get(flat);
    return t.idMap.get(id) ?? null;
  };
  const rowByIndex = (index: number) => {
    const t = rdsStore.get(flat);
    return t.flat[index] ?? null;
  };

  return { init, rowById, rowByIndex };
}

export function useClientRowDataSource<T>(p: ClientRowDataSourceParams<T>) {
  const ds = useRef<RowDataSource<T>>(null as any);
  if (!ds.current) {
    ds.current = makeClientDataSource(p);
  }

  return ds.current;
}
