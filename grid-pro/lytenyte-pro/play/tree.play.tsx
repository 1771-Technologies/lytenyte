import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid, useTreeDataSource } from "../src";
import { treeData } from "./data/tree-data";
import { useId } from "react";
import type { ColumnProReact } from "@1771technologies/grid-types/pro-react";

const columns: ColumnProReact[] = [
  { id: "path" },
  { id: "size" },
  { id: "lastModified" },
  { id: "type" },
  { id: "owner" },
  { id: "permissions" },
  { id: "isHidden" },
];

export default function Play() {
  const ds = useTreeDataSource({
    data: treeData,
    topData: treeData.slice(0, 2),
    bottomData: treeData.slice(0, 2),
    getDataForGroup: () => {
      return {};
    },
    pathFromData: (d) => d.path.split("/").filter((c) => !!c),
    distinctNonAdjacentPaths: true,
  });

  const grid = useLyteNytePro({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    treeData: true,
  });

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
          width: 100%;
        `}
      >
        <div
          className={css`
            padding: 20px;
            width: 200px;
          `}
        ></div>
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
