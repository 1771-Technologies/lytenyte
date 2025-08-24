import { G } from "../+globals.js";
import { runEffects } from "./run-effects.js";

export function flushEffects() {
  G.scheduledEffects = true;
  queueMicrotask(runEffects);
}
