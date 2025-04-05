import {
  GROUP_COLUMN_MULTI_PREFIX,
  GROUP_COLUMN_SINGLE_ID,
  GROUP_COLUMN_PREFIX,
} from "@1771technologies/grid-constants";
import { autosizeGroupColumnDefault } from "@1771technologies/grid-core";
import type { ColumnCommunity, ColumnRowGroupCommunity } from "@1771technologies/grid-types";
import type { RowGroupDisplayMode } from "@1771technologies/grid-types/core";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

interface ColumnHandleGroupColumnArgs<D, E> {
  readonly columns: ColumnCommunity<D, E>[];
  readonly rowGroupModel: string[];
  readonly rowGroupDisplayMode: RowGroupDisplayMode;
  readonly rowGroupColumnTemplate: ColumnRowGroupCommunity<D, E>;
  readonly treeData: boolean;
}

export const baseGroup: ColumnRowGroupCommunity<any, any> = {
  headerName: "Group",
  cellAutosizeFn: autosizeGroupColumnDefault,
};

export function columnHandleGroupColumn<D, E>({
  columns,
  rowGroupModel,
  rowGroupDisplayMode,
  rowGroupColumnTemplate,
  treeData,
}: ColumnHandleGroupColumnArgs<D, E>) {
  const lookup = itemsWithIdToMap(columns);

  const isSingleGroupDisplay = rowGroupDisplayMode === "single-column";
  const isMultiGroupDisplay = rowGroupDisplayMode === "multi-column";
  const hasGroupColumn =
    !treeData && rowGroupModel.length > 0 && (isSingleGroupDisplay || isMultiGroupDisplay);

  if (hasGroupColumn && isSingleGroupDisplay) {
    columns = columns.filter((c) => !c.id.startsWith(GROUP_COLUMN_MULTI_PREFIX));

    if (!lookup.has(GROUP_COLUMN_SINGLE_ID)) {
      const groupColumn = { ...baseGroup, ...rowGroupColumnTemplate, id: GROUP_COLUMN_SINGLE_ID };
      columns.unshift(groupColumn);
    }
  }

  if (hasGroupColumn && isMultiGroupDisplay) {
    const weNeedXColumns = rowGroupModel.length;

    columns = columns.filter((c) => {
      const posCnt = c.id.startsWith(GROUP_COLUMN_MULTI_PREFIX)
        ? Number.parseInt(c.id.split(":").at(-1)!)
        : null;

      if (c.id === GROUP_COLUMN_SINGLE_ID || (posCnt != null && posCnt >= weNeedXColumns))
        return false;

      return true;
    });

    let reorder = false;
    for (let i = weNeedXColumns - 1; i >= 0; i--) {
      const columnId = `${GROUP_COLUMN_MULTI_PREFIX}${i}`;

      if (!lookup.has(columnId)) {
        const column = { ...baseGroup, ...rowGroupColumnTemplate, id: columnId };
        columns.unshift(column);
        reorder = true;
        lookup.set(columnId, column);
      }

      const groupColumn = lookup.get(columnId);
      const referenceColumn = lookup.get(rowGroupModel[i]);

      (groupColumn as { headerName?: string }).headerName =
        referenceColumn?.headerName ?? referenceColumn?.id ?? `Group ${i}`;
    }
    if (reorder) {
      const group = columns
        .filter((c) => c.id.startsWith(GROUP_COLUMN_MULTI_PREFIX))
        .sort((l, r) => l.id.localeCompare(r.id));

      const nonGroup = columns.filter((c) => !c.id.startsWith(GROUP_COLUMN_MULTI_PREFIX));
      columns = [...group, ...nonGroup];
    }
  }

  if (!hasGroupColumn) columns = columns.filter((c) => !c.id.startsWith(GROUP_COLUMN_PREFIX));

  return columns;
}
