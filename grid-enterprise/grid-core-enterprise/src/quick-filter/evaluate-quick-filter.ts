import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";

export function evaluateQuickFilter<D, E>(
  api: ApiEnterprise<D, E>,
  columns: ColumnEnterprise<D, E>[],
  quickFilter: string,
  row: RowNodeLeaf<D>,
  caseSensitive: boolean,
) {
  for (let i = 0; i < columns.length; i++) {
    const field = api.columnQuickSearchField(row, columns[i]);

    const stringField = caseSensitive ? String(field) : String(field).toLowerCase();

    if (stringField.includes(quickFilter)) return true;
  }

  return false;
}
