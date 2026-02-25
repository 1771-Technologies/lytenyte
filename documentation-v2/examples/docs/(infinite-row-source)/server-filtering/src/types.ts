export type FilterStringOperator = "equals" | "not_equals" | "not_contains" | "contains";

export interface FilterString {
  readonly operator: FilterStringOperator;
  readonly value: string;
  readonly kind: "text";
}

export type FilterNumberOperator =
  | "equals"
  | "not_equals"
  | "less_than"
  | "greater_than"
  | "less_than_or_equal"
  | "greater_than_or_equal";
export interface FilterNumber {
  readonly operator: FilterNumberOperator;
  readonly value: number;
  readonly kind: "number";
}

export type FilterDateOperator = "before" | "after";

export interface FilterDate {
  readonly operator: FilterDateOperator;
  readonly value: string;
  readonly kind: "date";
}

export type GridFilter = FilterString | FilterDate | FilterNumber;
