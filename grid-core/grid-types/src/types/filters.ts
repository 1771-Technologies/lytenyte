import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type FilterTextOperator =
  | "equal"
  | "not_equal"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains";

export interface FilterText {
  readonly kind: "text";
  readonly columnId: string;
  readonly operator: FilterTextOperator;
  readonly value: string;
}

export type FilterNumberOperator =
  | "equal"
  | "not_equal"
  | "greater_than"
  | "greater_than_or_equal"
  | "less_than"
  | "less_than_or_equal";

export interface FilterNumber {
  readonly kind: "number";
  readonly columnId: string;
  readonly operator: FilterNumberOperator;
  readonly value: number;
}

export type FilterDateOperator =
  | "equal"
  | "before"
  | "after"
  | "tomorrow"
  | "today"
  | "yesterday"
  | "next_week"
  | "this_week"
  | "last_week"
  | "next_month"
  | "this_month"
  | "last_month"
  | "next_quarter"
  | "this_quarter"
  | "last_quarter"
  | "next_year"
  | "this_year"
  | "last_year"
  | "ytd"
  | "all_dates_in_the_period";

export type FilterDatePeriod =
  | null
  | "quarter-1"
  | "quarter-2"
  | "quarter-3"
  | "quarter-4"
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export interface FilterDate {
  readonly kind: "date";
  readonly value: string;
  readonly columnId: string;
  readonly operator: FilterDateOperator;
  readonly datePeriod: FilterDatePeriod;
}

export interface FilterCombined<A, D> {
  readonly kind: "combined";
  readonly operator: "and" | "or";
  readonly left: FilterNonCombined<A, D>;
  readonly right: FilterNonCombined<A, D>;
}

export interface FilterFunction<A, D> {
  readonly kind: "function";
  readonly func: (api: A, row: RowNode<D>) => boolean;
}

export type FilterSimpleColumn = FilterText | FilterDate | FilterNumber;
export type FilterNonCombined<A, D> = FilterText | FilterNumber | FilterDate | FilterFunction<A, D>;

export type ColumnFilter<A, D> =
  | FilterText
  | FilterNumber
  | FilterDate
  | FilterCombined<A, D>
  | FilterFunction<A, D>;

export type ColumnFilterModel<A, D> = {
  [columnId: string]: { simple?: ColumnFilter<A, D> | null };
};

// Simplified
export type FilterTextOperatorCore = FilterTextOperator;
export type FilterTextCore = FilterText;
export type FilterNumberOperatorCore = FilterNumberOperator;
export type FilterNumberCore = FilterNumber;
export type FilterDateOperatorCore = FilterDateOperator;
export type FilterDatePeriodCore = FilterDatePeriod;
export type FilterDateCore = FilterDate;
export type FilterCombinedCore<D, E> = FilterCombined<ApiCore<D, E>, D>;
export type FilterFunctionCore<D, E> = FilterFunction<ApiCore<D, E>, D>;
export type FilterSimpleColumnCore = FilterSimpleColumn;
export type FilterNonCombinedCore<D, E> = FilterNonCombined<ApiCore<D, E>, D>;
export type ColumnFilterCore<D, E> = ColumnFilter<ApiCore<D, E>, D>;
export type ColumnFilterModelCore<D, E> = ColumnFilterModel<ApiCore<D, E>, D>;

export type FilterTextOperatorPro = FilterTextOperator;
export type FilterTextPro = FilterText;
export type FilterNumberOperatorPro = FilterNumberOperator;
export type FilterNumberPro = FilterNumber;
export type FilterDateOperatorPro = FilterDateOperator;
export type FilterDatePeriodPro = FilterDatePeriod;
export type FilterDatePro = FilterDate;
export type FilterCombinedPro<D, E> = FilterCombined<ApiPro<D, E>, D>;
export type FilterFunctionPro<D, E> = FilterFunction<ApiPro<D, E>, D>;
export type FilterSimpleColumnPro = FilterSimpleColumn;
export type FilterNonCombinedPro<D, E> = FilterNonCombined<ApiPro<D, E>, D>;
export type ColumnFilterPro<D, E> = ColumnFilter<ApiPro<D, E>, D>;
export type ColumnFilterModelPro<D, E> = ColumnFilterModel<ApiPro<D, E>, D>;
