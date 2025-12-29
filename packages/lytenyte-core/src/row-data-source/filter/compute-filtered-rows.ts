import {
  evaluateDateFilter,
  evaluateNumberFilter,
  evaluateStringFilter,
  getDateFilterSettings,
  getNumberFilterSettings,
  getStringFilterSettings,
} from "@1771technologies/lytenyte-shared";
import type { FilterModelItem, Grid, RowLeaf } from "../../+types";
import type { FilterWithSettings } from "./+types";

export function computeFilteredRows<T>(
  rows: RowLeaf<T>[],
  grid: Grid<T> | null,
  filterModel: Record<string, FilterModelItem<T>>,
) {
  if (!grid) return rows;

  const lookup = grid.state.columnMeta.get().columnLookup;
  const filterEntries = Object.entries(filterModel).filter(([key]) => {
    return lookup.has(key);
  });
  if (!filterEntries.length) return rows;

  const filters = filterEntries
    .map(([id, filter]) => {
      if (!lookup.has(id)) return null;

      return createFilter(id, filter);
    })
    .filter((c) => c != null);

  const filtered: RowLeaf<T>[] = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];

    if (filters.every((filter) => evaluateFilter(row.data, grid, filter))) filtered.push(row);
  }

  return filtered;
}

function createFilter<T>(id: string, filter: FilterModelItem<T>): FilterWithSettings<T> {
  if (filter.kind === "date") {
    const settings = getDateFilterSettings(filter);

    return {
      ...filter,
      field: id,
      kind: "date",
      settings,
    };
  } else if (filter.kind === "number") {
    const settings = getNumberFilterSettings(filter);
    return {
      ...filter,
      field: id,
      kind: "number",
      settings,
    };
  } else if (filter.kind === "string") {
    const settings = getStringFilterSettings(filter);

    return {
      ...filter,
      field: id,
      kind: "string",
      settings,
    };
  } else if (filter.kind === "combination") {
    return {
      ...filter,
      kind: "combination",
      filters: filter.filters.map((f) => createFilter(id, f)) as any,
    };
  } else if (filter.kind === "func") {
    return filter;
  } else {
    throw new Error(`Invalid filter provided: ${JSON.stringify(filter)}`);
  }
}

function evaluateFilter<T>(row: T | null, grid: Grid<T>, filter: FilterWithSettings<T>): boolean {
  if (filter.kind === "date") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as string | null;
    return evaluateDateFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "string") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as string | null;
    return evaluateStringFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "number") {
    const fieldValue = grid.api.columnField(filter.field, { data: row, kind: "leaf" }) as number | null;
    return evaluateNumberFilter(filter, fieldValue, filter.settings);
  } else if (filter.kind === "func") {
    return filter.func({ data: row, grid });
  } else {
    if (filter.operator === "AND") return filter.filters.every((f) => evaluateFilter(row, grid, f));
    else return filter.filters.some((f) => evaluateFilter(row, grid, f));
  }
}
