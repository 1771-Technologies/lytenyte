import type { ApiPro, ColumnPro, RowNodeLeafPro } from "@1771technologies/grid-types/pro";

export function evaluateQuickFilter<D, E>(
  api: ApiPro<D, E>,
  columns: ColumnPro<D, E>[],
  quickFilter: string,
  row: RowNodeLeafPro<D>,
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
