import type { ColumnFilter as CFE } from "@1771technologies/grid-types/enterprise";
import { evaluateColumnFilter } from "./utils/evaluate-column-filter";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { ColumnFilter, RowNode } from "@1771technologies/grid-types/community";

export const evaluateClientFilter = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  filterModel: CFE<ApiEnterprise<D, E>, D>[] | ColumnFilter<ApiCommunity<D, E>, D>[],
  row: RowNode<D>,
) => {
  api = api as ApiEnterprise<D, E>;
  filterModel = filterModel as CFE<ApiEnterprise<D, E>, D>[];

  if (!filterModel.length) return true;

  for (const columnFilter of filterModel) {
    if (!evaluateColumnFilter(api, columnFilter, row)) return false;
  }

  return true;
};
