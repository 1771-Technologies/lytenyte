import { makeGridCore } from "@1771technologies/grid-store-core";
import { LyteNyteGridCore } from "../src/lytenyte-core";
import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useState } from "react";

export default function Play() {
  const [grid] = useState(() =>
    makeGridCore({
      gridId: "x",
      columns: columns,
      columnBase: { resizable: true, movable: true, sortable: true },
      rowDataSource: {
        kind: "client",
        data: bankDataSmall,
        topData: bankDataSmall.slice(0, 2),
        bottomData: bankDataSmall.slice(2, 4),
      },
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
        <LyteNyteGridCore grid={grid} />
      </div>
    </div>
  );
}
