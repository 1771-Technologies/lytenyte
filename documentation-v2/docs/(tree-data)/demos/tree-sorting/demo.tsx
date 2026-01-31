import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { data } from "./data.js";
import { AvatarCell, GroupCell, ModifiedCell, SizeCell } from "./components.jsx";
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

//!next 5
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

export default function TreeDemo() {
  const [sort, setSort] = useState<Grid.T.SortFn<any> | null>(null);

  const ds = useTreeDataSource({
    data: data,
    rowGroupDefaultExpansion: true,
    sort,

    rowChildrenFn: (x: any) => {
      if (!x.children) return [];
      return x.children.map((r: any) => [r.name, r]);
    },
    rowValueFn: (x) => ({
      name: x.name,
      kind: x.kind,
      size: x.size || null,
      modified: x.modified,
      lastEditedBy: x.lastEditedBy,
      permissions: x.permissions,
    }),
  });

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-4 py-3">
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setSort(() => sortBySize);
          }}
        >
          Sort: Size
        </button>
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setSort(null);
          }}
        >
          Clear Sort
        </button>
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowSource={ds} rowGroupColumn={group} columnBase={base} columns={columns} />
      </div>
    </>
  );
}
