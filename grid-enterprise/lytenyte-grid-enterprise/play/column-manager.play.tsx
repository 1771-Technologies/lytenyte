import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNyte } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { ColumnManager } from "../src/column-manager/column-manager";

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

    rowGroupModel: ["age", "education", "job"],

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
      `}
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGrid grid={grid} />
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <ColumnManager.Root
          grid={grid}
          className={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <div
            className={css`
              padding-inline: 8px;
              display: flex;
              align-items: center;
            `}
          >
            <ColumnManager.Search />
            <ColumnManager.PivotModeToggle />
          </div>
          <ColumnManager.DragPlaceholder />
          <div style={{ height: 600 }}>
            <ColumnManager.Tree>
              {(c) => {
                return <ColumnManager.TreeItem columnItem={c} />;
              }}
            </ColumnManager.Tree>
          </div>

          {(["row-groups", "aggregations", "column-pivots", "measures"] as const).map((c) => {
            return (
              <ColumnManager.DragBox source={c} key={c}>
                <ColumnManager.Separator dir="horizontal" />
                <ColumnManager.DragBoxControls>
                  <ColumnManager.DragBoxLabel>
                    {c === "row-groups"
                      ? "Row Groups"
                      : c === "aggregations"
                        ? "Aggregations"
                        : c === "column-pivots"
                          ? "Column Pivots"
                          : "Measures"}
                  </ColumnManager.DragBoxLabel>
                  <ColumnManager.DragBoxExpander />
                </ColumnManager.DragBoxControls>
                <ColumnManager.DropZone>
                  {({ pills }) => {
                    return (
                      <>
                        {pills.map((c) => (
                          <ColumnManager.Pill item={c} key={c.label} />
                        ))}
                      </>
                    );
                  }}
                </ColumnManager.DropZone>
              </ColumnManager.DragBox>
            );
          })}
        </ColumnManager.Root>
      </div>
    </div>
  );
}
