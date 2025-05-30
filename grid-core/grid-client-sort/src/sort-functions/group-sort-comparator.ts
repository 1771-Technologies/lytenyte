import type { ApiPro, RowNodePro, SortModelItemPro } from "@1771technologies/grid-types/pro";
import { nullComparator } from "./null-comparator";
import { GROUP_COLUMN_SINGLE_ID } from "@1771technologies/grid-constants";

export function groupSortComparator<D, E>(
  api: ApiPro<D, E>,
  __: unknown,
  _: unknown,
  leftNode: RowNodePro<D>,
  rightNode: RowNodePro<D>,
  sort: SortModelItemPro,
) {
  const options = sort.options;
  const columnId = sort.columnId;

  const sx = api.getState();
  const rowModel = sx.rowGroupModel.peek();

  const columns = rowModel.map((c) => api.columnById(c)!);

  if (columnId === GROUP_COLUMN_SINGLE_ID) {
    for (const c of columns) {
      const left = !api.rowIsLeaf(leftNode) ? null : api.columnFieldGroup(leftNode, c) || null;
      const right = !api.rowIsLeaf(rightNode) ? null : api.columnFieldGroup(rightNode, c) || null;

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

  const left = !api.rowIsLeaf(leftNode) ? null : api.columnFieldGroup(leftNode, c) || null;
  const right = !api.rowIsLeaf(rightNode) ? null : api.columnFieldGroup(rightNode, c) || null;

  if (left == null || right == null)
    return nullComparator(left, right, !!options?.nullsAppearFirst);
  else if (left < right) return -1;
  else if (left > right) return 1;

  return 0;
}
