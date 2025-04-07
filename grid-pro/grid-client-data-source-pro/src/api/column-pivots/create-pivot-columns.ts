import type { ApiPro, ColumnPro, RowNodeLeafPro } from "@1771technologies/grid-types/pro";
import { createPivotTree } from "./create-pivot-tree.js";
import { upperCaseFirstLetter } from "@1771technologies/js-utils";

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function createColumnPivots<D, E>(
  api: ApiPro<D, E>,
  rows: RowNodeLeafPro<D>[],
): ColumnPro<D, E>[] {
  const paths = createPivotTree(api, rows);

  const sx = api.getState();

  const separator = sx.columnGroupIdDelimiter.peek();
  const pivotModel = sx.columnPivotModel.peek();

  return paths.map((path) => {
    const parts = path.split(separator);

    const measureId = parts.at(-1)!;
    const measureCol = api.columnById(measureId)!;

    const groupPath = [upperCaseFirstLetter(parts.pop()!)];

    const pivots = parts.map((_, index) => {
      const id = pivotModel[index];
      return api.columnById(id)!;
    });

    const entries = [...pivots.entries()];

    const isTotals = parts.length < pivotModel.length;
    const label = isTotals ? (parts[0] === "total" ? "Total" : "Subtotal") : parts.at(-1)!;

    groupPath.push(
      ...(isTotals ? parts : parts.slice(0, parts.length - 1)).map(upperCaseFirstLetter),
    );

    const { pin: _, ...measureProps } = measureCol;
    const newDefinitions: Writable<ColumnPro<D, E>> = {
      ...measureProps,
      id: path,
      headerName: label,
      groupPath,
      field: (data, _, api): unknown => {
        if (!path.startsWith("total")) {
          for (const [index, pivot] of entries) {
            const key = parts[index];
            if (key == null) break;
            const actual = api.columnPivotFieldFromData(data, pivot);

            if (key !== actual) return null;
          }

          return api.columnPivotMeasureField(data, measureCol);
        } else {
          return api.columnPivotMeasureField(data, measureCol);
        }
      },
    };
    return newDefinitions as ColumnPro<D, E>;
  });
}
