import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { ColumnManager } from "../src/column-manager/column-manager-impl";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });

  const grid = useLyteNytePro({
    gridId: "x",
    columns: columns.map((c, i) => ({ ...c, hide: i % 2 === 0 })),
    rowDataSource: ds,

    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",
    rowDragEnabled: true,

    rowGroupAutoApplyAggDefaults: true,

    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
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
        <ColumnManager.Root
          grid={grid}
          className={css`
            display: flex;
            flex-direction: column;
            height: 100%;
          `}
        >
          <div
            className={css`
              padding-inline: 8px;
              display: flex;
              align-items: center;
              box-sizing: border-box;
            `}
          >
            <ColumnManager.Search
              className={css`
                flex: 1;
              `}
            />
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

          <div
            className={css`
              flex: 1;
              width: 100%;
              overflow: auto;
            `}
          >
            {(["row-groups", "aggregations", "column-pivots", "measures"] as const).map((c) => {
              return (
                <>
                  <ColumnManager.Separator dir="horizontal" />
                  <ColumnManager.DragBox
                    source={c}
                    key={c}
                    className={css`
                      padding-block: 8px;
                    `}
                  >
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
                    <ColumnManager.DropZoneVisibility
                      className={css`
                        padding-inline: 8px;
                        padding-bottom: 16px;
                      `}
                    >
                      <ColumnManager.DropZone
                        className={css`
                          margin-top: 8px;
                        `}
                      >
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
                    </ColumnManager.DropZoneVisibility>
                  </ColumnManager.DragBox>
                </>
              );
            })}
          </div>
        </ColumnManager.Root>
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
