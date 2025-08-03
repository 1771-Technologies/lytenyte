import { FilterRow } from "./filter-row";
import { FilterRows } from "./filter-rows";
import { Root } from "./root";
import { useSimpleFilter } from "./use-simple-filter";

export const SimpleFilter = {
  Root,
  Rows: FilterRows,
  Row: FilterRow,

  useSimpleFilter,
};
