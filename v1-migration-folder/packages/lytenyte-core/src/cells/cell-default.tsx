import type { CellRendererParams } from "../+types";

export function CellDefault<T>({ grid, column, row }: CellRendererParams<T>) {
  const r = grid.api.columnField(column, row);

  return <div>{`${r ?? ""}`}</div>;
}
