import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type RowDetailParams<A, D> = {
  readonly api: A;
  readonly row: RowNode<D>;
};

export type RowDetailHeight<A, D> = number | ((p: RowDetailParams<A, D>) => number);
export type RowDetailEnabled<A, D> = boolean | "all" | ((p: RowDetailParams<A, D>) => boolean);
export type RowDetailRenderer<A, D, E> = (p: RowDetailParams<A, D>) => E;

export type RowDetailParamsCore<D, E> = RowDetailParams<ApiCore<D, E>, D>;
export type RowDetailHeightCore<D, E> = RowDetailHeight<ApiCore<D, E>, D>;
export type RowDetailEnabledCore<D, E> = RowDetailEnabled<ApiCore<D, E>, D>;
export type RowDetailRendererCore<D, E> = RowDetailRenderer<ApiCore<D, E>, D, E>;

export type RowDetailParamsPro<D, E> = RowDetailParams<ApiPro<D, E>, D>;
export type RowDetailHeightPro<D, E> = RowDetailHeight<ApiPro<D, E>, D>;
export type RowDetailEnabledPro<D, E> = RowDetailEnabled<ApiPro<D, E>, D>;
export type RowDetailRendererPro<D, E> = RowDetailRenderer<ApiPro<D, E>, D, E>;
