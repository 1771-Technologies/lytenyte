import type { ApiEnterprise } from "@1771technologies/grid-types";
import { datatypeComparator } from "./datatype-comparator";
import { nullComparator } from "./null-comparator";
import type { RowNode, SortModelItem } from "@1771technologies/grid-types/community";

export function numberComparator<D, E, I>(
  _api: ApiEnterprise<D, E>,
  left: unknown,
  right: unknown,
  _: RowNode<D>,
  __: RowNode<D>,
  sort: SortModelItem,
) {
  const options = sort.options;
  if (left == null || right == null) {
    return nullComparator(left, right, !!options?.nullsAppearFirst);
  }
  if (typeof left !== "number" || typeof right !== "number") {
    return datatypeComparator(left, right, "number");
  }

  const rightAdjusted = options?.isAbsolute ? Math.abs(right) : right;
  const leftAdjusted = options?.isAbsolute ? Math.abs(left) : left;

  return leftAdjusted - rightAdjusted;
}
