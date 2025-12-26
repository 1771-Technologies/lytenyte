import type { Column, GridSpec } from "@1771technologies/lytenyte-core-experimental/types";
import type { PivotModel } from "../../use-client-data-source";
import type { AggregationFn, Aggregator } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import { computeField } from "@1771technologies/lytenyte-core-experimental/internal";

const pivotAggs = {};
export function usePivotAggFunction<Spec extends GridSpec>(
  pivotColumns: Column<Spec>[] | null,
  model: PivotModel<Spec> | undefined,
  aggs: Record<string, Aggregator<Spec["data"]>> = pivotAggs,
) {
  const measures = model?.measures;
  const columns = model?.columns;

  const aggFn = useMemo<AggregationFn<Spec["data"]> | null>(() => {
    if (!measures?.length) return null;

    if (!pivotColumns?.length || !columns?.length)
      return (rows) => {
        const aggResult: Record<string, unknown> = {};

        for (const m of measures!) {
          const id = m.dim.id;

          const fn = typeof m.fn === "string" ? aggs[m.fn] : m.fn;
          if (!fn) {
            console.error(`Measure "${fn}" is not defined.`);
          }
          aggResult[id] = fn(rows, m.dim.field ?? id);
        }

        return aggResult;
      };

    const lookup = Object.fromEntries((measures ?? []).map((x) => [x.dim.id, x]));
    return (rows) => {
      const aggResult: Record<string, unknown> = {};

      for (let i = 0; i < pivotColumns.length; i++) {
        const column = pivotColumns[i];
        const measureId = column.id.split("-->").at(-1)!;
        if (measureId === "ln__noop") break;

        const finalLeafs = rows.filter((x) => computeField(column.field!, x));
        if (finalLeafs.length) {
          const measure = lookup[measureId];

          const fn = typeof measure.fn === "string" ? aggs[measure.fn] : measure.fn;

          aggResult[column.id] = fn(finalLeafs, measure.dim.field ?? measure.dim.id);
        } else {
          aggResult[column.id] = null;
        }
      }

      return aggResult;
    };
  }, [aggs, columns?.length, measures, pivotColumns]);

  return aggFn;
}
