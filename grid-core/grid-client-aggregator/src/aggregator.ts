import type { ApiPro, RowNodeLeafPro } from "@1771technologies/grid-types/pro";
import { builtIns } from "./built-ins/built-ins.js";
import type { ApiCore, RowNodeLeafCore } from "@1771technologies/grid-types/core";

export function aggregator<D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  rows: (RowNodeLeafPro<D> | RowNodeLeafCore<D>)[],
) {
  api = api as ApiCore<D, E>;

  const sx = api.getState();
  const aggCalc: Record<string, unknown> = {};

  const aggModel = sx.aggModel.peek();
  const aggFns = sx.aggFns.peek();

  for (const [id, m] of Object.entries(aggModel)) {
    const column = api.columnById(id);
    if (!column) continue;

    const dataForCalc = rows.map((row) => {
      return api.columnField(row, column);
    });

    const aggFn = typeof m.fn === "string" ? (aggFns[m.fn] ?? builtIns[m.fn as "sum"]) : m.fn;

    const result = aggFn(dataForCalc, api);
    aggCalc[id] = result;
  }

  return aggCalc;
}
