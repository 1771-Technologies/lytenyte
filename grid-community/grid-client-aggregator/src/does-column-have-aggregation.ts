import type {
  ApiCommunity,
  ColumnBaseCommunity,
  ColumnCommunity,
} from "@1771technologies/grid-types";
import { validBuiltIns } from "./built-ins/built-ins.js";

export function doesColumnHaveAggregation<D, E>(
  api: ApiCommunity<D, E>,
  column: ColumnCommunity<D, E>,
  columnBase: ColumnBaseCommunity<D, E>,
) {
  const aggFn = column.aggFn ?? column.aggFnDefault ?? columnBase.aggFn;

  if (!aggFn) return false;
  if (typeof aggFn === "function" || validBuiltIns.has(aggFn)) return true;

  const registered = api.getState().aggFns.peek();

  return !!registered[aggFn];
}
