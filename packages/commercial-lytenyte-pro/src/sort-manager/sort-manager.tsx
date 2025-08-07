import { Root } from "./root";
import { SortRow } from "./sort-row";
import { SortRows } from "./sort-rows";
import { useSortManager } from "./hooks/use-sort-manager";
import { SortColumnSelect } from "./sort-column-select";
import { SortValueSelect } from "./sort-value-select";
import { SortDirectionSelect } from "./sort-direction-select";
import { SortAdd } from "./sort-add";
import { SortRemove } from "./sort-remove";
import { SortCancel } from "./sort-cancel";
import { SortClear } from "./sort-clear";
import { SortApply } from "./sort-apply";

export const SortManager = {
  Root,
  Row: SortRow,
  Rows: SortRows,
  ColumnSelect: SortColumnSelect,
  ValueSelect: SortValueSelect,
  DirectionSelect: SortDirectionSelect,
  Add: SortAdd,
  Remove: SortRemove,

  Cancel: SortCancel,
  Clear: SortClear,
  Apply: SortApply,

  useSortManager,
};
