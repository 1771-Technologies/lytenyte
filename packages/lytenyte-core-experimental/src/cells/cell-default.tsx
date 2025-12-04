import type { Ln } from "../types.js";

export function CellDefault<T>({ column, row, api }: Ln.CellParams<T>) {
  if (row.data == null && row.loading) {
    return <div>Loading...</div>;
  }

  const field = api.columnField(column, row);
  return <div>{`${field ?? "-"}`}</div>;
}
