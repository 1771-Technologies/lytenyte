import { STATE_CHECK, STATE_DIRTY, STATE_CLEAN } from "../+constants.js";
import type { Computation } from "../+types.js";
import { update } from "./update.js";

export function updateCheck(node: Computation) {
  if (node._state === STATE_CHECK) {
    for (let i = 0; i < node._sources!.length; i++) {
      updateCheck(node._sources![i]);
      if ((node._state as number) === STATE_DIRTY) {
        // Stop the loop here so we won't trigger updates on other parents unnecessarily
        // If our computation changes to no longer use some sources, we don't
        // want to update() a source we used last time, but now don't use.
        break;
      }
    }
  }

  if (node._state === STATE_DIRTY) update(node);
  else node._state = STATE_CLEAN;
}
