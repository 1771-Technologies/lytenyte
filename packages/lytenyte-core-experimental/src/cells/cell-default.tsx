import type { CellParams } from "../types/column";

export function CellDefault<T>({ row }: CellParams<T>) {
  if (row.data == null && row.loading) {
    return <div>Loading...</div>;
  }

  // TODO;
  return <div>-</div>;
}
