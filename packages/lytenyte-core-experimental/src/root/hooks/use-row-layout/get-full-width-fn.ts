import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { API, Props } from "../../../types/types-internal.js";

export function getFullWidthFn(rds: RowSource, predicate: Props["rowFullWidthPredicate"], api: API) {
  if (!predicate) return null;
  return (r: number) => {
    const rowNode = rds.rowByIndex(r)?.get();
    if (!rowNode) return false;

    return predicate({ row: rowNode, rowIndex: r, api });
  };
}
