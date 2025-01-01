import { LEAF_KIND } from "@1771technologies/grid-row-utils";
import type { API, SortModelItem, RowNode } from "@1771technologies/grid-types";
import { nullComparator } from "./null-comparator";
import { LYTENYTE_SINGLE_GROUP_COLUMN_ID } from "@1771technologies/grid-constants";

export function groupSortComparator<D, E, I>(
  api: API<D, E, I>,
  __: unknown,
  _: unknown,
  leftNode: RowNode<D>,
  rightNode: RowNode<D>,
  sort: SortModelItem,
) {
  const options = sort.options;
  const columnId = sort.columnId;

  const rowModel = api.getProperty("rowGroupModel");
  const columns = rowModel.map((c) => api.columnById(c)!);

  if (columnId === LYTENYTE_SINGLE_GROUP_COLUMN_ID) {
    for (const c of columns) {
      const left = leftNode.kind !== LEAF_KIND ? null : api.columnFieldGroup(leftNode, c) || null;
      const right =
        rightNode.kind !== LEAF_KIND ? null : api.columnFieldGroup(rightNode, c) || null;

      let result: number;
      if (left == null || right == null)
        return nullComparator(left, right, !!options?.nullsAppearFirst);

      if (left < right) result = -1;
      else if (left > right) result = 1;
      else result = 0;

      if (result !== 0) return result;
    }

    return 0;
  }

  const depth = Number.parseInt(columnId.split("_").at(-1)!);

  const c = columns[depth];

  const left = leftNode.kind !== LEAF_KIND ? null : api.columnFieldGroup(leftNode, c);
  const right = rightNode.kind !== LEAF_KIND ? null : api.columnFieldGroup(rightNode, c);

  if (left == null || right == null)
    return nullComparator(left, right, !!options?.nullsAppearFirst);
  else if (left < right) return -1;
  else if (left > right) return 1;

  return 0;
}
