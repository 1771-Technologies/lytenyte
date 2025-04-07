import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type RowFullWidthPredicateParams<A, D> = {
  api: A;
  row: RowNode<D>;
};
export type RowFullWidthPredicate<A, D> = (p: RowFullWidthPredicateParams<A, D>) => boolean;

export type RowFullWidthRendererParams<A, D> = {
  readonly api: A;
  readonly row: RowNode<D>;
};
export type RowFullWidthRenderer<A, D, E> = (p: RowFullWidthRendererParams<A, D>) => E;

// Aditional
export type RowFullWidthPredicateParamsCore<D, E> = RowFullWidthPredicateParams<ApiCore<D, E>, D>;
export type RowFullWdithPredicateCore<D, E> = RowFullWidthPredicate<ApiCore<D, E>, D>;
export type RowFullWidthRendererParamsCore<D, E> = RowFullWidthRendererParams<ApiCore<D, E>, D>;
export type RowFullWidthRendererCore<D, E> = RowFullWidthRenderer<ApiCore<D, E>, D, E>;

export type RowFullWidthPredicateParamsPro<D, E> = RowFullWidthPredicateParams<ApiPro<D, E>, D>;
export type RowFullWdithPredicatePro<D, E> = RowFullWidthPredicate<ApiPro<D, E>, D>;
export type RowFullWidthRendererParamsPro<D, E> = RowFullWidthRendererParams<ApiPro<D, E>, D>;
export type RowFullWidthRendererPro<D, E> = RowFullWidthRenderer<ApiPro<D, E>, D, E>;
