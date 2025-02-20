import { columnFieldComputer } from "@1771technologies/grid-shared-state";
import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";

export function quickSearchField<D, E>(
  api: ApiEnterprise<D, E>,
  row: RowNode<D>,
  column: ColumnEnterprise<D, E>,
) {
  return columnFieldComputer(
    api,
    row,
    column,
    "quick-search",
    column.quickSearchField ?? column.field ?? column.id,
  );
}
