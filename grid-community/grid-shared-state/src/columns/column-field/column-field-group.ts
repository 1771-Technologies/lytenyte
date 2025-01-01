import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { columnFieldComputer } from "./column-field-computer";

export const columnFieldGroup = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  row: RowNode<D>,
  column: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  return columnFieldComputer(api, row, column, "group", column.rowGroupField ?? column.id);
};
