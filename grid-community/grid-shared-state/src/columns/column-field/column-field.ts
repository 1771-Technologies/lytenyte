import type { RowNode } from "@1771technologies/grid-types/core";
import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { columnFieldComputer } from "./column-field-computer";

export const columnField = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  row: RowNode<D>,
  column: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  return columnFieldComputer(api, row, column, "column", column.field ?? column.id);
};
