import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import { dateParser } from "./cell-edit-date-parser";
import { numberParser } from "./cell-edit-number-parser";
import { stringParser } from "./cell-edit-string-parser";

export function cellEditParser<D, E>(
  api: ApiCore<D, E>,
  index: number,
): Required<ColumnCore<D, E>>["cellEditParser"] {
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
