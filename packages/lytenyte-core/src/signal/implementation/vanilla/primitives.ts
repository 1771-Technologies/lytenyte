import { NOOP, STATE_DISPOSED } from "../+constants.js";
import { G } from "../+globals.js";
import type { Dispose, MaybeDisposable, Scope } from "../+types.js";
import { compute } from "./compute.js";
import { createScope } from "./create-computation.js";
import { dispose } from "./dispose.js";
import { handleError } from "./handle-error.js";
import { isFunction } from "./is-function.js";
import { runEffects } from "./run-effects.js";

/**
 * Creates a computation root which is given a `dispose()` function to dispose of all inner
 * computations.
 */
export function root<T>(init: (dispose: Dispose) => T): T {
  const scope = createScope();
  return compute(scope, !init.length ? init : init.bind(null, dispose.bind(scope)), null) as T;
}

/**
 * Returns the current value stored inside the given compute function without triggering any
 * dependencies. Use `untrack` if you want to also disable scope tracking.
 */
export function peek<T>(fn: () => T): T {
  return compute<T>(G.currentScope, fn, null);
}

/**
 * Returns the current value inside a signal whilst disabling both scope _and_ observer
 * tracking. Use `peek` if only observer tracking should be disabled.
 */
export function untrack<T>(fn: () => T): T {
  return compute<T>(null, fn, null);
}

/**
 * By default, signal updates are batched on the microtask queue which is an async process. You can
 * flush the queue synchronously to get the latest updates by calling `tick()`.
 */
export function tick(): void {
  if (!G.runningEffects) runEffects();
}

/**
 * Returns the currently executing parent scope.
 */
export function getScope(): Scope | null {
  return G.currentScope;
}

/**
 * Runs the given function in the given scope so context and error handling continue to work.
 */
export function scoped<T>(run: () => T, scope: Scope | null): T | undefined {
  try {
    return compute<T>(scope, run, null);
  } catch (error) {
    handleError(scope, error);
    return;
  }
}

/**
 * Attempts to get a context value for the given key. It will start from the parent scope and
 * walk up the computation tree trying to find a context record and matching key. If no value can
 * be found `undefined` will be returned.
 */
export function getContext<T>(key: string | symbol, scope: Scope | null = G.currentScope): T | undefined {
  return scope?._context![key] as T | undefined;
}

/**
 * Attempts to set a context value on the parent scope with the given key. This will be a no-op if
 * no parent is defined.
 */
export function setContext<T>(key: string | symbol, value: T, scope: Scope | null = G.currentScope) {
  if (scope) scope._context = { ...scope._context, [key]: value };
}

/**
 * Runs the given function when an error is thrown in a child scope. If the error is thrown again
 * inside the error handler, it will trigger the next available parent scope handler.
 */
export function onError<T = Error>(handler: (error: T) => void): void {
  if (!G.currentScope) return;
  G.currentScope._handlers = G.currentScope._handlers ? [handler, ...G.currentScope._handlers] : [handler];
}

/**
 * Runs the given function when the parent scope computation is being disposed.
 */
export function onDispose(disposable: MaybeDisposable): Dispose {
  if (!disposable || !G.currentScope) return (disposable as Dispose) || NOOP;

  const node = G.currentScope;

  if (!node._disposal) {
    node._disposal = disposable;
  } else if (Array.isArray(node._disposal)) {
    node._disposal.push(disposable);
  } else {
    node._disposal = [node._disposal, disposable];
  }

  return function removeDispose() {
    if (node._state === STATE_DISPOSED) return;
    disposable.call(null);
    if (isFunction(node._disposal)) {
      node._disposal = null;
    } else if (Array.isArray(node._disposal)) {
      node._disposal.splice(node._disposal.indexOf(disposable), 1);
    }
  };
}
