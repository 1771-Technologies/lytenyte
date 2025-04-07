import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import { dateUnparser } from "./cell-edit-date-unparser";
import { numberUnparser } from "./cell-edit-number-unparser";
import { stringUnparser } from "./cell-edit-string-unparser";

export function cellEditUnparser<D, E>(
  api: ApiCore<D, E>,
  index: number,
): Required<ColumnCore<D, E>>["cellEditUnparser"] {
  const column = api.columnByIndex(index);
  const base = api.getState().columnBase.peek();

  const unparser = column?.cellEditUnparser ?? base.cellEditUnparser;

  if (!unparser) {
    if (column?.type === "date") return dateUnparser;
    if (column?.type === "number") return numberUnparser;

    return stringUnparser;
  }

  return unparser;
}
