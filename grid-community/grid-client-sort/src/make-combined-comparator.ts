import type {
  ApiPro,
  ColumnPro,
  RowNodePro,
  SortComparatorFnPro,
  SortModelItemPro,
} from "@1771technologies/grid-types/pro";

export function makeCombinedComparator<D, E>(
  api: ApiPro<D, E>,
  sortModel: SortModelItemPro[],
  comparators: [SortComparatorFnPro<D, E>, ColumnPro<D, E>][],
) {
  return (leftNode: RowNodePro<D>, rightNode: RowNodePro<D>) => {
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
