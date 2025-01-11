export type Setter<T> = ((prev: T) => T) | T;

export type Watch = (fn: () => void, immediate?: boolean) => () => void;

export type Signal<T> = {
  readonly get: () => T;
  readonly set: (v: Setter<T>) => void;
  readonly peek: () => T;
  readonly use: () => T;
  readonly watch: Watch;
};

export type DisposableSignal<T> = {
  readonly dispose: () => void;
} & Signal<T>;

export type ReadonlySignal<T> = {
  readonly get: () => T;
  readonly peek: () => T;
  readonly watch: Watch;
  readonly use: () => T;
  readonly dispose: () => void;
};

export interface SignalOptions<T> {
  readonly equal?: (l: T, r: T) => boolean;
  readonly bind?: (v: T) => T;
  readonly postUpdate?: () => void;
}

export interface ReadonlyRemoteSource<T> {
  readonly get: () => T;
  readonly subscribe: Watch;
}

export interface WritableRemoteSource<T> extends ReadonlyRemoteSource<T> {
  readonly set: (v: T) => void;
}

export type AllSignalTypes<T> = DisposableSignal<T> | ReadonlySignal<T> | Signal<T>;
