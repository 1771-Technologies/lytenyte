import type { ApiCommunity, ApiEnterprise, ColumnEnterprise } from "@1771technologies/grid-types";
import type {
  RowNode,
  SortComparatorFn,
  SortModelItem,
} from "@1771technologies/grid-types/community";

export function makeCombinedComparator<D, E>(
  api: ApiEnterprise<D, E>,
  sortModel: SortModelItem[],
  comparators: [SortComparatorFn<ApiEnterprise<D, E>, D>, ColumnEnterprise<D, E>][],
) {
  return (leftNode: RowNode<D>, rightNode: RowNode<D>) => {
    for (let i = 0; i < comparators.length; i++) {
      const [comparator, column] = comparators[i];
      const left = api.columnField(leftNode, column);
      const right = api.columnField(rightNode, column);

      const result = comparator(api, left, right, leftNode, rightNode, sortModel[i]);
      if (result !== 0) {
        return sortModel[i].isDescending ? -result : result;
      }
    }
    return 0;
  };
}
