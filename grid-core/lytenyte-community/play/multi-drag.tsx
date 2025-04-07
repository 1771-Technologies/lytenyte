import { LyteNyteGridCommunity } from "../src/lytenyte-community";
import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useState } from "react";
import { makeGridCore } from "@1771technologies/grid-store-community";

export default function Play() {
  const [otherGrid] = useState(() => {
    return makeGridCore({
      gridId: "d",
      columns: columns,
      columnBase: { resizable: true, movable: true },
      rowDetailEnabled: true,
      rowDragEnabled: true,
      rowDataSource: {
        kind: "client",
        data: bankDataSmall,
        topData: bankDataSmall.slice(0, 2),
        bottomData: bankDataSmall.slice(2, 4),
      },
    });
  });

  const [grid] = useState(() =>
    makeGridCore({
      gridId: "x",
      columns: columns,
      columnBase: { resizable: true, movable: true },
      rowDetailEnabled: true,
      rowDragEnabled: true,
      rowDataSource: {
        kind: "client",
        data: bankDataSmall,
        topData: bankDataSmall.slice(0, 2),
        bottomData: bankDataSmall.slice(2, 4),
      },
      rowDragExternalGrids: [otherGrid.api],
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
      <div>
        <button onClick={() => grid.state.rtl.set((prev) => !prev)}>RTL</button>
        <button onClick={() => grid.state.rowGroupModel.set(["job", "age"])}>Grouped</button>
        <button onClick={() => grid.state.rowGroupModel.set(["job"])}>Un-group</button>
        <button onClick={() => grid.state.rowGroupDisplayMode.set("multi-column")}>Multi</button>
        <button onClick={() => grid.state.rowGroupDisplayMode.set("single-column")}>Single</button>
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGridCommunity grid={grid} />
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGridCommunity grid={otherGrid} />
      </div>
    </div>
  );
}
