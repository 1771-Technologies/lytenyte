import type { Computation, ReadSignal } from "../+types.js";
import { isNotEqual } from "./is-not-equal.js";
import { onDispose } from "./primitives.js";
import { read } from "./read.js";
import { effect } from "./signal.js";
import { write } from "./write.js";

export interface SelectorSignal<T> {
  (key: T): ReadSignal<boolean>;
}

/**
 * Creates a signal that observes the given `source` and returns a new signal who only notifies
 * observers when entering or exiting a specified key.
 */
export function selector<T>(source: ReadSignal<T>): SelectorSignal<T> {
  let currentKey: T | undefined;
  const nodes = new Map<T, Selector<T>>();

  effect(() => {
    const newKey = source(),
      prev = nodes.get(currentKey!),
      next = nodes.get(newKey);

    if (prev) write.call(prev, false);
    if (next) write.call(next, true);
    currentKey = newKey;
  });

  return function observeSelector(key: T) {
    let node = nodes.get(key);

    if (!node) nodes.set(key, (node = new (Selector as any)(key, key === currentKey, nodes)));

    node!._refs += 1;
    onDispose(node);

    return read.bind(node!);
  };
}

interface Selector<T = any> extends Computation {
  _key: T;
  _value: boolean;
  _nodes: Map<T, Selector> | null;
  _refs: number;
  call(): void;
}

function Selector<T>(this: Selector<T>, key: T, initialValue: boolean, nodes: Map<T, Selector>) {
  this._state = /** CLEAN */ 0;
  this._key = key;
  this._value = initialValue;
  this._refs = 0;
  this._nodes = nodes;
  this._observers = null;
}

const SelectorProto = Selector.prototype;
SelectorProto._changed = isNotEqual;
SelectorProto.call = function (this: Selector) {
  this._refs -= 1;
  if (!this._refs) {
    this._nodes!.delete(this._key);
    this._nodes = null;
  }
};
