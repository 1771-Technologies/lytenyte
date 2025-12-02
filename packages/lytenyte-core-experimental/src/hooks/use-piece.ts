import type { Dispatch, SetStateAction } from "react";
import { useMemo, useRef, useSyncExternalStore } from "react";

class Notifier {
  subs = new Set<() => void>();
  on = (cb: () => void) => {
    this.subs.add(cb);
    return () => this.subs.delete(cb);
  };
  notify = () => {
    for (const x of this.subs) x();
  };
}

export interface Piece<T> {
  readonly get: () => T;
  readonly useValue: {
    (): T;
    <K>(s: (v: T) => K): K;
  };
}
export interface PieceWritable<T> extends Piece<T> {
  readonly set: Dispatch<SetStateAction<T>>;
}

/**
 * A hook that is capable of creating state that can be scoped.
 */
export function usePiece<T>(source: T): Piece<T>;
export function usePiece<T>(source: T, setter: Dispatch<SetStateAction<T>>): PieceWritable<T>;
export function usePiece<T>(
  source: T,
  setter?: Dispatch<SetStateAction<T>>,
): Piece<T> | PieceWritable<T> {
  // We use a ref to track our "Piece". A ref is nice since we can initialize it once,
  // and then never recreate the functions for the initialization. Using memos and callback
  // can achieve the same thing, however, the memo/callback will still create a function
  // even if the function is not used when the component re-renders. We completely avoid this
  // with a ref that is initialized once.
  const valueRef = useRef<{ value: T; notifier: Notifier; piece: Piece<T> }>(null as any);
  if (!valueRef.current) {
    valueRef.current = {
      value: source,
      notifier: new Notifier(),
      piece: {
        get: () => valueRef.current.value,
        useValue: (selector?: <K>(v: T) => K) => {
          const snapshot = useMemo(() => {
            if (selector) return () => selector(valueRef.current!.value);
            return () => valueRef.current.value;
          }, [selector]);

          return useSyncExternalStore(valueRef.current.notifier.on, snapshot, snapshot);
        },
      },
    } as any;
  }

  // If a setter is provided we set this on the piece. Note this logic allows the setter to
  // be replaced at a later point in time. This way we can have different setters.
  if (setter) (valueRef.current.piece as any).set = setter;

  if (valueRef.current.value !== source) {
    // The value has change. Hence we should notify all the subscribers.
    // However, the subscriber may have already observed the change, hence
    valueRef.current.value = source;
    queueMicrotask(valueRef.current.notifier.notify);
  }

  return valueRef.current.piece;
}
