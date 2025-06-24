import type { RowDataStore } from "../+types";
import { atom, type createStore } from "@1771technologies/atom";
import { makeGridAtom } from "../grid-atom/make-grid-atom";

export type Store = ReturnType<typeof createStore>;

export function makeRowDataStore(store: Store) {
  const rowCenterCount = atom(0);
  const bottomCount = atom(0);
  const topCount = atom(0);
  const rowCount = atom((g) => g(rowCenterCount) + g(bottomCount) + g(topCount));

  return {
    store: {
      rowCount: makeGridAtom(rowCount, store),
      rowTopCount: makeGridAtom(topCount, store),
      rowCenterCount: makeGridAtom(rowCenterCount, store),
      rowBottomCount: makeGridAtom(bottomCount, store),
    } satisfies RowDataStore,
    atoms: {
      topCount,
      bottomCount,
      rowCenterCount,
      rowCount,
    },
  };
}
