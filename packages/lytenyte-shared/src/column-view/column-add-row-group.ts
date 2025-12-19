import { GROUP_COLUMN_SINGLE_ID } from "../+constants.js";
import type { ColumnAbstract, RowGroupDisplayMode } from "../+types.non-gen.js";

interface ColumnHandleGroupColumnArgs {
  readonly columns: ColumnAbstract[];
  readonly rowGroupTemplate: Omit<ColumnAbstract, "id">;
  readonly rowGroupDisplayMode: RowGroupDisplayMode;
  readonly rowGroupDepth: number;
}

const baseGroup: Omit<ColumnAbstract, "id"> = {
  name: "Group",
};

export function columnAddRowGroup({
  columns,
  rowGroupDepth,
  rowGroupDisplayMode,
  rowGroupTemplate,
}: ColumnHandleGroupColumnArgs) {
  const isSingleGroupDisplay = rowGroupDisplayMode === "single-column";
  const hasGroupColumn = rowGroupDepth > 0 && isSingleGroupDisplay;

  if (hasGroupColumn) {
    const groupColumn = { ...baseGroup, ...rowGroupTemplate, id: GROUP_COLUMN_SINGLE_ID };
    columns.unshift(groupColumn);
  }

  return columns;
}
