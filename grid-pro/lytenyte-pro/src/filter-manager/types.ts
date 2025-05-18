import type { FilterSimpleColumnProReact } from "../types";

export type SemiPartialFilter = Partial<FilterSimpleColumnProReact> & {
  kind: FilterSimpleColumnProReact["kind"];
  columnId: FilterSimpleColumnProReact["columnId"];
};

export interface SimpleFilterItemProps {
  readonly value: SemiPartialFilter;
  readonly onFilterChange: (v: SemiPartialFilter) => void;
}

export type FlatSimpleFilters = [SemiPartialFilter, "or" | "and" | null][];

export interface SimpleFilterProps {
  readonly filters: FlatSimpleFilters;
  readonly onFiltersChange: (v: FlatSimpleFilters) => void;
  readonly noChoiceLabel?: string;
}
