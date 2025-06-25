import type {
  GridAtomReadonly,
  GridAtomReadonlyUnwatchable,
  RowDataStore,
  RowNode,
} from "../+types";
import { atomFamily } from "@1771technologies/atom/utils";
import { atom, useAtomValue, type createStore } from "@1771technologies/atom";
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

  const rowForIndex = (r: number): GridAtomReadonlyUnwatchable<RowNode<T> | null> => {
    return {
      get: () => {
        const row = family(r);
        return store.get(row);
      },
      useValue: () => {
        const row = family(r);
        return useAtomValue(row);
      },
    };
  };
  const rowInvalidateIndex = (r: number) => {
    family.remove(r);
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
