import type { RowFullWidthPredicate, RowSource } from "../../types/row";

export function getFullWidthFn<T>(rds: RowSource<T>, predicate: RowFullWidthPredicate<T> | null) {
  if (!predicate) return null;
  return (r: number) => {
    const rowNode = rds.rowByIndex(r)?.get();
    if (!rowNode) return false;

    return predicate({ row: rowNode, rowIndex: r });
  };
}
