import type {
  ApiCommunity,
  ColumnBaseCommunity,
  ColumnCommunity,
} from "@1771technologies/grid-types";
import { builtIns, validBuiltIns } from "./built-ins/built-ins.js";
import type { AggFn } from "@1771technologies/grid-types/community";

export function getAggregationFunction<D, E>(
  api: ApiCommunity<D, E>,
  column: ColumnCommunity<D, E>,
  columnBase: ColumnBaseCommunity<D, E>,
) {
  const funcOrId = (column.aggFn || column.aggFnDefault || columnBase.aggFn)!;

  if (typeof funcOrId === "function") return funcOrId;

  if (validBuiltIns.has(funcOrId)) {
    return builtIns[funcOrId as keyof typeof builtIns] as unknown as AggFn<ApiCommunity<D, E>>;
  }

  const registered = api.getState().aggFns.peek();
  return registered[funcOrId];
}
