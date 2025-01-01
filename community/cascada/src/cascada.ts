import { addTask } from "./scheduler.js";
import type {
  AllSignalTypes,
  DisposableSignal,
  ReadonlySignal,
  ReadonlyRemoteSource,
  Setter,
  Signal,
  SignalOptions,
  Watch,
  WritableRemoteSource,
  Cascada,
} from "./types.js";

const identify = <T>(v: T) => v;
let watchersLookup: null | Map<symbol, Set<() => void>> = null;
let depsLookup: null | Map<symbol, Set<() => void>> = null;
let remoteSources: null | Map<symbol, () => void> = null;

let currentScope: null | Set<Watch>;

/**
 * Creates a new reactive scope that serves as a container for managing reactive state. This function
 * is the foundation for creating and managing reactive values, computed states, and remote data sources.
 *
 * @template F - A record type mapping string keys to reactive values (Signal, ComputedSignal, or RemoteSignal)
 * @param fn - A factory function that initializes and returns a collection of reactive values
 *
 * @returns {Cascada<F>} An object containing:
 * - `store`: The reactive store containing all signals created within the factory function
 * - `dispose`: A cleanup function that releases all reactive resources
 * - `selector`: A function for creating computed values derived from the store's state
 *
 * @throws {Error} If attempts are made to create signals outside this scope
 *
 * @example
 * Creating a basic reactive store:
 * ```typescript
 * const { store, dispose } = cascada(() => ({
 *   count: signal(0),
 *   name: signal('Alice'),
 *   isValid: computed(() => store.count.get() > 0 && store.name.get().length > 0)
 * }));
 * ```
 *
 * @example
 * Using the selector for derived state:
 * ```typescript
 * const { store, selector } = cascada(() => ({
 *   users: signal([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]),
 *   selectedId: signal<number | null>(null)
 * }));
 *
 * const selectedUser = selector(s => {
 *   const id = s.selectedId.get();
 *   return id ? s.users.get().find(u => u.id === id) : null;
 * });
 * ```
 *
 * @remarks
 * The cascada scope provides several key guarantees:
 * - All signals are properly initialized and tracked
 * - Dependencies between signals are automatically managed
 * - Memory leaks are prevented through proper cleanup
 * - Computed values are lazily evaluated and cached
 * - Remote sources are synchronized and disposed properly
 */
export const cascada = <F extends Record<string, any>>(fn: () => F): Cascada<F> => {
  const prevWatchers = watchersLookup;
  const prevDeps = depsLookup;
  const prevRemove = remoteSources;

  watchersLookup = new Map();
  depsLookup = new Map();
  remoteSources = new Map();

  const watchers = watchersLookup;
  const deps = depsLookup;
  const remotes = remoteSources;

  const result = fn();

  const dispose = () => {
    watchers.clear();
    deps.clear();

    remotes.forEach((c) => c());
    remotes.clear();
  };

  const selector = makeSelector(result) as any;

  watchersLookup = prevWatchers;
  depsLookup = prevDeps;
  remoteSources = prevRemove;
  return { store: result, dispose, selector };
};

/**
 * Creates a reactive signal that holds a mutable value. Signals are the basic building blocks of
 * reactive state and must be created within a cascada scope.
 *
 * @template T - The type of value stored in the signal
 * @param value - The initial value to store in the signal
 * @param options - Configuration options for the signal
 * @param {function(T, T): boolean} [options.equal] - Custom equality function to determine value changes
 * @param {function(T): T} [options.bind] - Transform function applied to new values before storage
 * @param {function(): void} [options.postUpdate] - Callback function executed after value updates
 *
 * @returns {Signal<T>} A Signal object with methods:
 * - `get()`: Retrieves the current value
 * - `set(newValue | updater)`: Updates the value directly or via an updater function
 * - `watch(callback)`: Subscribes to value changes
 * - `peek()`: Gets the current value without creating a dependency
 *
 * @throws {Error} When called outside of a cascada scope
 *
 * @example
 * Basic usage:
 * ```typescript
 * const counter = signal(0);
 * counter.set(5);
 * counter.set(prev => prev + 1);
 * ```
 *
 * @example
 * Custom equality comparison:
 * ```typescript
 * const user = signal({ id: 1, name: 'Alice' }, {
 *   equal: (a, b) => a.id === b.id && a.name === b.name
 * });
 * ```
 *
 * @example
 * Value transformation and post-update callback:
 * ```typescript
 * const count = signal(0, {
 *   bind: v => Math.max(0, v), // Ensure count never goes negative
 *   postUpdate: () => console.log('Count updated')
 * });
 * ```
 */
export const signal = <T>(
  value: T,
  { equal = Object.is, bind = identify, postUpdate }: SignalOptions<T> = {},
): Signal<T> => {
  if (!watchersLookup) throw new Error("`signal` must be called from within the make function.");
  const symbol = Symbol();
  const watch = makeWatch(symbol, watchersLookup!);
  const dependentOn = makeDependsOn(symbol, depsLookup!);

  const watchers = watchersLookup;
  const deps = depsLookup!;

  const set = (nextValue: Setter<T>) => {
    let next = typeof nextValue === "function" ? (nextValue as (v: T) => T)(value) : nextValue;
    next = bind(next);

    if (equal(next, value)) return;

    value = next;

    postUpdate?.();
    notify(symbol, watchers, deps);
  };

  const get = () => {
    if (currentScope) currentScope.add(dependentOn);

    return value;
  };

  const peak = makePeek(get);
  return { set, get, watch, peek: peak };
};

/**
 * Creates a read-only computed value that automatically updates when its dependencies change.
 * Computed values are lazy and cached - they only recalculate when accessed after dependencies change.
 *
 * @template T - The type of the computed value
 *
 * @overload
 * @param fn - A function that derives a value from other signals
 * @returns {ReadonlySignal<T>} A read-only computed signal
 *
 * @overload
 * @param fn - A function that derives a value from other signals
 * @param set - Optional setter function to make the computed value writable
 * @returns {DisposableSignal<T>} A writable computed signal
 *
 * @returns A signal with methods:
 * - `get()`: Retrieves the current computed value
 * - `watch(callback)`: Subscribes to value changes
 * - `peek()`: Gets the current value without creating a dependency
 * - `dispose()`: Cleans up the computation and its dependencies
 * - `set()`: Updates the value (only available when setter provided)
 *
 * @throws {Error} When called outside of a cascada scope
 *
 * @example
 * Basic read-only computed value:
 * ```typescript
 * const count = signal(0);
 * const doubled = computed(() => count.get() * 2);
 *
 * console.log(doubled.get()); // 0
 * count.set(5);
 * console.log(doubled.get()); // 10
 * ```
 *
 * @example
 * Writable computed value:
 * ```typescript
 * const celsius = signal(0);
 * const fahrenheit = computed(
 *   () => celsius.get() * 9/5 + 32,
 *   (f) => celsius.set((f - 32) * 5/9)
 * );
 *
 * fahrenheit.set(68); // Updates celsius to 20
 * ```
 *
 * @remarks
 * - Computed values automatically track their dependencies
 * - They only recompute when accessed after a dependency changes
 * - The computation is guaranteed to be consistent with its dependencies
 * - Memory leaks are prevented through proper cleanup when disposed
 * - When a setter is provided, the computed value becomes writable
 */
export function computed<T>(fn: () => T, set: (v: T) => void): DisposableSignal<T>;
export function computed<T>(fn: () => T): ReadonlySignal<T>;
export function computed<T>(
  fn: () => T,
  set?: (v: T) => void,
): ReadonlySignal<T> | DisposableSignal<T> {
  if (!watchersLookup) throw new Error("`computed` must be called from within the make function.");
  let state: 0 | 1 = 0;
  let value: T = null as unknown as T;

  let prev: (() => void)[] = [];

  const symbol = Symbol();

  const watch = makeWatch(symbol, watchersLookup!);
  const dependentOn = makeDependsOn(symbol, depsLookup!);

  const watchers = watchersLookup;
  const deps = depsLookup!;

  const reset = () => {
    state = 0;
    notify(symbol, watchers, deps);
  };

  const get = () => {
    if (currentScope) currentScope.add(dependentOn);
    if (state === 1) return value;

    const previousScope = currentScope;
    prev.forEach((c) => c());

    currentScope = new Set();
    value = fn();
    prev = [...currentScope].map((c) => c(reset));

    currentScope = previousScope;

    // Mark the node as clean
    state = 1;
    return value;
  };

  const peek = makePeek(get);
  const dispose = () => {
    state = 0;
    prev.forEach((c) => c());
  };

  if (set) {
    const setInternal = (nextValue: Setter<T>) => {
      const next = typeof nextValue === "function" ? (nextValue as (v: T) => T)(value) : nextValue;
      set(next);
    };
    return { get, peek, watch, dispose, set: setInternal };
  }

  return {
    get,
    peek,
    watch,
    dispose,
  };
}

/**
 * Creates a signal that synchronizes with an external data source. Remote signals provide a reactive
 * interface to non-reactive data sources and must be created within a cascada scope.
 *
 * @template T - The type of the remote value
 * @param args - Configuration for the remote source
 * @param args.get - Function to fetch the current value
 * @param args.subscribe - Function to subscribe to source changes
 * @param args.set - Optional function to update the remote value
 *
 * @returns {DisposableSignal<T> | ReadonlySignal<T>} A signal that can be:
 * - Read using `get()`
 * - Written to using `set()` (if writable)
 * - Watched for changes using `watch(callback)`
 * - Cleaned up using `dispose()`
 *
 * @throws {Error} When called outside of a cascada scope
 *
 * @example
 * Read-only remote source:
 * ```typescript
 * const serverTime = remote({
 *   get: () => fetch('/api/time').then(r => r.json()),
 *   subscribe: callback => {
 *     const ws = new WebSocket('/api/time/updates');
 *     ws.onmessage = () => callback();
 *     return () => ws.close();
 *   }
 * });
 * ```
 *
 * @remarks
 * Remote signals provide several guarantees:
 * - The remote value is cached until invalidated
 * - Updates are properly synchronized with the source
 * - Subscriptions are cleaned up when disposed
 * - The API remains consistent whether read-only or writable
 * - Error handling should be implemented in the provided functions
 */
export function remote<T>(args: WritableRemoteSource<T>): DisposableSignal<T>;
export function remote<T>(args: ReadonlyRemoteSource<T>): ReadonlySignal<T>;
export function remote<T>(args: {
  get: () => T;
  subscribe: Watch;
  set?: (v: T) => void;
}): DisposableSignal<T> | ReadonlySignal<T> {
  if (!watchersLookup) throw new Error("`remote` must be called from within the make function.");

  const symbol = Symbol();

  const watch = makeWatch(symbol, watchersLookup!);
  const dependentOn = makeDependsOn(symbol, depsLookup!);

  const watchers = watchersLookup;
  const deps = depsLookup!;

  const fetchRemoteValue = args.get;
  const subscribe = args.subscribe;

  let value: T = null as T;
  let cached = false;

  const get = () => {
    if (currentScope) currentScope.add(dependentOn);
    if (cached) return value;

    value = fetchRemoteValue();
    cached = true;

    return value;
  };

  const dispose = subscribe(() => {
    cached = false;
    notify(symbol, watchers, deps);
  });

  // Register for clean up later if necessary
  remoteSources!.set(symbol, dispose);

  const peek = makePeek(get);
  const set = args.set;
  if (set) {
    const setter = (v: Setter<T>) => {
      const next = typeof v === "function" ? (v as (v: T) => T)(value) : v;
      set(next);
    };

    return {
      get,
      peek,
      set: setter,
      watch,
      dispose,
    };
  }

  return {
    get,
    peek,
    watch,
    dispose,
  };
}

/**
 * Internal utility to create a watch function for a signal
 * @internal
 */
function makeWatch(symbol: symbol, watchersLookup: Map<symbol, Set<() => void>>) {
  const watch = (fn: () => void) => {
    if (!watchersLookup.has(symbol)) watchersLookup.set(symbol, new Set());

    // Call the function immediately on first watch
    fn();

    const queue = () => addTask(fn);
    watchersLookup!.get(symbol)!.add(queue);

    return () => {
      const set = watchersLookup!.get(symbol);
      if (!set) return;

      set.delete(queue);
      if (set.size === 0) watchersLookup!.delete(symbol);
    };
  };

  return watch;
}

/**
 * Internal utility to track dependencies between signals
 * @internal
 */
function makeDependsOn(symbol: symbol, depsLookup: Map<symbol, Set<() => void>>) {
  const dependentOn = (fn: () => void) => {
    if (!depsLookup.has(symbol)) depsLookup.set(symbol, new Set());

    depsLookup.get(symbol)!.add(fn);

    return () => {
      const set = depsLookup.get(symbol);
      if (!set) return;

      set.delete(fn);
      if (set.size === 0) depsLookup.delete(symbol);
    };
  };

  return dependentOn;
}

/**
 * Internal utility to notify watchers and dependents of changes
 * @internal
 */
function notify(
  symbol: symbol,
  watchersLookup: Map<symbol, Set<() => void>>,
  depsLookup: Map<symbol, Set<() => void>>,
) {
  const watchers = watchersLookup.get(symbol);
  if (watchers) watchers.forEach((c) => c());

  const dependents = depsLookup.get(symbol);
  if (dependents) dependents.forEach((c) => c());
}

export function makeSelector<F extends Record<string, AllSignalTypes<any>>>(f: F) {
  const watchers = watchersLookup;
  const deps = depsLookup;
  const selector = (cb: <T>(f: F) => T) => {
    const cbRef = { current: cb };

    const prev = watchersLookup;
    const prevDeps = depsLookup;

    watchersLookup = watchers;
    depsLookup = deps;
    const fn = computed(() => cbRef.current(f));

    watchersLookup = prev;
    depsLookup = prevDeps;

    return fn;
  };

  return selector;
}

function makePeek<T>(get: () => T) {
  return () => {
    const prev = currentScope;
    currentScope = null;
    const value = get();
    currentScope = prev;

    return value;
  };
}
