import {
  evaluateDateFilter,
  evaluateNumberFilter,
  evaluateStringFilter,
  getDateFilterSettings,
  getNumberFilterSettings,
  getStringFilterSettings,
} from "@1771technologies/lytenyte-shared";
import type { FilterModelItem, FilterQuickSearchSensitivity, Grid, RowLeaf } from "../../+types";
import type { FilterWithSettings } from "./+types";

export function computeFilteredRows<T>(
  rows: RowLeaf<T>[],
  grid: Grid<T> | null,
  filterModel: FilterModelItem<T>[],
  quickSearch: string | null,
  sensitivity: FilterQuickSearchSensitivity,
) {
  if (!(filterModel.length || quickSearch) || !grid) return rows;

  const filters = filterModel.map(createFilter);

  const filtered: RowLeaf<T>[] = [];

  const base = grid.state.columnBase.get();
  const columns = grid.state.columns.get();

  const nonIgnored = columns.filter((c) => !(c.quickSearchIgnore ?? base.quickSearchIgnore));

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];

    if (!filters.every((filter) => evaluateFilter(row.data, grid, filter))) continue;

    if (quickSearch) {
      const pass = nonIgnored.some((c) => {
        const field = `${grid.api.columnField(c, { data: row.data, kind: "leaf" })}`;

        if (sensitivity === "case-insensitive")
          field.toLowerCase().includes(quickSearch.toLowerCase());
        return field.includes(quickSearch);
      });

      if (!pass) continue;
    }

    filtered.push(row);
  }

  return filtered;
}

function createFilter<T>(filter: FilterModelItem<T>): FilterWithSettings<T> {
  if (filter.kind === "date") {
    const settings = getDateFilterSettings(filter);

    return {
      ...filter,
      kind: "date",
      settings,
    };
  } else if (filter.kind === "number") {
    const settings = getNumberFilterSettings(filter);
    return {
      ...filter,
      kind: "number",
      settings,
    };
  } else if (filter.kind === "string") {
    const settings = getStringFilterSettings(filter);

    return {
      ...filter,
      kind: "string",
      settings,
    };
  } else if (filter.kind === "in") {
    return filter;
  } else if (filter.kind === "combination") {
    return {
      ...filter,
      kind: "combination",
      filters: filter.filters.map(createFilter) as any,
    };
  } else if (filter.kind === "func") {
    return filter;
  } else {
    throw new Error(`Invalid filter provided: ${JSON.stringify(filter)}`);
  }
}

function evaluateFilter<T>(row: T | null, grid: Grid<T>, filter: FilterWithSettings<T>): boolean {
  if (filter.kind === "date") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as
      | string
      | null;
    return evaluateDateFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "string") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as
      | string
      | null;
    return evaluateStringFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "number") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as
      | number
      | null;
    return evaluateNumberFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "func") {
    return filter.func({ data: row, grid });
  } else if (filter.kind === "in") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as any;

    return filter.operator === "in" ? filter.value.has(fieldValue) : !filter.value.has(fieldValue);
  } else {
    if (filter.operator === "AND") return filter.filters.every((f) => evaluateFilter(row, grid, f));
    else return filter.filters.some((f) => evaluateFilter(row, grid, f));
  }
}
