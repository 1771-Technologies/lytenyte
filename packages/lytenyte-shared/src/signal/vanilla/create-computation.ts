import { SCOPE, STATE_CLEAN, STATE_DIRTY } from "../+constants.js";
import { G } from "../+globals.js";
import type { Computation, ComputedSignalOptions, Scope } from "../+types.js";
import { dispose } from "./dispose.js";
import { isNotEqual } from "./is-not-equal.js";
import { read } from "./read.js";

const ScopeNode = function Scope(this: Scope) {
  this[SCOPE] = null;
  this._children = null;
  if (G.currentScope) G.currentScope.append(this);
};

const ScopeProto = ScopeNode.prototype;
ScopeProto._context = G.defaultContext;
ScopeProto._handlers = null;
ScopeProto._compute = null;
ScopeProto._disposal = null;

ScopeProto.append = function (this: Scope, child: Scope) {
  child[SCOPE] = this;

  if (!this._children) {
    this._children = child;
  } else if (Array.isArray(this._children)) {
    this._children.push(child);
  } else {
    this._children = [this._children, child];
  }

  child._context =
    child._context === G.defaultContext ? this._context : { ...this._context, ...child._context };

  if (this._handlers) {
    child._handlers = !child._handlers ? this._handlers : [...child._handlers, ...this._handlers];
  }
};

ScopeProto.dispose = function (this: Scope) {
  dispose.call(this);
};

const ComputeNode = function Computation(
  this: Computation,
  initialValue: any,
  compute: any,
  options?: ComputedSignalOptions<any, any>,
) {
  ScopeNode.call(this);

  this._state = compute ? STATE_DIRTY : STATE_CLEAN;
  this._init = false;
  this._effect = false;
  this._sources = null;
  this._observers = null;
  this._value = initialValue;

  if (compute) this._compute = compute;
  if (options && options.dirty) this._changed = options.dirty;
};

const ComputeProto: Computation = ComputeNode.prototype;
Object.setPrototypeOf(ComputeProto, ScopeProto);
ComputeProto._changed = isNotEqual;
ComputeProto.call = read;

export function createComputation<T>(
  initialValue: T,
  compute: (() => T) | null,
  options?: ComputedSignalOptions<T>,
): Computation<T> {
  return new (ComputeNode as any)(initialValue, compute, options);
}

export function createScope(): Scope {
  return new (ScopeNode as any)();
}
