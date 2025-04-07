import type { ApiPro, RowNodePro, SortModelItemPro } from "@1771technologies/grid-types/pro";
import { datatypeComparator } from "./datatype-comparator";
import { nullComparator } from "./null-comparator";

const collator = Intl.Collator(undefined, { sensitivity: "base" });

export function stringComparator<D, E>(
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
  if (typeof left !== "string" || typeof right !== "string") {
    return datatypeComparator(left, right, "string");
  }

  const isAccented = options?.isAccented;
  if (isAccented) {
    return collator.compare(left, right);
  }

  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}
