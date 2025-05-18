import type { ApiCore, ColumnCore, FieldCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro, FieldPro } from "@1771technologies/grid-types/pro";
import { get } from "@1771technologies/js-utils";

export function columnGetField<D, E>(
  data: any,
  field: FieldCore<D, E> | FieldPro<D, E>,
  column: ColumnCore<D, E> | ColumnPro<D, E>,
  api: ApiCore<D, E> | ApiPro<D, E>,
) {
  if (data == null) return null;

  const fieldType = typeof field;
  if (fieldType === "string" || fieldType === "number") return data[field as any] as unknown;
  if (fieldType === "object") return get(data, (field as { path: string }).path);

  return (field as any)(data, column, api);
}
