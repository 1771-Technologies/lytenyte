import type { ColumnFilterModel as CFE } from "@1771technologies/grid-types/enterprise";
import { evaluateColumnFilter } from "./utils/evaluate-column-filter";
import type { ApiCommunity, ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type { ColumnFilterModel, RowNode } from "@1771technologies/grid-types/community";

export const evaluateClientFilter = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  filterModel: CFE<ApiEnterprise<D, E>, D> | ColumnFilterModel<ApiCommunity<D, E>, D>,
  row: RowNode<D>,
  providedToDate: (value: unknown, column: ColumnEnterprise<D, E>) => Date,
) => {
  api = api as ApiEnterprise<D, E>;
  filterModel = filterModel as CFE<ApiEnterprise<D, E>, D>;

  const filters = Object.values(filterModel);
  if (!filters.length) return true;

  for (let i = 0; i < filters.length; i++) {
    if (!evaluateColumnFilter(api, filters[i], row, providedToDate)) return false;
  }

  return true;
};
