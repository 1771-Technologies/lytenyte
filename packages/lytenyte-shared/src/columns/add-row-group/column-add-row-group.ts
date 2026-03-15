import { GROUP_COLUMN_SINGLE_ID } from "../../+constants.js";
import type { ColumnAbstract } from "../../types.js";

interface ColumnHandleGroupColumnArgs {
  readonly columns: ColumnAbstract[];
  readonly rowGroupTemplate: false | Omit<ColumnAbstract, "id">;
  readonly rowGroupDepth: number;
}

const baseGroup: Omit<ColumnAbstract, "id"> = { name: "Group" };

/**
 * Adds an automatic group column that is managed by LyteNyte Grid. The group column is used to expand or collapse
 * row groups in the grid.
 */
export function columnAddRowGroup({ columns, rowGroupDepth, rowGroupTemplate }: ColumnHandleGroupColumnArgs) {
  const isSingleGroupDisplay = rowGroupTemplate !== false;
  const hasGroupColumn = rowGroupDepth > 0 && isSingleGroupDisplay;

  if (hasGroupColumn) {
    const groupColumn = { ...baseGroup, ...rowGroupTemplate, id: GROUP_COLUMN_SINGLE_ID };

    return [groupColumn, ...columns];
  }

  return columns;
}
