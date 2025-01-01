import type { ApiEnterprise } from "@1771technologies/grid-types";
import { nullComparator } from "./null-comparator";
import { isValidDate } from "@1771technologies/js-utils";
import type { RowNode, SortModelItem } from "@1771technologies/grid-types/community";

export function dateComparator<D, E>(
  api: ApiEnterprise<D, E>,
  left: unknown,
  right: unknown,
  _: RowNode<D>,
  __: RowNode<D>,
  sort: SortModelItem,
) {
  const options = sort.options;

  const column = api.columnById(sort.columnId);

  const toDate =
    column?.sortParams?.toDate ?? column?.filterParams?.toDate ?? ((d: string) => new Date(d));

  if (left == null || right == null) {
    return nullComparator(left, right, !!options?.nullsAppearFirst);
  }
  const leftDate = toDate(left as string);
  const rightDate = toDate(right as string);
  const leftValid = isValidDate(leftDate);
  const rightValid = isValidDate(rightDate);

  if (leftValid && !rightValid) return -1;
  if (rightValid && !leftValid) return 1;
  if (!leftValid && !rightValid) return 0;

  const leftTime = leftDate.getTime();
  const rightTime = rightDate.getTime();

  const res = leftTime - rightTime;
  if (res < 0) return -1;
  if (res > 0) return 1;
  return 0;
}
