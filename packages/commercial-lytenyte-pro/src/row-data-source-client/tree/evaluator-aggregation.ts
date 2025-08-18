import type { AggregationItem } from "../+types.js";

export function aggregationEvaluator<Data>(agg: AggregationItem<Data>[], data: Data[]) {
  const result: Record<string, unknown> = {};
  for (let i = 0; i < agg.length; i++) {
    const a = agg[i];
    result[a.name] = a.fn(data);
  }

  return result;
}
