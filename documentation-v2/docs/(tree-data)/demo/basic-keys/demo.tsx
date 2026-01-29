import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data } from "./data.js";
import { AvatarCell, GroupCell, ModifiedCell, SizeCell } from "./components.jsx";

export interface GridSpec {
  readonly data: { kind: string; size: number; modified: string; lastEditedBy: string; permissions: string };
}

const group: Grid.RowGroupColumn<GridSpec> = {
  width: 240,
  cellRenderer: GroupCell,
  pin: "start",
};

const columns: Grid.Column<GridSpec>[] = [
  { id: "size", type: "number", name: "Size", cellRenderer: SizeCell },
  { id: "modified", name: "Modified", cellRenderer: ModifiedCell, width: 130 },
  { id: "lastEditedBy", name: "Last Edited By", cellRenderer: AvatarCell },
  { id: "permissions", name: "Permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120 };

export default function TreeDemo() {
  const ds = useTreeDataSource({
    data: data,
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} rowGroupColumn={group} columnBase={base} columns={columns} />
    </div>
  );
}
