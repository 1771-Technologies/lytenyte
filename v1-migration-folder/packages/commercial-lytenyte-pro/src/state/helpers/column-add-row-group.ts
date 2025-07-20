import {
  GROUP_COLUMN_MULTI_PREFIX,
  GROUP_COLUMN_PREFIX,
  GROUP_COLUMN_SINGLE_ID,
} from "@1771technologies/lytenyte-shared";
import type {
  Column,
  RowGroupColumn,
  RowGroupDisplayMode,
  RowGroupField,
  RowGroupModelItem,
} from "../../+types.js";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-js-utils";
import { CellRowGroup } from "./cell-row-group.js";

interface ColumnHandleGroupColumnArgs<T> {
  readonly columns: Column<T>[];
  readonly rowGroupTemplate: RowGroupColumn<T>;
  readonly rowGroupModel: RowGroupModelItem<T>[];
  readonly rowGroupDisplayMode: RowGroupDisplayMode;
}

const baseGroup: RowGroupColumn<any> = {
  name: "Group",
  cellRenderer: CellRowGroup,
  field: (d) => {
    if (d.data.kind === "leaf") return null;
    return d.data.key;
  },
};

export function columnAddRowGroup<T>({
  columns,
  rowGroupModel,
  rowGroupDisplayMode,
  rowGroupTemplate,
}: ColumnHandleGroupColumnArgs<T>) {
  const lookup = itemsWithIdToMap(columns) as Map<string, Column<T> | RowGroupField<T>>;

  rowGroupModel.forEach((c) => {
    if (typeof c === "string") return;
    lookup.set(c.id, c);
  });

  const isSingleGroupDisplay = rowGroupDisplayMode === "single-column";
  const isMultiGroupDisplay = rowGroupDisplayMode === "multi-column";
  const hasGroupColumn = rowGroupModel.length > 0 && (isSingleGroupDisplay || isMultiGroupDisplay);

  if (hasGroupColumn && isSingleGroupDisplay) {
    columns = columns.filter((c) => !c.id.startsWith(GROUP_COLUMN_MULTI_PREFIX));

    if (!lookup.has(GROUP_COLUMN_SINGLE_ID)) {
      const groupColumn = { ...baseGroup, ...rowGroupTemplate, id: GROUP_COLUMN_SINGLE_ID };
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
        const column = { ...baseGroup, ...rowGroupTemplate, id: columnId };
        columns.unshift(column);
        reorder = true;
        lookup.set(columnId, column);
      }

      const groupColumn = lookup.get(columnId);

      const modelItem = rowGroupModel[i];
      const referenceColumn = lookup.get(typeof modelItem === "string" ? modelItem : modelItem.id);

      (groupColumn as { headerName?: string }).headerName =
        referenceColumn?.name ?? referenceColumn?.id ?? `Group ${i}`;
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
