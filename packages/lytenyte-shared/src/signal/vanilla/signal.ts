import { SCOPE } from "../+constants.js";
import type {
  ComputedSignalOptions,
  MaybeSignal,
  ReadSignal,
  SignalOptions,
  WriteSignal,
} from "../+types.js";
import { createComputation } from "./create-computation.js";
import { dispose } from "./dispose.js";
import { isFunction } from "./is-function.js";
import { onDispose } from "./primitives.js";
import { read } from "./read.js";
import { update } from "./update.js";
import { write } from "./write.js";

/**
 * Wraps the given value into a signal. The signal will return the current value when invoked
 * `fn()`, and provide a simple write API via `set()`. The value can now be observed
 * when used inside other computations created with `computed` and `effect`.
 */
export function signal<T>(initialValue: T, options?: SignalOptions<T>): WriteSignal<T> {
  const node = createComputation(initialValue, null, options),
    signal = read.bind(node) as WriteSignal<T>;

  (signal as any)[SCOPE] = true;
  signal.set = write.bind(node) as WriteSignal<T>["set"];

  return signal;
}

/**
 * Whether the given value is a readonly signal.
 */
export function isReadSignal<T>(fn: MaybeSignal<T>): fn is ReadSignal<T> {
  return isFunction(fn) && SCOPE in fn;
}

/**
 * Creates a new signal whose value is computed and returned by the given function. The given
 * compute function is _only_ re-run when one of it's dependencies are updated. Dependencies are
 * are all signals that are read during execution.
 */
export function computed<T, R = never>(
  compute: () => T,
  options?: ComputedSignalOptions<T, R>,
): ReadSignal<T | R> {
  const node = createComputation<T | R>(
      options?.initial as R,
      compute,
      options as ComputedSignalOptions<T | R>,
    ),
    signal = read.bind(node) as ReadSignal<T | R>;

  (signal as any)[SCOPE] = true;
  return signal;
}

/**
 * Invokes the given function each time any of the signals that are read inside are updated
 * (i.e., their value changes). The effect is immediately invoked on initialization.
 */
export function effect(effect: () => void): () => void {
  const signal = createComputation<null>(null, function runEffect() {
    const effectResult = effect();
    if (isFunction(effectResult)) onDispose(effectResult);
    return null;
  });

  signal._effect = true;
  update(signal);

  return dispose.bind(signal, true);
}

/**
 * Takes in the given signal and makes it read only by removing access to write operations
 * (i.e., `set()`).
 */
export function readonly<T>(signal: ReadSignal<T>): ReadSignal<T> {
  const readonly = (() => signal()) as ReadSignal<T>;
  (readonly as any)[SCOPE] = true;
  return readonly;
}

/**
 * Whether the given value is a write signal (i.e., can produce new values via write API).
 */
export function isWriteSignal<T>(fn: MaybeSignal<T>): fn is WriteSignal<T> {
  return isReadSignal(fn) && "set" in fn;
}
