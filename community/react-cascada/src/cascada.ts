/* eslint-disable react-hooks/rules-of-hooks */
import { useSyncExternalStore } from "react";
import { addTask } from "./scheduler.js";
import type { ReadonlySignal, Setter, Signal, SignalOptions, Watch } from "./types.js";

const identify = <T>(v: T) => v;
let watchersLookup: null | Map<symbol, Set<() => void>> = null;
let depsLookup: null | Map<symbol, Set<() => void>> = null;
let remoteSources: null | Map<symbol, () => void> = null;

let currentScope: null | Set<Watch>;

export const cascada = <F extends Record<string, any>>(fn: () => F): F => {
  const prevWatchers = watchersLookup;
  const prevDeps = depsLookup;
  const prevRemove = remoteSources;

  watchersLookup = new Map();
  depsLookup = new Map();
  remoteSources = new Map();

  const store = fn();

  watchersLookup = prevWatchers;
  depsLookup = prevDeps;
  remoteSources = prevRemove;

  return store;
};

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

  const s = { set, get, watch, peek: peak };
  const use = () => useSyncExternalStore(s.watch, s.get, s.get);

  return { ...s, use };
};

export function computed<T>(fn: () => T, set: (v: T) => void): Signal<T>;
export function computed<T>(fn: () => T): ReadonlySignal<T>;
export function computed<T>(fn: () => T, set?: (v: T) => void): ReadonlySignal<T> | Signal<T> {
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

  const s = { get, peek, watch };
  const use = () => useSyncExternalStore(s.watch, s.get, s.get);

  if (set) {
    const setInternal = (nextValue: Setter<T>) => {
      const next = typeof nextValue === "function" ? (nextValue as (v: T) => T)(value) : nextValue;
      set(next);
    };

    return { ...s, use, set: setInternal };
  }

  return { ...s, use };
}

function makeWatch(symbol: symbol, watchersLookup: Map<symbol, Set<() => void>>) {
  const watch = (fn: () => void, immediate = true) => {
    if (!watchersLookup.has(symbol)) watchersLookup.set(symbol, new Set());

    // Call the function immediately on first watch
    if (immediate) fn();

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

function makeDependsOn(symbol: symbol, depsLookup: Map<symbol, Set<() => void>>) {
  const dependentOn = (fn: () => void) => {
    if (!depsLookup.has(symbol)) depsLookup.set(symbol, new Set());

    depsLookup.get(symbol)!.add(fn);

    return () => {
      const set = depsLookup.get(symbol)!;
      if (!set) return;

      set.delete(fn);
      if (set.size === 0) depsLookup.delete(symbol);
    };
  };

  return dependentOn;
}

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

function makePeek<T>(get: () => T) {
  return () => {
    const prev = currentScope;
    currentScope = null;
    const value = get();
    currentScope = prev;

    return value;
  };
}
