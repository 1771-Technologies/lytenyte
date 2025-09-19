import type { Computation } from "../+types.js";

export function removeSourceObservers(node: Computation, index: number) {
  let source: Computation, swap: number;

  for (let i = index; i < node._sources!.length; i++) {
    source = node._sources![i];
    if (source._observers) {
      swap = source._observers.indexOf(node);
      source._observers[swap] = source._observers[source._observers.length - 1];
      source._observers.pop();
    }
  }
}
