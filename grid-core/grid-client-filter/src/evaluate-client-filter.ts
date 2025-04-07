import { evaluateColumnFilter } from "./utils/evaluate-column-filter";
import type { ApiCore, ColumnFilterModelCore } from "@1771technologies/grid-types/core";
import type {
  ApiPro,
  ColumnFilterModelPro,
  ColumnPro,
  RowNodePro,
} from "@1771technologies/grid-types/pro";

export const evaluateClientFilter = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  filterModel: ColumnFilterModelPro<D, E> | ColumnFilterModelCore<D, E>,
  row: RowNodePro<D>,
  providedToDate: (value: unknown, column: ColumnPro<D, E>) => Date,
) => {
  api = api as ApiPro<D, E>;
  filterModel = filterModel as ColumnFilterModelPro<D, E>;

  const filters = Object.values(filterModel);
  if (!filters.length) return true;

  for (let i = 0; i < filters.length; i++) {
    if (!evaluateColumnFilter(api, filters[i], row, providedToDate)) return false;
  }

  return true;
};
