import type { Ln } from "../../types";
import type { RowFullWidthPredicate, RowSource } from "../../types/row";

export function getFullWidthFn<T>(
  rds: RowSource<T>,
  predicate: RowFullWidthPredicate<T> | null,
  api: Ln.API<T>,
) {
  if (!predicate) return null;
  return (r: number) => {
    const rowNode = rds.rowByIndex(r)?.get();
    if (!rowNode) return false;

    return predicate({ row: rowNode, rowIndex: r, api });
  };
}
