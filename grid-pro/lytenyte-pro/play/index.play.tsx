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

    cellSelectionMode: "range",

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
