import type { ApiCore, ColumnCore, RowNodeCore } from "@1771technologies/grid-types/core";
import { columnFieldComputer } from "./column-field-computer";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnFieldGroup = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  row: RowNodeCore<D>,
  column: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  return columnFieldComputer(api, row, column, "group", column.rowGroupField ?? column.id);
};
