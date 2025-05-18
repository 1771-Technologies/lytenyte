import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export interface SortOptions {
  readonly isAccented?: boolean;
  readonly isAbsolute?: boolean;
  readonly nullsAppearFirst?: boolean;
}

export interface SortModelItem {
  readonly columnId: string;
  readonly options?: SortOptions;
  readonly isDescending?: boolean;
}

export type SortComparatorFn<A, D> = (
  api: A,
  leftField: unknown,
  rightField: unknown,
  leftRow: RowNode<D>,
  rightData: RowNode<D>,
  sort: SortModelItem,
) => number;

export type SortComparators = "string" | "number" | "date" | (string & {});

export type SortTypes = "asc" | "desc";
export type SortAccentModifier = "accented";
export type SortAbsoluteModifier = "abs";
export type SortNullModifier = "nulls-first";

export type SortCycleOption =
  | SortTypes
  | `${SortTypes}_${SortAccentModifier}`
  | `${SortTypes}_${SortAccentModifier}_${SortAbsoluteModifier}`
  | `${SortTypes}_${SortAccentModifier}_${SortNullModifier}`
  | `${SortTypes}_${SortAccentModifier}_${SortAbsoluteModifier}_${SortNullModifier}`
  | `${SortTypes}_${SortAbsoluteModifier}`
  | `${SortTypes}_${SortAbsoluteModifier}_${SortNullModifier}`
  | null;

// additional

export type SortOptionsCore = SortOptions;
export type SortModelItemCore = SortModelItem;
export type SortComparatorFnCore<D, E> = SortComparatorFn<ApiCore<D, E>, D>;
export type SortComparatorsCore = SortComparators;
export type SortTypesCore = SortTypes;
export type SortAccentModifierCore = SortAccentModifier;
export type SortAbsoluteModifierCore = SortAbsoluteModifier;
export type SortNullModifierCore = SortNullModifier;
export type SortCycleOptionCore = SortCycleOption;

export type SortOptionsPro = SortOptions;
export type SortModelItemPro = SortModelItem;
export type SortComparatorFnPro<D, E> = SortComparatorFn<ApiPro<D, E>, D>;
export type SortComparatorsPro = SortComparators;
export type SortTypesPro = SortTypes;
export type SortAccentModifierPro = SortAccentModifier;
export type SortAbsoluteModifierPro = SortAbsoluteModifier;
export type SortNullModifierPro = SortNullModifier;
export type SortCycleOptionPro = SortCycleOption;
