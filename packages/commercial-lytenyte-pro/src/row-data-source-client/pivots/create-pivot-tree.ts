import type { Column, ColumnPivotModel, Grid, RowLeaf } from "../../+types";

export function createPivotTree<T>(
  grid: Grid<T>,
  values: ColumnPivotModel<T>["values"],
  columns: ColumnPivotModel<T>["columns"],
  lookup: Map<string, Column<T>>,
  leafRows: RowLeaf<T>[],
) {
  const sx = grid;

  const measureEntries = values.length ? values.map((c) => c.field) : ["__EMPTY_LNG__"];

  if (!measureEntries.length || !columns.length) {
    return [];
  }

  const pivotedColumns = columns.map((p) => lookup.get(p.field)!);

  const separator = sx.state.columnGroupJoinDelimiter.get();

  const paths = new Set<string>();

  for (let i = 0; i < leafRows.length; i++) {
    const current: string[] = [];
    const row = leafRows[i];
    for (const column of pivotedColumns) {
      const pivotKey = String(grid.api.columnField(column, row));
      current.push(pivotKey);
    }

    for (const measure of measureEntries) {
      paths.add([...current, measure].join(separator));
    }
  }
  measureEntries.forEach((id) => paths.add(`total${separator}${id}`));

  return [...paths];
}
