import { STATE_CLEAN } from "../+constants.js";
import { G } from "../+globals.js";
import { runTop } from "./run-top.js";

export function runEffects() {
  if (!G.effects.length) {
    G.scheduledEffects = false;
    return;
  }

  G.runningEffects = true;

  for (let i = 0; i < G.effects.length; i++) {
    if (G.effects[i]._state !== STATE_CLEAN) runTop(G.effects[i]);
  }

  G.effects = [];
  G.scheduledEffects = false;
  G.runningEffects = false;
}
