import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type RowSpanParams<A, D, C> = { api: A; row: RowNode<D>; column: C };
export type RowSpanCallback<A, D, C> = (p: RowSpanParams<A, D, C>) => number;

// Additional
export type RowSpanParamsCore<D, E> = RowSpanParams<ApiCore<D, E>, D, ColumnCore<D, E>>;
export type RowSpanCallbackCore<D, E> = RowSpanCallback<ApiCore<D, E>, D, ColumnCore<D, E>>;

export type RowSpanParamsPro<D, E> = RowSpanParams<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type RowSpanCallbackPro<D, E> = RowSpanCallback<ApiPro<D, E>, D, ColumnPro<D, E>>;
