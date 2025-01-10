import type { AllSignalTypes, signal, Cascada } from "@1771technologies/cascada";
import { cascada as vanilla } from "@1771technologies/cascada";
import { useRef, useState, useSyncExternalStore } from "react";
import type { CascadaStore } from "./types.js";

/**
 * Interface for the factory function used to create Cascada stores in React components.
 * Provides access to signal creation utilities while maintaining type safety.
 */
export interface CascadaReactCreationFn {
  readonly signal: typeof signal;
}

/**
 * Creates a React-optimized Cascada store with hooks for accessing reactive state.
 * This function enhances the vanilla Cascada store with React-specific functionality
 * for efficient integration with React's component lifecycle and reconciliation.
 *
 * @template F - A record type mapping string keys to reactive signals
 * @param fn - Factory function that initializes and returns a collection of signals
 * @returns A React-optimized store with hooks for accessing and selecting state
 *
 * @example
 * ```typescript
 * const store = cascada(() => ({
 *   count: signal(0),
 *   name: signal('Alice')
 * }));
 *
 * // In a component:
 * function Counter() {
 *   const count = store.useValue('count');
 *   return <div>{count}</div>;
 * }
 * ```
 */
export const cascada = <F extends Record<string, AllSignalTypes<any>>>(
  fn: () => F,
): CascadaStore<F> => {
  const store = vanilla(fn);

  return cascadaFromVanilla(store);
};

/**
 * React hook for creating a Cascada store within a component. The store is created only once
 * when the component mounts and persists across re-renders.
 *
 * @template F - A record type mapping string keys to reactive signals
 * @param fn - Factory function that creates the store's signals
 * @returns A React-optimized Cascada store instance
 *
 * @example
 * ```typescript
 * function UserProfile() {
 *   const store = useCascada(() => ({
 *     name: signal(''),
 *     email: signal(''),
 *     isValid: computed(() =>
 *       name.get().length > 0 &&
 *       email.get().includes('@')
 *     )
 *   }));
 *
 *   const name = store.useValue('name');
 *   const isValid = store.useValue('isValid');
 *
 *   return (
 *     <form>
 *       <input value={name} />
 *       {!isValid && <span>Please fill in all fields</span>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @remarks
 * - The store is created only once when the component mounts
 * - The store persists across component re-renders
 * - Store cleanup is handled automatically when the component unmounts
 * - Signals and computed values maintain referential stability
 */
export const useCascada = <F extends Record<string, AllSignalTypes<any>>>(fn: () => F) => {
  const [store, _] = useState(() => cascada(fn));
  return store;
};

/**
 * React hook for creating a React-optimized Cascada store from an existing vanilla Cascada instance.
 * This hook ensures the store is properly integrated with React's lifecycle and only created once.
 *
 * @template F - A record type mapping string keys to reactive signals
 * @param v - An existing vanilla Cascada store instance
 * @returns A React-optimized Cascada store with hooks for accessing state
 *
 * @example
 * ```typescript
 * // Create a vanilla store outside of React
 * const vanillaStore = vanilla(() => ({
 *   count: signal(0),
 *   doubleCount: computed(() => count.get() * 2)
 * }));
 *
 * // Use it in a React component
 * function Counter() {
 *   const store = useCascadaStore(vanillaStore);
 *   const count = store.useValue('count');
 *   return <div>{count}</div>;
 * }
 * ```
 */
export const useCascadaStore = <F extends Record<string, AllSignalTypes<any>>>(v: Cascada<F>) => {
  const [store, _] = useState(() => cascadaFromVanilla(v));

  return store;
};

/**
 * Converts a vanilla Cascada store into a React-optimized store with hooks for accessing state.
 * This function adds React-specific functionality while preserving the original store's behavior.
 *
 * @template F - A record type mapping string keys to reactive signals
 * @param store - The vanilla Cascada store to convert
 * @returns A React-optimized store with additional hooks for accessing state
 *
 * @remarks
 * - Adds `useValue` hook for accessing individual signals
 * - Adds `useSelector` hook for computing derived state
 * - Maintains referential stability of selectors
 * - Integrates with React's reconciliation process
 *
 * @example
 * ```typescript
 * const vanillaStore = vanilla(() => ({
 *   count: signal(0)
 * }));
 *
 * const reactStore = cascadaFromVanilla(vanillaStore);
 *
 * // Now you can use React hooks
 * function Counter() {
 *   const count = reactStore.useValue('count');
 *   return <div>{count}</div>;
 * }
 * ```
 */
export const cascadaFromVanilla = <F extends Record<string, AllSignalTypes<any>>>(
  store: Cascada<F>,
) => {
  const useSignal = (s: keyof (typeof store)["store"]) => {
    const signal = store.store[s];
    return useSyncExternalStore(signal.watch, signal.get, signal.get);
  };
  const useSelector = <T>(f: (v: F) => T, equal: (l: T, v: T) => boolean = Object.is): T => {
    const fn = useRef(f);
    fn.current = f;
    const equalRef = useRef(equal);
    equalRef.current = equal;
    const cbRef = useRef<() => any>(null as any);
    if (!cbRef.current) {
      cbRef.current = () => store.selector(fn.current);
    }
    const selectorRef = useRef<any>(null as any);
    if (!selectorRef.current) {
      const s = cbRef.current();
      let prev = s.get();
      selectorRef.current = {
        get: s.get,
        watch: (fn: () => void) => {
          const dispose = s.watch(() => {
            const current = s.get();
            if (equalRef.current(prev, current)) return;
            prev = current;
            fn();
          });
          return () => {
            dispose();
            s.dispose();
          };
        },
      };
    }
    return useSyncExternalStore(
      selectorRef.current.watch,
      selectorRef.current.get,
      selectorRef.current.get,
    );
  };
  return {
    ...store,
    useValue: useSignal,
    useSelector,
  };
};
