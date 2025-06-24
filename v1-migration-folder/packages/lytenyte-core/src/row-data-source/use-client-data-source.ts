import type { ClientRowDataSourceParams, Grid, RowDataSource, RowNode } from "../+types";
import { useRef } from "react";
import type { ClientData } from "./client-tree";
import { makeClientTree } from "./client-tree";
import { atom, createStore } from "@1771technologies/atom";
import { traverse } from "./traverse";

export function makeClientDataSource<T>(p: ClientRowDataSourceParams<T>): RowDataSource<T> {
  const store = createStore();
  const tree = atom<ClientData<T>>(
    makeClientTree({ rowData: p.data, rowAggModel: [], rowBranchModel: [] }),
  );
  const flat = atom((g) => {
    const idMap = new Map<string, RowNode<T>>();
    const flattened: RowNode<T>[] = [];

    traverse(g(tree).root, (node) => {
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
    });

    return { flat: flattened, idMap };
  });

  const init = (grid: Grid<T>) => {
    const store = grid.state.rowDataStore;
    store.rowCenterCount.set(p.data.length);
    store.rowTopCount.set(p.topData?.length ?? 0);
    store.rowBottomCount.set(p.bottomData?.length ?? 0);
  };

  const rowById = (id: string) => {
    const t = store.get(flat);
    return t.idMap.get(id) ?? null;
  };
  const rowByIndex = (index: number) => {
    const t = store.get(flat);
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
