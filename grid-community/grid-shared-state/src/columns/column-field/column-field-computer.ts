import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { Field, RowNode } from "@1771technologies/grid-types/community";
import { columnGetField } from "./column-get-field";

export const columnFieldComputer = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  row: RowNode<D>,
  column: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
  cacheId: "group" | "column" | "pivot" | "quick-search",
  field:
    | Field<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>
    | Field<ApiEnterprise<D, E>, D, ColumnEnterprise<D, E>>,
) => {
  api = api as ApiCommunity<D, E>;
  column = column as ColumnCommunity<D, E>;
  field = field as Field<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>;

  if (!api.rowIsLeaf(row)) return row.data[column.id];

  const s = api.getState();
  const cache = s.internal.fieldCacheRef[cacheId];
  cache[row.id] ??= {};
  const valueCache = cache[row.id];

  if (valueCache[column.id] !== undefined) return valueCache[column.id];

  const value = columnGetField(row.data, field, column, api);
  valueCache[column.id] = value;

  return value;
};
