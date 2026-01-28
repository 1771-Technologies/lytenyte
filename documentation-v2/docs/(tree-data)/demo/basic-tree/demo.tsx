import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { frontendFileSystem } from "./data.js";
import { GroupCell } from "./components.jsx";

export interface GridSpec {
  readonly data: { kind: string; size: number; modified: string; lastEditedBy: string; permissions: string };
}

const group: Grid.RowGroupColumn<GridSpec> = {
  width: 220,
  cellRenderer: GroupCell,
  pin: "start",
};

const columns: Grid.Column<GridSpec>[] = [
  { id: "size" },
  { id: "modified" },
  { id: "lastEditedBy" },
  { id: "permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120 };

export default function TreeDemo() {
  const ds = useTreeDataSource({
    data: frontendFileSystem,
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} rowGroupColumn={group} columnBase={base} columns={columns} />
    </div>
  );
}
