import type { Field } from "@1771technologies/grid-types/community";
import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { get } from "@1771technologies/js-utils";

export function columnGetField<D, E>(
  data: any,
  field:
    | Field<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>
    | Field<ApiEnterprise<D, E>, D, ColumnEnterprise<D, E>>,
  column: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
) {
  if (data == null) return null;

  const fieldType = typeof field;
  if (fieldType === "string" || fieldType === "number") return data[field as any] as unknown;
  if (fieldType === "object") return get(data, (field as { path: string }).path);

  return (field as any)(data, column, api);
}
