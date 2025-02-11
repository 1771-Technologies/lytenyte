import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export function getHeaderName<D>(column: ColumnEnterpriseReact<D>) {
  return column.headerName ?? column.id;
}
