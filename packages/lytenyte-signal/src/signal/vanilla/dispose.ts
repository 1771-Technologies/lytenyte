import { SCOPE, STATE_DISPOSED } from "../+constants.js";
import type { Computation, Scope } from "../+types.js";
import { disposeNode } from "./dispose-node.js";

export function dispose(this: Scope, self = true) {
  if (this._state === STATE_DISPOSED) return;

  if (this._children) {
    if (Array.isArray(this._children)) {
      for (let i = this._children.length - 1; i >= 0; i--) {
        dispose.call(this._children[i]);
      }
    } else {
      dispose.call(this._children);
    }
  }

  if (self) {
    const parent = this[SCOPE];

    if (parent) {
      if (Array.isArray(parent._children)) {
        parent._children.splice(parent._children.indexOf(this), 1);
      } else {
        parent._children = null;
      }
    }

    disposeNode(this as Computation);
  }
}
