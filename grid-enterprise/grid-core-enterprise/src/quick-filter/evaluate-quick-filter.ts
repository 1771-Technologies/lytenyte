import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";

export function evaluateQuickFilter<D, E>(
  api: ApiEnterprise<D, E>,
  columns: ColumnEnterprise<D, E>[],
  quickFilter: string,
  row: RowNodeLeaf<D>,
) {
  for (let i = 0; i < columns.length; i++) {
    const field = api.columnQuickSearchField(row, columns[i]);

    if (!quickFilter.includes(`${field}`)) return false;
  }

  return true;
}
