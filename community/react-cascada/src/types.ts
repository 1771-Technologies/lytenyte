export type Setter<T> = ((prev: T) => T) | T;

export type Watch = (fn: () => void, immediate?: boolean) => () => void;

export type Signal<T> = {
  readonly get: () => T;
  readonly set: (v: Setter<T>) => void;
  readonly peek: () => T;
  readonly use: () => T;
  readonly watch: Watch;
};

export type ReadonlySignal<T> = {
  readonly get: () => T;
  readonly peek: () => T;
  readonly watch: Watch;
  readonly use: () => T;
};

export interface SignalOptions<T> {
  readonly equal?: (l: T, r: T) => boolean;
  readonly bind?: (v: T) => T;
  readonly postUpdate?: () => void;
}
