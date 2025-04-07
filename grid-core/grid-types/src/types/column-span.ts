import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type ColumnSpanParams<A, D> = { api: A; row: RowNode<D> };
export type ColumnSpanCallback<A, D> = (p: ColumnSpanParams<A, D>) => number;

export type ColumnSpanParamsCore<D, E> = ColumnSpanParams<ApiCore<D, E>, D>;
export type ColumnSpanCallbackCore<D, E> = ColumnSpanCallback<ApiCore<D, E>, D>;

export type ColumnSpanParamsPro<D, E> = ColumnSpanParams<ApiPro<D, E>, D>;
export type ColumnSpanCallbackPro<D, E> = ColumnSpanCallback<ApiPro<D, E>, D>;
