import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useState } from "react";
import { LyteNyteGrid } from "../src/lytenyte-grid-enterprise";
import { makeStore } from "@1771technologies/grid-store-enterprise";
import { useClientDataSource } from "../src/use-client-data-source";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });
  const [grid] = useState(() =>
    makeStore({
      gridId: "x",
      columns: columns,
      rowFullWidthPredicate: (p) => p.row.rowIndex === 8,
      columnBase: { resizable: true, movable: true, sortable: true },
      floatingRowEnabled: true,
      floatingRowHeight: 32,
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
