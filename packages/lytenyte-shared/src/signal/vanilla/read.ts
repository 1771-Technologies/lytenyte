import { STATE_DISPOSED } from "../+constants.js";
import { G } from "../+globals.js";
import type { Computation } from "../+types.js";
import { updateCheck } from "./update-check.js";

export function read(this: Computation): any {
  if (this._state === STATE_DISPOSED) return this._value;

  if (G.currentObserver && !this._effect) {
    if (
      !G.currentObservers &&
      G.currentObserver._sources &&
      G.currentObserver._sources[G.currentObserversIndex] == this
    ) {
      G.currentObserversIndex++;
    } else if (!G.currentObservers) G.currentObservers = [this];
    else G.currentObservers.push(this);
  }

  if (this._compute) updateCheck(this);

  return this._value;
}
