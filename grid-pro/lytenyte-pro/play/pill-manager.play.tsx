import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { PillManager } from "../src/pill-manager/pill-manager-impl";

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
    rowSelectionPredicate: "all",
    rowSelectionCheckbox: "normal",
    rowDragEnabled: true,

    cellSelectionMode: "range",

    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
      uiHints: {
        columnMenu: true,
        showAggName: true,
        sortButton: true,
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
        <PillManager.Root grid={grid}>
          <PillManager.DragPlaceholder />
          <PillManager.Rows>
            <PillManager.Row pillSource="columns">
              <PillManager.RowLabelColumns />
              <PillManager.Pills>
                {({ pills }) => {
                  return (
                    <>
                      {pills.map((c) => (
                        <PillManager.Pill key={c.label} item={c} menu="$" />
                      ))}
                    </>
                  );
                }}
              </PillManager.Pills>
              <PillManager.Expander></PillManager.Expander>
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row pillSource="row-groups">
              <PillManager.RowLabelRowGroups />
              <PillManager.Pills>
                {({ pills }) => {
                  return (
                    <>
                      {pills.map((c) => (
                        <PillManager.Pill key={c.label} item={c} />
                      ))}
                    </>
                  );
                }}
              </PillManager.Pills>
              <PillManager.Expander />
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row pillSource="aggregations">
              <PillManager.RowLabelAggregations />
              <PillManager.Pills>
                {({ pills }) => {
                  return (
                    <>
                      {pills.map((c) => (
                        <PillManager.Pill key={c.label} item={c} />
                      ))}
                    </>
                  );
                }}
              </PillManager.Pills>
              <PillManager.Expander />
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row pillSource="measures">
              <PillManager.RowLabelMeasures />
              <PillManager.Pills>
                {({ pills }) => {
                  return (
                    <>
                      {pills.map((c) => (
                        <PillManager.Pill key={c.label} item={c} />
                      ))}
                    </>
                  );
                }}
              </PillManager.Pills>
              <PillManager.Expander />
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row pillSource="column-pivots">
              <PillManager.RowLabelColumnPivots />
              <PillManager.Pills>
                {({ pills }) => {
                  return (
                    <>
                      {pills.map((c) => (
                        <PillManager.Pill key={c.label} item={c} />
                      ))}
                    </>
                  );
                }}
              </PillManager.Pills>
              <PillManager.Expander />
            </PillManager.Row>
          </PillManager.Rows>
        </PillManager.Root>
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
