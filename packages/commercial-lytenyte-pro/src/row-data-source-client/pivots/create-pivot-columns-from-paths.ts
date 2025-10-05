import { upperCaseFirstLetter } from "@1771technologies/lytenyte-shared";
import type { Column, ColumnPivotModel, Grid } from "../../+types.js";

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function createColumnPivotsFromPaths<T>(
  grid: Grid<T>,
  columns: ColumnPivotModel<T>["columns"],
  lookup: Map<string, Column<T>>,
  paths: string[],
): Column<T>[] {
  const separator = grid.state.columnGroupJoinDelimiter.get();

  const cols = paths.map((path) => {
    const parts = path.split(separator);

    const measureId = parts.at(-1)!;
    const measureCol = lookup.get(measureId)!;

    // Pop the last part as this is the aggregation value
    parts.pop();

    const pivots = parts.map((_, index) => {
      const id = columns[index].field;
      return lookup.get(id)!;
    });

    const entries = [...pivots.entries()];

    const isTotals = parts.length < columns.length;
    const label = isTotals ? "Total" : parts.at(-1)!;

    const groupPath = isTotals ? [] : parts.map(upperCaseFirstLetter);

    const { pin: _, ...measureProps } = measureCol ?? {};

    const newDefinitions: Writable<Column<T>> = {
      ...measureProps,
      id: path,
      name: label,
      groupPath,
      groupVisibility: "always",
      field: ({ grid, data }): unknown => {
        if (!measureCol) return null;

        if (data.kind === "branch") {
          return data.data[path];
        }

        if (!path.startsWith("total")) {
          for (const [index, pivot] of entries) {
            const key = parts[index];
            if (key == null) break;
            const actual = grid.api.columnField(pivot, data);
            if (key !== actual) return null;
          }

          return grid.api.columnField(measureCol, data);
        } else {
          return grid.api.columnField(measureCol, data);
        }
      },
    };

    return newDefinitions as Column<T>;
  });

  return cols;
}
