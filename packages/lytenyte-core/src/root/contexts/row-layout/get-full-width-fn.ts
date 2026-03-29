import type { RowNode } from "@1771technologies/lytenyte-shared";
import type { Root } from "../../root";

export function getFullWidthFn(
  rowByIndex: (i: number) => RowNode<any> | null | undefined,
  predicate: Root.Props["rowFullWidthPredicate"],
  api: Root.API,
) {
  if (!predicate) return null;
  return (r: number) => {
    const rowNode = rowByIndex(r);
    if (!rowNode) return false;

    return predicate({ row: rowNode, rowIndex: r, api });
  };
}
