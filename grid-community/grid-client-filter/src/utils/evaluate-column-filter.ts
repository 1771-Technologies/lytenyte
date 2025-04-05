import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import { evaluateDate } from "./evaluate-date-filter";
import type { ColumnFilter } from "@1771technologies/grid-types/pro";
import type { RowNode } from "@1771technologies/grid-types/community";
import type { ColumnFilterModel } from "@1771technologies/grid-types/pro";
import type { FilterIn } from "@1771technologies/grid-types/pro";

export function evaluateColumnFilter<D, E>(
  api: ApiEnterprise<D, E>,
  filter: ColumnFilterModel<ApiEnterprise<D, E>, D>["string"],
  row: RowNode<D>,
  providedToDate: (value: unknown, column: ColumnEnterprise<D, E>) => Date,
): boolean {
  const simple = filter.simple ? evaluateFilter(api, filter.simple, row, providedToDate) : true;
  const inResult = filter.set ? evaluateInFilter(api, filter.set, row) : true;

  return simple && inResult;
}

function evaluateInFilter<D, E>(api: ApiEnterprise<D, E>, filter: FilterIn, row: RowNode<D>) {
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
}

function evaluateFilter<D, E>(
  api: ApiEnterprise<D, E>,
  filter: ColumnFilter<ApiEnterprise<D, E>, D>,
  row: RowNode<D>,
  providedToDate: (value: unknown, column: ColumnEnterprise<D, E>) => Date,
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
    const toDate = providedToDate;

    const rawValue = api.columnField(row, column) as number;
    const value = toDate(rawValue, column);

    return evaluateDate(value, filter);
  } else if (filter.kind === "function") {
    return filter.func(api, row);
  } else {
    if (filter.operator === "or") {
      return (
        evaluateFilter(api, filter.left, row, providedToDate) ||
        evaluateFilter(api, filter.right, row, providedToDate)
      );
    } else {
      return (
        evaluateFilter(api, filter.left, row, providedToDate) &&
        evaluateFilter(api, filter.right, row, providedToDate)
      );
    }
  }
}
