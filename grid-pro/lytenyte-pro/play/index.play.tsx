import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { stockColumns } from "./data/stock-columns";
import { stockData } from "./data/stock-data";

export default function Play() {
  const ds = useClientDataSource({
    data: stockData,
  });

  const grid = useLyteNytePro({
    gridId: "x",
    columns: stockColumns,
    cellEditPointerActivator: "single-click",

    floatingCellRenderers: {
      "width-adjuster": () => <div>Lee</div>,
    },
    rowGroupColumnTemplate: {
      headerRenderer: (p) => {
        return (
          <div
            className={css`
              width: 100%;
              height: 100%;
            `}
            onClick={() => p.api.columnSortCycleToNext(p.column)}
          >
            Group
          </div>
        );
      },
    },

    rowFullWidthPredicate: (row) => row.row.rowIndex! % 2 === 0,
    rowFullWidthRenderer: () => {
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
          my rneder
        </div>
      );
    },
    panelFrameButtons: [{ id: "columns", label: "Columns" }],
    panelFrames: {
      columns: { component: () => <div>l</div>, title: "x" },
    },
    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
      floatingCellRenderer: "width-adjuster",
    },
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
          width: 100%;
        `}
      >
        <div
          className={css`
            padding: 20px;
            width: 200px;
          `}
        >
          <input
            value={grid.state.filterQuickSearch.use() ?? ""}
            onChange={(e) => grid.state.filterQuickSearch.set(e.target.value)}
          />
        </div>
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
