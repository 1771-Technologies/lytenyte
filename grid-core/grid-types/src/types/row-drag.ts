import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type RowDragEventParams<A, D> = {
  event: DragEvent;
  api: A;
  rows: RowNode<D>[];
  overIndex: number;
  isExternal?: boolean;
  externalGridApi?: A;
};

export type RowDragEvent<A, D> = (p: RowDragEventParams<A, D>) => void;

export type RowDragPredicate<A, D> = (p: { api: A; row: RowNode<D> }) => boolean;

// Additional
export type RowDragEventParamsCore<D, E> = RowDragEventParams<ApiCore<D, E>, D>;
export type RowDragEventCore<D, E> = RowDragEvent<ApiCore<D, E>, D>;
export type RowDragPredicateCore<D, E> = RowDragPredicate<ApiCore<D, E>, D>;

export type RowDragEventParamsPro<D, E> = RowDragEventParams<ApiPro<D, E>, D>;
export type RowDragEventPro<D, E> = RowDragEvent<ApiPro<D, E>, D>;
export type RowDragPredicatePro<D, E> = RowDragPredicate<ApiPro<D, E>, D>;
