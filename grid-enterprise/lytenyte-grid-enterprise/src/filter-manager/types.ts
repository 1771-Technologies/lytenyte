import type { FilterSimpleColumn } from "@1771technologies/grid-types/core";

export type SemiPartialFilter = Partial<FilterSimpleColumn> & {
  kind: FilterSimpleColumn["kind"];
  columnId: FilterSimpleColumn["columnId"];
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
