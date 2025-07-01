import type { Column, Grid, RowDataSource } from "../../+types";

export function getSpanFn<T>(
  rds: RowDataSource<T>,
  grid: Grid<T>,
  visibleColumns: Column<T>[],
  span: "row" | "col",
) {
  return (r: number, c: number) => {
    const row = rds.rowByIndex(r);
    const column = visibleColumns[c];
    if (!row || !column) return 1;

    const spanFn = span === "col" ? column.colSpan : column.rowSpan;

    if (!spanFn) return 1;
    if (typeof spanFn === "number") return spanFn;

    return spanFn({ grid, rowIndex: r, colIndex: c, row });
  };
}
