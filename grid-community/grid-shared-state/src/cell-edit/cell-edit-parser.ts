import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";
import { dateParser } from "./cell-edit-date-parser";
import { numberParser } from "./cell-edit-number-parser";
import { stringParser } from "./cell-edit-string-parser";

export function cellEditParser<D, E>(
  api: ApiCommunity<D, E>,
  index: number,
): Required<ColumnCommunity<D, E>>["cellEditParser"] {
  const column = api.columnByIndex(index);
  const base = api.getState().columnBase.peek();

  const parser = column?.cellEditParser ?? base.cellEditParser;
  if (!parser) {
    if (column?.type === "date") return dateParser;
    if (column?.type === "number") return numberParser;

    return stringParser;
  }

  return parser;
}
