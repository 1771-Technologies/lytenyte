import { Root } from "./root.js";
import { SortRow } from "./sort-row.js";
import { SortRows } from "./sort-rows.js";
import { useSortManager } from "./hooks/use-sort-manager.js";
import { SortColumnSelect } from "./sort-column-select.js";
import { SortValueSelect } from "./sort-value-select.js";
import { SortDirectionSelect } from "./sort-direction-select.js";
import { SortAdd } from "./sort-add.js";
import { SortRemove } from "./sort-remove.js";
import { SortCancel } from "./sort-cancel.js";
import { SortClear } from "./sort-clear.js";
import { SortApply } from "./sort-apply.js";

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
