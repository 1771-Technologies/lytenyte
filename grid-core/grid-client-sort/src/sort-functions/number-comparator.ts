import type { ApiPro, RowNodePro, SortModelItemPro } from "@1771technologies/grid-types/pro";
import { datatypeComparator } from "./datatype-comparator";
import { nullComparator } from "./null-comparator";

export function numberComparator<D, E>(
  _api: ApiPro<D, E>,
  left: unknown,
  right: unknown,
  _: RowNodePro<D>,
  __: RowNodePro<D>,
  sort: SortModelItemPro,
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
