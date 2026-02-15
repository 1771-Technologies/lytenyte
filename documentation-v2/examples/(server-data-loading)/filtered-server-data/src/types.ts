export type FilterStringOperator = "equals" | "not_equals" | "less_than" | "greater_than" | "contains";

export interface FilterString {
  readonly operator: FilterStringOperator;
  readonly value: string;
  readonly kind: "text";
}

export type FilterDateOperator = "before" | "after";

export interface FilterDate {
  readonly operator: FilterDateOperator;
  readonly value: string;
  readonly kind: "date";
}

export type GridFilter = FilterString | FilterDate;
