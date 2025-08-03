export interface SortItem {
  readonly isCustom: boolean;
  readonly columnId?: string;
  readonly label?: string;
  readonly sortOn?:
    | "values"
    | "values_absolute"
    | "values_accented"
    | "values_nulls_first"
    | "values_absolute_nulls_first"
    | "values_accented_nulls_first"
    | "values_absolute_accented_nulls_first";
  readonly sortDirection: "ascending" | "descending";
}

export interface Option {
  readonly label: string;
  readonly value: string;
}
