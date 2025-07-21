import type { CellRendererParams } from "../+types";

export function CellDefault<T>({ grid, column, row }: CellRendererParams<T>) {
  const r = grid.api.columnField(column, row);

  if (row.data == null && row.loading) {
    return <div>Loading...</div>;
  }

  return <div>{`${r ?? ""}`}</div>;
}
