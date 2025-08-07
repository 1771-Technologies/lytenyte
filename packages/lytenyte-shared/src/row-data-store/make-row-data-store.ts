import type {
  GridAtomReadonly,
  GridAtomReadonlyUnwatchable,
  RowDataStore,
  RowNode,
} from "../+types.js";
import { atomFamily } from "@1771technologies/atom/utils";
import { atom, useAtomValue, type createStore, type PrimitiveAtom } from "@1771technologies/atom";
import { makeGridAtom } from "../grid-atom/make-grid-atom.js";

export type Store = ReturnType<typeof createStore>;

export function makeRowDataStore<T>(
  store: Store,
  rowByIndex: GridAtomReadonly<(r: number) => RowNode<T> | null>,
) {
  const rowCenterCount = atom(0);
  const bottomCount = atom(0);
  const topCount = atom(0);
  const rowCount = atom((g) => g(rowCenterCount) + g(bottomCount) + g(topCount));

  const snapshotKey = atom(Date.now());

  const family = atomFamily((i: number) => {
    const row = rowByIndex.get()(i);
    const rowAtom = atom(row);
    return rowAtom;
  });
  family.setShouldRemove((time) => {
    const currentTime = store.get(snapshotKey);
    return time < currentTime;
  });

  const watchAtoms = new Map<number, GridAtomReadonlyUnwatchable<RowNode<T> | null>>();
  const rTimeSnap = new Map<number, PrimitiveAtom<number>>();

  const rowForIndex = (r: number): GridAtomReadonlyUnwatchable<RowNode<T> | null> => {
    if (watchAtoms.has(r)) return watchAtoms.get(r)!;

    const rAtom = atom(0);
    rTimeSnap.set(r, rAtom);

    const gridAtom = {
      get: () => {
        const row = family(r);
        return store.get(row);
      },
      useValue: () => {
        useAtomValue(rTimeSnap.get(r)!, { store });

        const row = family(r);
        return useAtomValue(row, { store: store });
      },
    };

    watchAtoms.set(r, gridAtom);
    return gridAtom;
  };
  const rowInvalidateIndex = (r: number) => {
    const rSnap = rTimeSnap.get(r);
    if (!rSnap) return;
    family.remove(r);
    watchAtoms.delete(r);

    store.set(rSnap, (prev) => prev + 1);
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
        store.set(snapshotKey, Date.now());
      },
    } satisfies RowDataStore<T>,
    atoms: {
      snapshotKey,
      topCount,
      bottomCount,
      rowCenterCount,
      rowCount,
    },
  };
}
