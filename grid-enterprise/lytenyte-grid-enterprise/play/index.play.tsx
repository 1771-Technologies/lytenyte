import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { LyteNyteGrid } from "../src/lytenyte-grid-enterprise";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNyte } from "../src/use-lyte-nyte";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });
  const grid = useLyteNyte({
    gridId: "x",
    columns: columns,
    cellSelectionMode: "range",
    cellEditPointerActivator: "double-click",
    rowFullWidthPredicate: (p) => p.row.rowIndex === 8,
    columnBase: { resizable: true, movable: true, sortable: true },
    floatingRowEnabled: true,
    floatingRowHeight: 32,
    rowDataSource: ds,
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
          display: flex;
          align-items: center;
          gap: 4px;
        `}
      >
        <button onClick={() => grid.state.overlayToShow.set("lng1771-load-error-overlay")}>
          Error
        </button>
        <button onClick={() => grid.state.overlayToShow.set("lng1771-no-data-overlay")}>
          No data
        </button>
        <button onClick={() => grid.state.overlayToShow.set(null)}>No data</button>
        <button onClick={() => grid.state.overlayToShow.set("lng1771-loading-overlay")}>
          Loading
        </button>
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
        <button
          onClick={async () => {
            console.log(await grid.api.exportCsv());
          }}
        >
          Export
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
