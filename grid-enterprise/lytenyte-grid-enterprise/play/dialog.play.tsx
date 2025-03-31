import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNyte } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { Dialog } from "../src/dialog/dialog";
import { Popover } from "../src/popover/popover";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });

  const grid = useLyteNyte({
    gridId: "x",
    columns: columns.map((c, i) => ({ ...c, hide: i % 2 === 0 })),
    rowDataSource: ds,

    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",
    rowDragEnabled: true,

    dialogFrames: {
      a: {
        component: () => (
          <Dialog.Container>
            <Dialog.Description>Lee is one one</Dialog.Description>
          </Dialog.Container>
        ),
      },
    },
    popoverFrames: {
      p: {
        component: () => {
          return (
            <Popover.Positioner>
              <Popover.Container>
                <Popover.Arrow></Popover.Arrow>
                <Popover.Description>This is my popover</Popover.Description>
              </Popover.Container>
            </Popover.Positioner>
          );
        },
      },
    },

    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
      headerRenderer: ({ column, api }) => {
        return (
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={(e) => api.columnMenuOpen(column, e.currentTarget)}
          >
            {column.headerName ?? column.id}
          </div>
        );
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
        <button
          onClick={() => {
            grid.api.dialogFrameOpen("a");
          }}
        >
          Open
        </button>
        <button
          onClick={(e) => {
            grid.api.popoverFrameOpen("p", e.currentTarget);
          }}
        >
          Pop
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
