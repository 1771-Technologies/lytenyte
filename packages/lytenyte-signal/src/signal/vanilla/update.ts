import { STATE_CLEAN } from "../+constants.js";
import { G } from "../+globals.js";
import type { Computation } from "../+types.js";
import { cleanup } from "./cleanup.js";
import { compute } from "./compute.js";
import { handleError } from "./handle-error.js";
import { updateObservers } from "./update-observers.js";
import { write } from "./write.js";

export function update(node: Computation) {
  const prevObservers = G.currentObservers,
    prevObserversIndex = G.currentObserversIndex;

  G.currentObservers = null as Computation[] | null;
  G.currentObserversIndex = 0;

  try {
    cleanup(node);

    const result = compute(node, node._compute!, node);

    updateObservers(node);

    if (!node._effect && node._init) {
      write.call(node, result);
    } else {
      node._value = result;
      node._init = true;
    }
  } catch (error) {
    updateObservers(node);
    handleError(node, error);
  } finally {
    G.currentObservers = prevObservers;
    G.currentObserversIndex = prevObserversIndex;
    node._state = STATE_CLEAN;
  }
}
