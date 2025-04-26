import { columns } from "./data/columns";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { PillManager } from "../src/pill-manager/pill-manager-impl";
import { Menu } from "../src/menu/menu";
import "./db/server.js";
import { useServerDataSource } from "../src/use-server-data-source";
import { dataFetcher } from "./db/data-fetcher";

export default function Play() {
  const ds = useServerDataSource({
    rowDataFetcher: dataFetcher,
  });

  const grid = useLyteNytePro({
    gridId: "x",
    columns: columns.map((c) => ({ ...c, pin: null })),
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

    menuFrames: {
      x: {
        component: () => {
          return (
            <Menu.Positioner>
              <Menu.Container>
                <Menu.Item>Lee</Menu.Item>
                <Menu.Item>Lee</Menu.Item>
                <Menu.Item>Lee</Menu.Item>
              </Menu.Container>
            </Menu.Positioner>
          );
        },
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
                        <PillManager.Pill key={c.label} item={c} menu="x" />
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
