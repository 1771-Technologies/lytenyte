import type { Grid, RowDataSource, RowFullWidthPredicate } from "../../+types";

export function getFullWidthCallback<T>(
  rds: RowDataSource<T>,
  predicate: RowFullWidthPredicate<T>,
  grid: Grid<T>,
) {
  return (r: number) => {
    const rowNode = rds.rowByIndex(r);
    if (!rowNode) return false;

    return predicate({ grid, row: rowNode, rowIndex: r });
  };
}
