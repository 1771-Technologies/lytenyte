import {
  useAtomValue,
  type Atom,
  type PrimitiveAtom,
  type createStore,
} from "@1771technologies/atom";
import type { GridAtom, GridAtomReadonly } from "../+types";

type Store = ReturnType<typeof createStore>;

export function makeGridAtom<T>(atom: Atom<T>, store: Store): GridAtom<T>;
export function makeGridAtom<T>(atom: PrimitiveAtom<T>, store: Store): GridAtomReadonly<T>;
export function makeGridAtom<T>(
  atom: Atom<T> | PrimitiveAtom<T>,
  store: Store,
): GridAtom<T> | GridAtomReadonly<T> {
  if ("write" in atom) {
    return {
      get: () => store.get(atom),
      set: (t) => store.set(atom, t),
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
