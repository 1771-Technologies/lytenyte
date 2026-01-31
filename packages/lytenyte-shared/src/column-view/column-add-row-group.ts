import { GROUP_COLUMN_SINGLE_ID } from "../+constants.js";
import type { ColumnAbstract } from "../types.js";

interface ColumnHandleGroupColumnArgs {
  readonly columns: ColumnAbstract[];
  readonly rowGroupTemplate: false | Omit<ColumnAbstract, "id">;
  readonly rowGroupDepth: number;
}

const baseGroup: Omit<ColumnAbstract, "id"> = {
  name: "Group",
};

export function columnAddRowGroup({ columns, rowGroupDepth, rowGroupTemplate }: ColumnHandleGroupColumnArgs) {
  const isSingleGroupDisplay = rowGroupTemplate !== false;
  const hasGroupColumn = rowGroupDepth > 0 && isSingleGroupDisplay;

  if (hasGroupColumn) {
    const groupColumn = { ...baseGroup, ...rowGroupTemplate, id: GROUP_COLUMN_SINGLE_ID };

    return [groupColumn, ...columns];
  }

  return columns;
}
