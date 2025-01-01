import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { doesColumnHaveAggregation } from "./does-column-have-aggregation.js";
import { getAggregationFunction } from "./get-aggregation-function.js";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";

export function aggregator<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  rows: RowNodeLeaf<D>[],
) {
  api = api as ApiCommunity<D, E>;

  const sx = api.getState();
  const columns = sx.columnsVisible.peek();

  const aggCalc: Record<string, unknown> = {};
  const columnBase = sx.columnBase.peek();

  for (const column of columns) {
    const hasAggFunc = doesColumnHaveAggregation(api, column, columnBase);

    if (hasAggFunc) {
      const dataForCalc = rows.map((row) => api.columnField(row, column));

      const aggFunc = getAggregationFunction(api, column, columnBase);

      const result = aggFunc(dataForCalc, api);
      aggCalc[column.id] = result;
    }
  }

  return aggCalc;
}
