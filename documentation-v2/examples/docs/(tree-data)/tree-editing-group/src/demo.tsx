import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data as initialData } from "./tree.js";
import { AvatarCell, GroupCell, ModifiedCell, SizeCell, TextCellEditor } from "./components.jsx";
import { useState } from "react";

export interface GridSpec {
  readonly data: {
    kind: string;
    name: string;
    size: number;
    modified: string;
    lastEditedBy: string;
    permissions: string;
  };
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "name",
    name: "Files",
    cellRenderer: GroupCell,
    width: 240,
    pin: "start",
    editable: true,
    editRenderer: TextCellEditor,
  },
  {
    id: "size",
    type: "number",
    name: "Size",
    cellRenderer: SizeCell,
  },
  { id: "modified", name: "Modified", cellRenderer: ModifiedCell, width: 130 },
  { id: "lastEditedBy", name: "Last Edited By", cellRenderer: AvatarCell },
  { id: "permissions", name: "Permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120 };

const sortBySize: Grid.T.SortFn<GridSpec["data"]> = (left, right) => {
  const leftData = left.data.size as number | null;
  const rightData = right.data.size as number | null;

  if (left == null && right == null) return 0;
  else if (left == null && right != null) return 1;
  else if (left != null && right == null) return -1;
  else {
    return rightData! - leftData!;
  }
};

export default function TreeDataDemo() {
  const [data, setData] = useState(() => structuredClone(initialData));
  const ds = useTreeDataSource({
    data,
    rowGroupDefaultExpansion: true,

    sort: sortBySize,

    onRowDataChange: ({ changes }) => {
      for (const x of changes) {
        x.parent[x.key] = x.next;
      }
      setData({ ...data });
    },
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} rowGroupColumn={false} columnBase={base} columns={columns} editMode="cell" />
    </div>
  );
}
