import "./grid-navigation.css";
import { Dialog } from "@base-ui-components/react/dialog";
import { Menu } from "@base-ui-components/react/menu";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { Root } from "../root/root.js";
import { RowsContainer } from "../rows/rows-container.js";
import { Viewport } from "../viewport/viewport.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell.js";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { bankData } from "./sample-data/bank-data.js";

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    dialogFrames: {
      test: {
        component: (p) => {
          return (
            <Dialog.Root
              defaultOpen
              onOpenChangeComplete={(c) => {
                if (c) return;

                p.grid.api.popoverFrameClose("test");
              }}
            >
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                  <Dialog.Title>This is my dialog</Dialog.Title>
                  <Dialog.Description>This is my description</Dialog.Description>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          );
        },
      },
    },

    popoverFrames: {
      test: {
        component: (p) => {
          console.log(p.target);
          return (
            <Menu.Root
              defaultOpen
              onOpenChangeComplete={(c) => {
                if (c) return;

                p.grid.api.popoverFrameClose("test");
              }}
            >
              <Menu.Portal>
                <Menu.Backdrop />
                <Menu.Positioner anchor={p.target}>
                  <Menu.Popup>
                    <Menu.Item>Run once</Menu.Item>
                    <Menu.Item>Run once</Menu.Item>
                    <Menu.Item>Run once</Menu.Item>
                    <Menu.Item>Run once</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          );
        },
      },
    },

    columnBase: {
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
        <button onClick={() => g.state.columnMarkerEnabled.set((prev) => !prev)}>
          Toggle Marker
        </button>
        <button onClick={() => g.api.dialogFrameOpen("test")}>Open Dialog</button>
        <button onClick={(ev) => g.api.popoverFrameOpen("test", ev.currentTarget)}>
          Open Popover
        </button>
      </div>

      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Root grid={g}>
          <Viewport>
            <Header>
              {view.header.layout.map((row, i) => {
                return (
                  <HeaderRow headerRowIndex={i} key={i}>
                    {row.map((c) => {
                      if (c.kind === "group") {
                        return (
                          <HeaderGroupCell
                            cell={c}
                            key={c.idOccurrence}
                            style={{ border: "1px solid black", background: "lightgray" }}
                          />
                        );
                      }

                      return (
                        <HeaderCell
                          cell={c}
                          key={c.id}
                          style={{
                            border: "1px solid black",
                            background: "lightgray",
                          }}
                        />
                      );
                    })}
                  </HeaderRow>
                );
              })}
            </Header>

            <RowsContainer>
              <RowsTop>
                <RowHandler rows={view.rows.top} />
              </RowsTop>
              <RowsCenter>
                <RowHandler rows={view.rows.center} />
              </RowsCenter>
              <RowsBottom>
                <RowHandler rows={view.rows.bottom} />
              </RowsBottom>
            </RowsContainer>
          </Viewport>
        </Root>
      </div>
    </div>
  );
}

export const Frames = {
  render: Component,
};
