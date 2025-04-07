import type { ApiCore } from "../export-core";
import type { FieldTypePath } from "./field";

export type AggBuiltIns = "sum" | "min" | "max" | "avg" | "count" | "first" | "last" | "group";
export type AggFn<A> = (data: unknown[], api: A) => unknown;
export type AggFns<A> = { [id: string]: AggFn<A> };

export type AggField = string | number | { kind: FieldTypePath; path: string };

export type AggModel<A> = {
  [columnId: string]: {
    fn: AggBuiltIns | (string & {}) | AggFn<A>;
  };
};

// Simplified Types

export type AggBuiltInsCore = AggBuiltIns;
export type AggFnCore<D, E> = AggFn<ApiCore<D, E>>;
export type AggFnsCore<D, E> = AggFns<ApiCore<D, E>>;
export type AggModelCore<D, E> = AggModel<ApiCore<D, E>>;

export type AggBuiltInsPro = AggBuiltIns;
export type AggFnPro<D, E> = AggFn<ApiCore<D, E>>;
export type AggFnsPro<D, E> = AggFns<ApiCore<D, E>>;
export type AggModelPro<D, E> = AggModel<ApiCore<D, E>>;
