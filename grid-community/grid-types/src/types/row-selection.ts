import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type RowSelectionPointerActivator = "single-click" | "double-click" | "none";
export type RowSelectionMode = "single" | "multiple" | "none";
export type RowSelectionCheckbox = "normal" | "hide-for-disabled" | "hide";
export type RowSelectionPredicateParams<A, D> = {
  readonly api: A;
  readonly row: RowNode<D>;
};
export type RowSelectionPredicate<A, D> = (p: RowSelectionPredicateParams<A, D>) => boolean;

export type RowSelectionEventParams<A> = {
  readonly api: A;
  readonly rowIds: string[];
};
export type RowSelectionEvent<A> = (p: RowSelectionEventParams<A>) => void;

// Additional
export type RowSelectionPointerActivatorCore = RowSelectionPointerActivator;
export type RowSelectionModeCore = RowSelectionMode;
export type RowSelectionCheckboxCore = RowSelectionCheckbox;
export type RowSelectionPredicateParamsCore<D, E> = RowSelectionPredicateParams<ApiCore<D, E>, D>;
export type RowSelectionPredicateCore<D, E> = RowSelectionPredicate<ApiCore<D, E>, D>;
export type RowSelectionEventParamsCore<D, E> = RowSelectionEventParams<ApiCore<D, E>>;
export type RowSelectionEventCore<D, E> = RowSelectionEvent<ApiCore<D, E>>;

export type RowSelectionPointerActivatorPro = RowSelectionPointerActivator;
export type RowSelectionModePro = RowSelectionMode;
export type RowSelectionCheckboxPro = RowSelectionCheckbox;
export type RowSelectionPredicateParamsPro<D, E> = RowSelectionPredicateParams<ApiPro<D, E>, D>;
export type RowSelectionPredicatePro<D, E> = RowSelectionPredicate<ApiPro<D, E>, D>;
export type RowSelectionEventParamsPro<D, E> = RowSelectionEventParams<ApiPro<D, E>>;
export type RowSelectionEventPro<D, E> = RowSelectionEvent<ApiPro<D, E>>;
