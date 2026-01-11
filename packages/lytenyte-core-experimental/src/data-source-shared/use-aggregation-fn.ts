import type { AggregationFn, Aggregator, DimensionAgg } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

const defaultAggregations = {};
export function useAggregationFn<T>(
  aggregate: AggregationFn<T> | DimensionAgg<T>[] | null | undefined,
  fns: Record<string, Aggregator<T>> = defaultAggregations,
) {
  return useMemo<AggregationFn<T> | null>(() => {
    if (!aggregate) return null;
    if (!Array.isArray(aggregate)) return aggregate;

    return (data) => {
      const result: Record<string, unknown> = {};
      for (const agg of aggregate) {
        const fn = typeof agg.fn === "string" ? fns[agg.fn] : agg.fn;

        if (!fn) {
          console.error(`Unknown aggregation function applied: ${agg.fn}`);
          continue;
        }

        result[agg.dim.id] = fn(agg.dim.field ?? agg.dim.id, data);
      }

      return result;
    };
  }, [aggregate, fns]);
}
