import type {
  ApiCommunity,
  ColumnBaseCommunity,
  ColumnCommunity,
} from "@1771technologies/grid-types";
import { validBuiltIns } from "./built-ins/built-ins.js";

export function doesColumnHaveAggregation<D, E, I>(
  api: ApiCommunity<D, E>,
  column: ColumnCommunity<D, E>,
  columnBase: ColumnBaseCommunity<D, E>,
) {
  const aggFunc =
    column.aggFunc ?? column.aggFuncDefault ?? columnBase.aggFunc ?? columnBase.aggFuncDefault;

  if (!aggFunc) return false;
  if (typeof aggFunc === "function" || validBuiltIns.has(aggFunc)) return true;

  const registered = api.getState().aggFuncs.peek();

  return !!registered[aggFunc];
}
