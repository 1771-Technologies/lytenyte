import type { Column, ColumnPivotModel, Grid, RowLeaf } from "../../+types";
import { createColumnPivotsFromPaths } from "./create-pivot-columns-from-paths";
import { createPivotTree } from "./create-pivot-tree";

export function createPivotColumns<T>(
  model: ColumnPivotModel<T>,
  lookup: Map<string, Column<T>>,
  grid: Grid<T>,
  leafRows: RowLeaf<T>[],
): Column<T>[] {
  const activeColumns = model.columns.filter((c) => lookup.has(c.field) && (c.active ?? true));
  const activeValues = model.values.filter((c) => lookup.has(c.field) && (c.active ?? true));

  if (activeColumns.length === 0 && activeValues.length === 0) return [];

  // This means we only have a values column defined. Hence we should just return this.
  if (activeColumns.length === 0) {
    const columns = activeValues.map((c) => {
      const col = lookup.get(c.field)!;

      return {
        ...col,
        field: c.field,
      };
    });

    return columns;
  }

  const tree = createPivotTree(grid, activeValues, activeColumns, lookup, leafRows);
  const columns = createColumnPivotsFromPaths(grid, activeColumns, lookup, tree);

  return columns;
}
