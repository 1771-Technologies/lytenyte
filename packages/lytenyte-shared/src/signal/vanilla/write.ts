import { STATE_DIRTY } from "../+constants.js";
import type { Computation } from "../+types.js";
import { isFunction } from "./is-function.js";
import { notify } from "./notify.js";

export function write(this: Computation, newValue: any): any {
  const value = isFunction(newValue) ? newValue(this._value) : newValue;

  if (this._changed(this._value, value)) {
    this._value = value;
    if (this._observers) {
      for (let i = 0; i < this._observers.length; i++) {
        notify(this._observers[i], STATE_DIRTY);
      }
    }
  }

  return this._value;
}
