import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data } from "./data.js";
import { AvatarCell, GroupCell, ModifiedCell, SizeCell } from "./components.jsx";

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
  { id: "size", type: "number", name: "Size", cellRenderer: SizeCell },
  { id: "modified", name: "Modified", cellRenderer: ModifiedCell, width: 130 },
  { id: "lastEditedBy", name: "Last Edited By", cellRenderer: AvatarCell },
  { id: "permissions", name: "Permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120 };

export default function TreeDemo() {
  const ds = useTreeDataSource({
    data: data,
    botData: [
      {
        name: ".gitignore",
        kind: "file",
        size: 180,
        modified: "2026-01-19T09:00:00Z",
        lastEditedBy: "Betty Hall",
        permissions: "rw-r--r--",
      },
      {
        name: ".env",
        kind: "file",
        size: 220,
        modified: "2026-01-21T08:30:00Z",
        lastEditedBy: "Nancy Lewis",
        permissions: "rw-------",
      },
    ].map(
      (x) => ({ kind: "leaf", id: x.name, data: x, depth: 0 }) satisfies Grid.T.RowLeaf<GridSpec["data"]>,
    ),
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} rowGroupColumn={group} columnBase={base} columns={columns} />
    </div>
  );
}
