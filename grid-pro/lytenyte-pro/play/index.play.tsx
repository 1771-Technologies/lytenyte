import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });

  const grid = useLyteNytePro({
    gridId: "x",
    columns: columns,
    cellEditPointerActivator: "single-click",

    cellSelectionMode: "range",

    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",
    rowDragEnabled: true,

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

    panelFrameButtons: [{ id: "columns", label: "Columns" }],
    panelFrames: {
      columns: { component: () => <div>l</div>, title: "x" },
    },
    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
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
