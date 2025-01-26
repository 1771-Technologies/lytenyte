import type {
  ApiCommunity,
  ColumnBaseCommunity,
  ColumnCommunity,
} from "@1771technologies/grid-types";
import { builtIns, validBuiltIns } from "./built-ins/built-ins.js";
import type { AggFunc } from "@1771technologies/grid-types/community";

export function getAggregationFunction<D, E>(
  api: ApiCommunity<D, E>,
  column: ColumnCommunity<D, E>,
  columnBase: ColumnBaseCommunity<D, E>,
) {
  const funcOrId = (column.aggFunc || column.aggFuncDefault || columnBase.aggFunc)!;

  if (typeof funcOrId === "function") return funcOrId;

  if (validBuiltIns.has(funcOrId)) {
    return builtIns[funcOrId as keyof typeof builtIns] as unknown as AggFunc<ApiCommunity<D, E>>;
  }

  const registered = api.getState().aggFuncs.peek();
  return registered[funcOrId];
}
