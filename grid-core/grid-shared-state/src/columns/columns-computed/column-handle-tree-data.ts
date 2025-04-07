import { GROUP_COLUMN_TREE_DATA } from "@1771technologies/grid-constants";
import { itemsWithIdToMap } from "@1771technologies/js-utils";
import { baseGroup } from "./column-handle-group-column";
import type { ColumnCore, ColumnRowGroupCore } from "@1771technologies/grid-types/core";

export function columnHandleTreeData<D, E>(
  columns: ColumnCore<D, E>[],
  treeData: boolean,

  rowGroupColumnTemplate: ColumnRowGroupCore<D, E>,
) {
  const lookup = itemsWithIdToMap(columns);

  if (treeData) {
    if (!lookup.has(GROUP_COLUMN_TREE_DATA)) {
      const groupColumn = { ...baseGroup, ...rowGroupColumnTemplate, id: GROUP_COLUMN_TREE_DATA };
      columns.unshift(groupColumn);
    }
  } else if (!treeData && lookup.has(GROUP_COLUMN_TREE_DATA)) {
    const index = columns.findIndex((c) => c.id === GROUP_COLUMN_TREE_DATA);
    columns.splice(index, 1);
  }

  return columns;
}
