import type {
  API,
  Column,
  SortModelItem,
  RowNode,
  SortComparatorFunc,
} from "@1771technologies/grid-types";

export function makeCombinedComparator<D, E, I>(
  api: API<D, E, I>,
  sortModel: SortModelItem[],
  comparators: [SortComparatorFunc<D, E, I>, Column<D, E, I>][],
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
