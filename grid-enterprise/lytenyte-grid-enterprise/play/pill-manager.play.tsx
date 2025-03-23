import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNyte } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { PillManager } from "../src/pill-manager/pill-manager";

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
        <PillManager.Root grid={grid}>
          <PillManager.Rows>
            <PillManager.Row>
              <PillManager.RowLabelColumns />
              <PillManager.Pills pillSource="columns">
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
              <PillManager.Expander>X</PillManager.Expander>
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row>
              <PillManager.RowLabelRowGroups />
              <PillManager.Pills pillSource="row-groups">
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
              <PillManager.Expander>X</PillManager.Expander>
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row>
              <PillManager.RowLabelAggregations />
              <PillManager.Pills pillSource="aggregations">
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
              <PillManager.Expander>X</PillManager.Expander>
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row>
              <PillManager.RowLabelMeasures />
              <PillManager.Pills pillSource="measures">
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
              <PillManager.Expander>X</PillManager.Expander>
            </PillManager.Row>
            <PillManager.Separator />

            <PillManager.Row>
              <PillManager.RowLabelColumnPivots />
              <PillManager.Pills pillSource="column-pivots">
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
              <PillManager.Expander>X</PillManager.Expander>
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
