import { columnFieldComputer } from "@1771technologies/grid-shared-state";
import type { ApiPro, ColumnPro, RowNodePro } from "@1771technologies/grid-types/pro";

export function quickSearchField<D, E>(
  api: ApiPro<D, E>,
  row: RowNodePro<D>,
  column: ColumnPro<D, E>,
) {
  return columnFieldComputer(
    api,
    row,
    column,
    "quick-search",
    column.quickSearchField ?? column.field ?? column.id,
  );
}
