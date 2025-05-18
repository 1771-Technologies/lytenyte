import type {
  ApiPro,
  ColumnPro,
  RowNodePro,
  SortModelItemPro,
} from "@1771technologies/grid-types/pro";
import { nullComparator } from "./null-comparator";
import { isValidDate } from "@1771technologies/js-utils";

export function makeDateComparator<D, E>(
  toDate: (value: unknown, column: ColumnPro<D, E>) => Date,
) {
  return dateComparator;

  function dateComparator<D, E>(
    api: ApiPro<D, E>,
    left: unknown,
    right: unknown,
    _: RowNodePro<D>,
    __: RowNodePro<D>,
    sort: SortModelItemPro,
  ) {
    const options = sort.options;

    const column = api.columnById(sort.columnId);

    if (left == null || right == null) {
      return nullComparator(left, right, !!options?.nullsAppearFirst);
    }
    const leftDate = toDate(left as string, column! as any);
    const rightDate = toDate(right as string, column! as any);
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
}
