import type { SCOPE } from "./+constants.js";

export interface Callable<This = unknown, Return = void> {
  call($this: This): Return;
}

export type ContextRecord = Record<string | symbol, unknown>;

export type ErrorHandler<T = Error> = (error: T) => void;
export type Disposable = Callable;
export type Dispose = () => void;

export type Maybe<T> = T | void | null | undefined | false;
export type MaybeFunction = Maybe<(...args: any) => any>;
export type MaybeDisposable = Maybe<Disposable>;
export type MaybeStopEffect = Maybe<() => void>;
export type MaybeSignal<T> = MaybeFunction | ReadSignal<T>;

export type NextValue<T> = (prevValue: T) => T;

export type ReadSignal<T> = () => T;
export interface WriteSignal<T> extends ReadSignal<T> {
  set: (value: T | NextValue<T>) => T;
}

export interface Scope {
  [SCOPE]: Scope | null;

  _state: number;
  _compute: unknown;
  _children: Scope | Scope[] | null;
  _context: ContextRecord;
  _handlers: ErrorHandler<any>[] | null;
  _disposal: Disposable | Disposable[] | null;

  append(scope: Scope): void;
  dispose(): void;
}

export interface Computation<T = any> extends Scope {
  _effect: boolean;
  _init: boolean;
  _value: T;
  _sources: Computation[] | null;
  _observers: Computation[] | null;

  _compute: (() => T) | null;
  _changed: (prev: T, next: T) => boolean;

  call(this: Computation<T>): T;
}

export interface SignalOptions<T> {
  dirty?: (prev: T, next: T) => boolean;
}

export interface ComputedSignalOptions<T, R = never> extends SignalOptions<T> {
  initial?: R;
}
