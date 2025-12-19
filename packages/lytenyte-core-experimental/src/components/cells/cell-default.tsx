import type { Root } from "../../root/root";

export function CellDefault<T>({ column, row, api }: Root.CellParams<T>) {
  if (row.data == null && row.loading) {
    return <div>Loading...</div>;
  }

  const field = api.columnField(column, row);
  return <div>{`${field ?? "-"}`}</div>;
}
