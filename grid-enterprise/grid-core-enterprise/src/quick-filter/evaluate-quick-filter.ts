import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/core";

export function evaluateQuickFilter<D, E>(
  api: ApiEnterprise<D, E>,
  columns: ColumnEnterprise<D, E>[],
  quickFilter: string,
  row: RowNodeLeaf<D>,
  caseSensitive: boolean,
) {
  const quickFilters = quickFilter
    .split(/\s+/)
    .map((c) => {
      return c.trim();
    })
    .filter((c) => !!c);

  for (let i = 0; i < columns.length; i++) {
    const field = api.columnQuickSearchField(row, columns[i]);

    const stringField = caseSensitive ? String(field) : String(field).toLowerCase();

    if (quickFilters.some((c) => stringField.includes(c))) return true;
  }

  return false;
}
