import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro";
import { data as initialData } from "./tree.js";
import {
  AvatarCell,
  getNumberValue,
  GroupCell,
  ModifiedCell,
  NumberEditor,
  SizeCell,
} from "./components.jsx";
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

const group: Grid.RowGroupColumn<GridSpec> = {
  width: 240,
  cellRenderer: GroupCell,
  pin: "start",
};

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "size",
    type: "number",
    name: "Size",
    cellRenderer: SizeCell,
    editable: (r) => r.row.data.size != null,
    editRenderer: NumberEditor,
    editSetter: (p) => {
      const currentValue =
        typeof p.editValue !== "string" ? 0 : Number.parseFloat(getNumberValue(p.editValue)) || 0;
      const data = { ...(p.editData as Record<string, unknown>), [p.column.id]: currentValue };

      return data;
    },
  },
  { id: "modified", name: "Modified", cellRenderer: ModifiedCell, width: 130 },
  { id: "lastEditedBy", name: "Last Edited By", cellRenderer: AvatarCell },
  { id: "permissions", name: "Permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120 };

export default function TreeDataDemo() {
  const [data, setData] = useState(() => structuredClone(initialData));
  const ds = useTreeDataSource({
    data,
    rowGroupDefaultExpansion: true,

    onRowDataChange: ({ changes }) => {
      for (const x of changes) {
        x.parent[x.key] = x.next;
      }
      setData({ ...data });
    },
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} rowGroupColumn={group} columnBase={base} columns={columns} editMode="cell" />
    </div>
  );
}
