import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { LyteNyteGrid } from "../src/lytenyte-grid-enterprise";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNyte } from "../src/use-lytenyte";
import { ColumnManager, PillManager } from "@1771technologies/grid-components";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });
  const grid = useLyteNyte({
    gridId: "x",
    columns: columns,
    // cellSelectionMode: "range",
    cellEditPointerActivator: "double-click",
    rowFullWidthPredicate: (p) => p.row.rowIndex === 8,

    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",

    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
    },
    floatingRowEnabled: true,
    floatingRowHeight: 32,
    rowDataSource: ds,

    panelFrameButtons: [{ id: "columns", label: "Columns" }],
    panelFrames: {
      columns: {
        component: (p) => <ColumnManager api={p.api} />,
        title: "Columns",
      },
    },
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
        <PillManager api={grid.api} />
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
