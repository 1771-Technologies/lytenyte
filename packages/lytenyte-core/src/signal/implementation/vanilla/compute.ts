import { G } from "../+globals.js";
import type { Callable, Computation, Scope } from "../+types.js";

export function compute<Result>(
  scope: Scope | null,
  compute: Callable<Scope | null, Result>,
  observer: Computation | null,
): Result {
  const prevScope = G.currentScope,
    prevObserver = G.currentObserver;

  G.currentScope = scope;
  G.currentObserver = observer;

  try {
    return compute.call(scope);
  } finally {
    G.currentScope = prevScope;
    G.currentObserver = prevObserver;
  }
}
