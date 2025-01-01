import type { ApiEnterprise } from "@1771technologies/grid-types";
import { evaluateDate } from "./evaluate-date-filter";
import type { ColumnFilter } from "@1771technologies/grid-types/enterprise";
import type { RowNode } from "@1771technologies/grid-types/community";

export function evaluateColumnFilter<D, E>(
  api: ApiEnterprise<D, E>,
  filter: ColumnFilter<ApiEnterprise<D, E>, D>,
  row: RowNode<D>,
): boolean {
  return evaluateFilter(api, filter, row);
}

function evaluateFilter<D, E>(
  api: ApiEnterprise<D, E>,
  filter: ColumnFilter<ApiEnterprise<D, E>, D>,
  row: RowNode<D>,
): boolean {
  if (filter.kind === "text") {
    const column = api.columnById(filter.columnId)!;
    const value = api.columnField(row, column) as string;

    if (filter.operator === "equal") {
      return value === filter.value;
    } else if (filter.operator === "not_equal") {
      return value !== filter.value;
    } else if (filter.operator === "ends_with") {
      return `${value}`.endsWith(filter.value);
    } else if (filter.operator === "begins_with") {
      return `${value}`.startsWith(filter.value);
    } else if (filter.operator === "contains") {
      return `${value}`.includes(filter.value);
    } else {
      return !`${value}`.includes(filter.value);
    }
  } else if (filter.kind === "number") {
    const column = api.columnById(filter.columnId)!;
    const value = api.columnField(row, column) as number;

    if (filter.operator === "equal") {
      return value === filter.value;
    } else if (filter.operator === "not_equal") {
      return value !== filter.value;
    } else if (filter.operator === "less_than") {
      return value < filter.value;
    } else if (filter.operator === "greater_than") {
      return value > filter.value;
    } else if (filter.operator === "less_than_or_equal") {
      return value <= filter.value;
    } else {
      return value >= filter.value;
    }
  } else if (filter.kind === "date") {
    const column = api.columnById(filter.columnId)!;
    const toDate = column.filterParams?.toDate ?? ((d: number) => new Date(d));

    const rawValue = api.columnField(row, column) as number;
    const value = toDate(rawValue);

    return evaluateDate(value, filter);
  } else if (filter.kind === "registered") {
    const funcs = api.getState().filterFunctions.peek();

    const fn = funcs[filter.id];

    return fn(api, row);
  } else if (filter.kind === "function") {
    return filter.func(api, row);
  } else if (filter.kind === "in") {
    const expr = filter as unknown as {
      columnId: string;
      set: Set<unknown>;
      operator: string;
    };
    const column = api.columnById(expr.columnId);
    if (!column) return false;

    const value = api.columnField(row, column);

    const result = expr.set.has(value);

    return expr.operator === "in" ? result : !result;
  } else {
    if (filter.operator === "or") {
      return evaluateFilter(api, filter.left, row) || evaluateFilter(api, filter.right, row);
    } else {
      return evaluateFilter(api, filter.left, row) && evaluateFilter(api, filter.right, row);
    }
  }
}
