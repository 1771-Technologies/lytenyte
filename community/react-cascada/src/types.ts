import type { AllSignalTypes, Cascada } from "@1771technologies/cascada";

/**
 * Extends the base Cascada store with enhanced hook selectors for reactive state management.
 * This type adds React-like hooks for accessing signal values while maintaining reactivity.
 *
 * @template V - A record type mapping string keys to reactive signals (Signal, ComputedSignal, or RemoteSignal)
 *
 * @property use - Hook function to directly access a signal's current value by key
 * @property useSelector - Hook function to compute derived values from multiple signals
 *
 * @example
 * ```typescript
 * type UserStore = {
 *   name: Signal<string>;
 *   age: Signal<number>;
 *   online: Signal<boolean>;
 * };
 *
 * const store: CascadaStore<UserStore>;
 *
 * // Direct value access
 * const name = store.useValue('name');
 *
 * // Computed value with multiple dependencies
 * const userStatus = store.useSelector(s => ({
 *   name: s.name.get(),
 *   isOnline: s.online.get()
 * }));
 * ```
 */
export type CascadaStore<V extends Record<string, AllSignalTypes<any>>> = Omit<
  Cascada<V>,
  "selector"
> & {
  /**
   * Hook accessor to get the current value of a signal by its key.
   *
   * @template K - The key of the signal to access
   * @param k - The key in the store corresponding to the desired signal
   * @returns The current value of the signal
   */
  useValue: <K extends keyof V>(k: K) => ReturnType<V[K]["get"]>;

  /**
   * Hook selector to compute derived values from multiple signals.
   *
   * @template T - The type of the computed value
   * @param f - Selector function that computes a value from the store's signals
   * @param equal - Optional equality function to determine when the computed value has changed
   * @returns The computed value
   */
  useSelector: <T>(f: (s: V) => T, equal?: (l: T, r: T) => boolean) => T;
};
