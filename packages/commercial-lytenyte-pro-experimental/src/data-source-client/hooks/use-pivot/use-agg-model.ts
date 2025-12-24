import type { Column, GridSpec } from "@1771technologies/lytenyte-core-experimental/types";
import type { PivotModel } from "../../use-client-data-source";
import type { AggregationFn } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import { computeField } from "@1771technologies/lytenyte-core-experimental/internal";

export function usePivotAggFunction<Spec extends GridSpec>(
  pivotColumns: Column<Spec>[] | null,
  model: PivotModel<Spec> | undefined,
) {
  const measures = model?.measures;
  const columns = model?.columns;

  const aggFn = useMemo<AggregationFn<Spec["data"]> | null>(() => {
    if (!measures?.length) return null;

    if (!pivotColumns?.length || !columns?.length)
      return (rows) => {
        const aggResult: Record<string, unknown> = {};

        for (const m of measures!) aggResult[m.id] = m.measure(rows);

        return aggResult;
      };

    const lookup = Object.fromEntries((measures ?? []).map((x) => [x.id, x]));
    return (rows) => {
      const aggResult: Record<string, unknown> = {};

      for (let i = 0; i < pivotColumns.length; i++) {
        const column = pivotColumns[i];
        const measureId = column.id.split("-->").at(-1)!;
        if (measureId === "ln__noop") break;

        const finalLeafs = rows.filter((x) => computeField(column.field!, x));
        if (finalLeafs.length) {
          const measure = lookup[measureId];
          aggResult[column.id] = measure.measure(finalLeafs);
        } else {
          aggResult[column.id] = null;
        }
      }

      return aggResult;
    };
  }, [columns?.length, measures, pivotColumns]);

  return aggFn;
}
