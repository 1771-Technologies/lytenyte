import type { GridAtom, GridAtomReadonly, RowDataStore, RowNode } from "../+types";
import { atom, type createStore } from "@1771technologies/atom";
import { makeGridAtom } from "../grid-atom/make-grid-atom";

export type Store = ReturnType<typeof createStore>;

export function makeRowDataStore<T>(
  store: Store,
  rowByIndex: GridAtomReadonly<(r: number) => RowNode<T> | null>,
) {
  const rowCenterCount = atom(0);
  const bottomCount = atom(0);
  const topCount = atom(0);
  const rowCount = atom((g) => g(rowCenterCount) + g(bottomCount) + g(topCount));

  const rowFamily: Map<number, GridAtom<RowNode<T> | null>> = new Map();

  const rowForIndex = (r: number) => {
    if (rowFamily.has(r)) return rowFamily.get(r)!;

    const rowAtom = makeGridAtom(atom(rowByIndex.get()(r)), store);
    rowFamily.set(r, rowAtom);

    return rowAtom;
  };
  const rowInvalidateIndex = (r: number) => {
    const node = rowByIndex.get()(r);
    const atom = rowForIndex(r);

    atom.set(node);
  };

  return {
    store: {
      rowCount: makeGridAtom(rowCount, store),
      rowTopCount: makeGridAtom(topCount, store),
      rowCenterCount: makeGridAtom(rowCenterCount, store),
      rowBottomCount: makeGridAtom(bottomCount, store),

      rowForIndex,
      rowInvalidateIndex,
      rowClearCache: () => {
        rowFamily.clear();
      },
    } satisfies RowDataStore<T>,
    atoms: {
      topCount,
      bottomCount,
      rowCenterCount,
      rowCount,
    },
  };
}
