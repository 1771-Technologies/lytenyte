import {
  evaluateDateFilter,
  evaluateNumberFilter,
  evaluateStringFilter,
  getDateFilterSettings,
  getNumberFilterSettings,
  getStringFilterSettings,
} from "@1771technologies/lytenyte-shared";
import type { FilterModelItem, Grid } from "../../+types";
import type { FilterWithSettings } from "./+types";

export function computeFilteredRows<T>(
  rows: T[],
  grid: Grid<T> | null,
  filterModel: FilterModelItem<T>[],
) {
  if (!filterModel.length || !grid) return rows;

  const filters = filterModel.map(createFilter);

  const filtered: T[] = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];

    if (filters.every((filter) => evaluateFilter(row, grid, filter))) filtered.push(row);
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

function evaluateFilter<T>(row: T, grid: Grid<T>, filter: FilterWithSettings<T>): boolean {
  if (filter.kind === "date") {
    const fieldValue = grid.api.fieldForColumn(filter.field, { data: row, kind: "leaf" }) as
      | string
      | null;
    return evaluateDateFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "string") {
    const fieldValue = grid.api.fieldForColumn(filter.field, { data: row, kind: "leaf" }) as
      | string
      | null;
    return evaluateStringFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "number") {
    const fieldValue = grid.api.fieldForColumn(filter.field, { data: row, kind: "leaf" }) as
      | number
      | null;
    return evaluateNumberFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "func") {
    return filter.func({ data: row, grid });
  } else {
    if (filter.operator === "AND") return filter.filters.every((f) => evaluateFilter(row, grid, f));
    else return filter.filters.some((f) => evaluateFilter(row, grid, f));
  }
}
