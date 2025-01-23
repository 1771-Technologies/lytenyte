import { useState } from "react";
import { LyteNyteGrid } from "../src/lytenyte-grid-enterprise";
import { makeStore } from "@1771technologies/grid-store-enterprise";
import { useTreeDataSource } from "../src/use-tree-data-source";
import { treeData, type FileNode } from "./data/tree-data";

export default function XA() {
  const ds = useTreeDataSource<FileNode>({
    data: treeData,
    pathFromData: (d) => d.path.split("/").slice(1),
    getDataForGroup: () => ({}),
    pathSeparator: "/",
  });

  const [grid] = useState(() =>
    makeStore({
      gridId: "x",
      columns: [
        { id: "path" },
        { id: "size" },
        { id: "lastModified", type: "date" },
        { id: "type" },
        { id: "owner" },
        { id: "permissions" },
        { id: "isHidden" },
      ],
      treeData: true,
      columnBase: { resizable: true, movable: true, sortable: true },
      rowDataSource: ds,
    }),
  );

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: 4px;
        `}
      >
        <button onClick={() => grid.api.autosizeColumns()}>Autosize</button>
        <button onClick={() => grid.state.rtl.set((prev) => !prev)}>RTL</button>
        <button onClick={() => grid.state.rowGroupModel.set(["job", "age"])}>Grouped</button>
        <button onClick={() => grid.state.rowGroupModel.set(["job"])}>Grouped 2</button>
        <button onClick={() => grid.state.rowGroupModel.set([])}>Un-group</button>
        <button onClick={() => grid.state.rowGroupDisplayMode.set("multi-column")}>
          Multi Group
        </button>
        <button onClick={() => grid.state.rowGroupDisplayMode.set("single-column")}>
          Single Group
        </button>
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGrid grid={grid} />
      </div>
    </div>
  );
}
