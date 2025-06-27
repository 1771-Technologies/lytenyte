import type {
  ApiCore,
  ColumnCore,
  FieldCore,
  RowNodeCore,
} from "@1771technologies/grid-types/core";
import { columnGetField } from "./column-get-field";
import type { ApiPro, ColumnPro, FieldPro } from "@1771technologies/grid-types/pro";

export const columnFieldComputer = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  row: RowNodeCore<D>,
  column: ColumnCore<D, E> | ColumnPro<D, E>,
  field: FieldCore<D, E> | FieldPro<D, E>,
) => {
  api = api as ApiCore<D, E>;
  column = column as ColumnCore<D, E>;
  field = field as FieldCore<D, E>;

  if (!api.rowIsLeaf(row)) return row.data[column.id];

  const value = columnGetField(row.data, field, column, api);

  return value;
};
