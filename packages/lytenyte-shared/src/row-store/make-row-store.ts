import {
  computed,
  effect,
  makeAtom,
  signal,
  useSignalValue,
  type AtomReadonly,
} from "@1771technologies/lytenyte-signal";
import type { RowDataStore, RowNode } from "../+types";

export interface MakeRowStore<T> {
  readonly getRow: (i: number) => RowNode<T> | null;
}

export function makeRowStore<T>({ getRow }: MakeRowStore<T>): RowDataStore<T> {
  const rowCenterCount = signal(0);
  const topCount = signal(0);
  const bottomCount = signal(0);
  const rowCount = computed(() => rowCenterCount() + topCount() + bottomCount());

  const signalCache = new Map<
    number,
    AtomReadonly<RowNode<T> | null> & { __invalidate: () => void }
  >();

  const globalSnapshot = signal(Date.now());

  // Clean the row when count is updated. This ensure that we don't keep around rows that have
  // since been change.
  let timeId: ReturnType<typeof setTimeout> | null = null;
  effect(() => {
    rowCount();
    if (timeId) return;

    timeId = setTimeout(() => {
      const count = rowCount();
      const vals = signalCache.keys();
      for (const k of vals) {
        if (k < count) continue;
        signalCache.delete(k);
      }

      timeId = null;
    }, 100);
  });

  return {
    rowCount: makeAtom(rowCount),
    rowTopCount: makeAtom(topCount),
    rowCenterCount: makeAtom(rowCenterCount),
    rowBottomCount: makeAtom(bottomCount),

    rowInvalidateIndex: (i) => {
      if (Array.isArray(i)) {
        i.forEach((x) => signalCache.get(x)?.__invalidate());
      } else {
        signalCache.get(i)?.__invalidate();
      }
    },
    rowClearCache: () => {
      globalSnapshot.set(Date.now());
    },

    rowForIndex: (i) => {
      const currentAtom = signalCache.get(i);
      if (!currentAtom) {
        const localSnapshot = signal(Date.now());

        const newAtom: AtomReadonly<RowNode<T> | null> & { __invalidate: () => void } = {
          $: () => getRow(i),
          get: () => getRow(i),
          watch: () => () => {},
          useValue: () => {
            useSignalValue(globalSnapshot);
            useSignalValue(localSnapshot);

            const row = getRow(i);

            return row;
          },
          __invalidate: () => {
            localSnapshot.set(Date.now());
          },
        };

        signalCache.set(i, newAtom);
        return newAtom;
      }

      return currentAtom;
    },
  };
}
