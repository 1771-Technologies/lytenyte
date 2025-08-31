import type { ReadSignal, WriteSignal } from "../+types";
import { effect, isWriteSignal, peek } from "../vanilla";
import { useSignalValue } from "./use-signal-value";

export interface Atom<T> {
  readonly get: () => T;
  readonly set: (v: T | ((v: T) => T)) => void;
  readonly watch: (fn: () => void) => () => void;
  readonly useValue: () => T;
  readonly $: () => T;
}
export interface AtomReadonly<T> {
  readonly get: () => T;
  readonly watch: (fn: () => void) => () => void;
  readonly useValue: () => T;
  readonly $: () => T;
}

export function makeAtom<T>(sig: WriteSignal<T>): Atom<T>;
export function makeAtom<T>(sig: ReadSignal<T>): AtomReadonly<T>;
export function makeAtom<T>(sig: WriteSignal<T> | ReadSignal<T>) {
  if (isWriteSignal(sig)) {
    return {
      $: () => sig(),
      get: () => peek(sig),
      useValue: () => {
        return useSignalValue(sig);
      },
      set: (v) => sig.set(v),
      watch: (fn) => {
        return effect(() => {
          sig();
          fn();
        });
      },
    } satisfies Atom<T>;
  } else {
    return {
      $: () => sig(),
      get: () => peek(sig),
      useValue: () => {
        return useSignalValue(sig);
      },
      watch: (fn) => {
        return effect(() => {
          sig();
          fn();
        });
      },
    } satisfies AtomReadonly<T>;
  }
}
