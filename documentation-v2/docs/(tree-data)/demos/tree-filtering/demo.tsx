import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data } from "./tree.js";
import { AvatarCell, GroupCell, ModifiedCell, SizeCell, SwitchToggle } from "./components.jsx";
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
  { id: "size", type: "number", name: "Size", cellRenderer: SizeCell },
  { id: "modified", name: "Modified", cellRenderer: ModifiedCell, width: 130 },
  { id: "lastEditedBy", name: "Last Edited By", cellRenderer: AvatarCell },
  { id: "permissions", name: "Permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120 };

export default function TreeDataDemo() {
  const [showHidden, setShowHidden] = useState(false);
  const ds = useTreeDataSource({
    data: data,
    rowGroupDefaultExpansion: true,
    filter: !showHidden ? (x) => !(typeof x.name === "string" && x.name.startsWith(".")) : null,
  });

  return (
    <>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <SwitchToggle
          label="Reveal Hidden Files"
          checked={showHidden}
          onChange={() => {
            setShowHidden((prev) => !prev);
          }}
        />
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowSource={ds} rowGroupColumn={group} columnBase={base} columns={columns} />
      </div>
    </>
  );
}
