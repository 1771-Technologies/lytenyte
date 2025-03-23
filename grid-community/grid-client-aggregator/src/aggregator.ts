import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";
import { get } from "@1771technologies/js-utils";
import { builtIns } from "./built-ins/built-ins.js";

export function aggregator<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  rows: RowNodeLeaf<D>[],
) {
  api = api as ApiCommunity<D, E>;

  const sx = api.getState();
  const aggCalc: Record<string, unknown> = {};

  const aggModel = sx.aggModel.peek();
  const aggFns = sx.aggFns.peek();

  for (const [id, m] of Object.entries(aggModel)) {
    const isDirect = typeof m.field === "string" || typeof m.field === "number";

    const dataForCalc = rows.map((row) => {
      if (isDirect) return (row.data as any)[m.field as any];

      return get(row.data, (m.field as { path: string }).path);
    });

    const aggFn = typeof m.fn === "string" ? (aggFns[m.fn] ?? builtIns[m.fn as "sum"]) : m.fn;

    const result = aggFn(dataForCalc, api);
    aggCalc[id] = result;
  }

  return aggCalc;
}
