import {
  useAtomValue,
  type Atom,
  type PrimitiveAtom,
  type createStore,
} from "@1771technologies/atom";
import type { GridAtom, GridAtomReadonly } from "../+types";

type Store = ReturnType<typeof createStore>;

export function makeGridAtom<T>(atom: Atom<T>, store: Store, withSet?: (v: T) => T): GridAtom<T>;
export function makeGridAtom<T>(
  atom: PrimitiveAtom<T>,
  store: Store,
  withSet?: (v: T) => T,
): GridAtomReadonly<T>;
export function makeGridAtom<T>(
  atom: Atom<T> | PrimitiveAtom<T>,
  store: Store,
  withSet?: (v: T) => T,
): GridAtom<T> | GridAtomReadonly<T> {
  if ("write" in atom) {
    return {
      get: () => store.get(atom),
      set: (t) => {
        if (withSet) {
          const v = typeof t === "function" ? (t as any)(store.get(atom)) : t;

          store.set(atom, withSet(v));
        } else {
          store.set(atom, t);
        }
      },
      watch: (fn) => store.sub(atom, fn),
      useValue: () => useAtomValue(atom, { store }),
    };
  } else {
    return {
      get: () => store.get(atom),
      watch: (fn) => store.sub(atom, fn),
      useValue: () => useAtomValue(atom, { store }),
    };
  }
}
