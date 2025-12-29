import type { CellParams } from "../../types/column.js";

export function CellDefault({ column, row, api }: CellParams<any>) {
  if (row.data == null && row.loading) {
    return <div>Loading...</div>;
  }

  const field = api.columnField(column, row);
  return <div>{`${field ?? "-"}`}</div>;
}
