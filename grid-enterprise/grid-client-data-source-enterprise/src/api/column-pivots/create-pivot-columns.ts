import type { ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import { createPivotTree } from "./create-pivot-tree.js";
import { upperCaseFirstLetter } from "@1771technologies/js-utils";
import type { RowNodeLeaf, Writable } from "@1771technologies/grid-types/community";

export function createColumnPivots<D, E>(
  api: ApiEnterprise<D, E>,
  rows: RowNodeLeaf<D>[],
): ColumnEnterprise<D, E>[] {
  const paths = createPivotTree(api, rows);

  const sx = api.getState();

  const separator = sx.columnGroupIdDelimiter.peek();
  const pivotModel = sx.columnPivotModel.peek();

  return paths.map((path) => {
    const parts = path.split(separator);

    const measureId = parts.at(-1)!;
    const measure = api.columnById(measureId)!;

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

    const fn = measure.measureFn ?? sx.columnBase.peek().measureFn;

    const { pin: _, ...measureProps } = measure;
    const newDefinitions: Writable<ColumnEnterprise<D, E>> = {
      ...measureProps,
      id: path,
      headerName: label,
      aggFn: fn,
      groupPath,
      field: (data, _, api): unknown => {
        if (!path.startsWith("total")) {
          for (const [index, pivot] of entries) {
            const key = parts[index];
            if (key == null) break;
            const actual = api.columnPivotFieldFromData(data, pivot);

            if (key !== actual) return null;
          }

          return api.columnPivotMeasureField(data, measure);
        } else {
          return api.columnPivotMeasureField(data, measure);
        }
      },
    };
    return newDefinitions as ColumnEnterprise<D, E>;
  });
}
