import type { CellRendererParams } from "../../+types";

export function CellDefault<T>({ grid, column, row }: CellRendererParams<T>) {
  const r = grid.api.fieldForColumn(column, row.data);
  return <div>{`${r}`}</div>;
}
