/**
 * Represents a value or a function that computes a new value based on the previous state.
 * Used for updating signal values either directly or through a transformation function.
 *
 * @template T - The type of the value being set
 */
export type Setter<T> = ((prev: T) => T) | T;

/**
 * A function that sets up a watcher for reactive changes and returns a cleanup function.
 *
 * @param fn - The callback function to execute when changes occur
 * @param immediate - Whether to execute the callback immediately upon setup. Defaults to true
 * @returns A cleanup function that removes the watcher when called
 *
 * @example
 * const cleanup = watch(() => {
 *   console.log('State changed!');
 * }); // Logs immediately and on future changes
 *
 * const cleanup = watch(() => {
 *   console.log('State changed!');
 * }, false); // Logs only on future changes
 */
export type Watch = (fn: () => void, immediate?: boolean) => () => void;

/**
 * A basic reactive signal that can be read, written to, and watched for changes.
 *
 * @template T - The type of value held by the signal
 *
 * @property get - Returns the current value of the signal
 * @property set - Updates the signal's value either directly or through an updater function
 * @property peek - Returns the current value without establishing a dependency
 * @property watch - Subscribes to changes in the signal's value
 */
export type Signal<T> = {
  readonly get: () => T;
  readonly set: (v: Setter<T>) => void;
  readonly peek: () => T;
  readonly watch: Watch;
};

/**
 * A signal that requires cleanup when no longer needed, typically used for remote data sources
 * or computed values that maintain subscriptions or other resources.
 *
 * @template T - The type of value held by the signal
 *
 * @property dispose - Cleans up any resources or subscriptions held by the signal
 */
export type DisposableSignal<T> = {
  readonly dispose: () => void;
} & Signal<T>;

/**
 * A signal that can only be read and watched, not modified directly.
 * Typically used for computed values or read-only remote data sources.
 *
 * @template T - The type of value provided by the signal
 *
 * @property get - Returns the current value
 * @property peek - Returns the current value without establishing a dependency
 * @property watch - Subscribes to changes in the value
 * @property dispose - Cleans up any resources or computations
 */
export type ReadonlySignal<T> = {
  readonly get: () => T;
  readonly peek: () => T;
  readonly watch: Watch;
  readonly dispose: () => void;
};

/**
 * Configuration options for creating a new signal.
 *
 * @template T - The type of value held by the signal
 *
 * @property equal - Optional custom equality function to determine when values have changed.
 *                  Defaults to Object.is if not provided
 * @property bind - Optional transformation function applied to new values before they are stored.
 *                 Useful for ensuring values meet certain constraints or formatting requirements
 * @property postUpdate - Optional callback function executed after the signal value is updated.
 *                       Can be used for side effects or notifications after state changes
 */
export interface SignalOptions<T> {
  readonly equal?: (l: T, r: T) => boolean;
  readonly bind?: (v: T) => T;
  readonly postUpdate?: () => void;
}
/**
 * Configuration for a read-only remote data source that can be observed for changes.
 *
 * @template T - The type of value provided by the remote source
 *
 * @property get - Function that retrieves the current value from the remote source
 * @property subscribe - Function to set up a subscription for changes from the remote source
 */
export interface ReadonlyRemoteSource<T> {
  readonly get: () => T;
  readonly subscribe: Watch;
}

/**
 * Configuration for a writable remote data source that can be both read from and written to.
 *
 * @template T - The type of value managed by the remote source
 *
 * @property set - Function to update the value in the remote source
 * @extends ReadonlyRemoteSource<T>
 */
export interface WritableRemoteSource<T> extends ReadonlyRemoteSource<T> {
  readonly set: (v: T) => void;
}

/**
 * Union type of all possible signal variants.
 *
 * @template T - The type of value held by the signal
 */
export type AllSignalTypes<T> = DisposableSignal<T> | ReadonlySignal<T> | Signal<T>;

/**
 * The main container type returned by the cascada function, holding the reactive store
 * and associated utilities.
 *
 * @template F - A record type mapping string keys to various types of signals
 *
 * @property store - The reactive store containing all signals
 * @property dispose - Function to clean up all reactive resources in the store
 * @property selector - Function to create computed values derived from the store's state
 */
export type Cascada<F extends Record<string, AllSignalTypes<any>>> = {
  store: F;
  dispose: () => void;
  selector: <T>(cb: (f: F) => T) => ReadonlySignal<T>;
};
