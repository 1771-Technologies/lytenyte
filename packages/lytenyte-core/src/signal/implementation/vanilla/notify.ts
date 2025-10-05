import { STATE_CHECK, STATE_CLEAN } from "../+constants.js";
import { G } from "../+globals.js";
import type { Computation } from "../+types.js";
import { flushEffects } from "./flush-effect.js";

export function notify(node: Computation, state: number) {
  if (node._state >= state) return;

  if (node._effect && node._state === STATE_CLEAN) {
    G.effects.push(node);
    if (!G.scheduledEffects) flushEffects();
  }

  node._state = state;
  if (node._observers) {
    for (let i = 0; i < node._observers.length; i++) {
      notify(node._observers[i], STATE_CHECK);
    }
  }
}
