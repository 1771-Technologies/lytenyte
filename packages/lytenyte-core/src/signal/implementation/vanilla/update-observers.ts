import { G } from "../+globals.js";
import type { Computation } from "../+types.js";
import { removeSourceObservers } from "./remove-source-observers.js";

export function updateObservers(node: Computation) {
  if (G.currentObservers) {
    if (node._sources) removeSourceObservers(node, G.currentObserversIndex);

    if (node._sources && G.currentObserversIndex > 0) {
      node._sources.length = G.currentObserversIndex + G.currentObservers.length;
      for (let i = 0; i < G.currentObservers.length; i++) {
        node._sources[G.currentObserversIndex + i] = G.currentObservers[i];
      }
    } else {
      node._sources = G.currentObservers;
    }

    let source: Computation;
    for (let i = G.currentObserversIndex; i < node._sources.length; i++) {
      source = node._sources[i];
      if (!source._observers) source._observers = [node];
      else source._observers.push(node);
    }
  } else if (node._sources && G.currentObserversIndex < node._sources.length) {
    removeSourceObservers(node, G.currentObserversIndex);
    node._sources.length = G.currentObserversIndex;
  }
}
