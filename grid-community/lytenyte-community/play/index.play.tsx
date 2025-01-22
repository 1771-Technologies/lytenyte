import { makeStore } from "@1771technologies/grid-store-community";
import { LyteNyteCommunity } from "../src/lytenyte-community";
import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useState } from "react";

export default function Play() {
  const [grid] = useState(() =>
    makeStore({
      gridId: "x",
      columns: columns,
      columnBase: { resizable: true, movable: true, sortable: true },
      rowDetailPredicate: true,
      rowDragEnabled: true,
      rowSelectionMode: "multiple",
      rowSelectionSelectChildren: true,
      rowSelectionPredicate: "all",
      rowSelectionPointerActivator: "single-click",
      rowDragMultiRow: true,
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
        <button onClick={() => grid.state.rtl.set((prev) => !prev)}>RTL</button>
        <button onClick={() => grid.state.rowGroupModel.set(["job", "age"])}>Grouped</button>
        <button onClick={() => grid.state.rowGroupModel.set([])}>Un-group</button>
        <button onClick={() => grid.state.rowGroupDisplayMode.set("multi-column")}>
          Multi Group
        </button>
        <button onClick={() => grid.state.rowGroupDisplayMode.set("single-column")}>
          Single Group
        </button>
        <button onClick={() => grid.state.rowSelectionMode.set("multiple")}>Multi Select</button>
        <button onClick={() => grid.state.rowSelectionMode.set("single")}>Single Select</button>
        <button onClick={() => grid.state.rowSelectionMode.set("none")}>None</button>

        <div>Page: {grid.state.paginateCurrentPage.use()}</div>
        <button onClick={() => grid.state.paginateCurrentPage.set((prev) => prev + 1)}>Next</button>
        <button onClick={() => grid.state.paginateCurrentPage.set((prev) => prev - 1)}>
          Previous
        </button>
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteCommunity grid={grid} />
      </div>
    </div>
  );
}
