import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { Root } from "../../root";

export function getFullWidthFn(
  rds: RowSource,
  predicate: Root.Props["rowFullWidthPredicate"],
  api: Root.API,
) {
  if (!predicate) return null;
  return (r: number) => {
    const rowNode = rds.rowByIndex(r)?.get();
    if (!rowNode) return false;

    return predicate({ row: rowNode, rowIndex: r, api });
  };
}
