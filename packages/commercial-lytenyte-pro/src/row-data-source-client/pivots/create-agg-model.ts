import { type Column, type ColumnPivotModel } from "../../+types.js";

export function createAggModel<T>(
  model: ColumnPivotModel<T>,
  columns: Column<T>[],
  separator: string,
) {
  const aggFunToId = new Map(model.values.map((c) => [c.field, c.aggFn]));

  const aggModel = columns
    .map((c) => {
      const aggId = c.id.split(separator).at(-1)!;

      if (!aggFunToId.has(aggId)) return null;

      return [c.id, { fn: aggFunToId.get(aggId)! }] as const;
    })
    .filter((c) => !!c);

  return Object.fromEntries(aggModel);
}
