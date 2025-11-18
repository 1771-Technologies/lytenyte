import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useLyteNyte } from "../state/use-lytenyte.js";
import { useId } from "react";
import type { Column } from "../+types";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";
import { bankData } from "./sample-data/bank-data.js";
import { ColumnManager as CM2 } from "../column-manager/column-manager.js";
import { Root } from "../root/root.js";
import { Viewport } from "../viewport/viewport.js";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { HeaderCell } from "../header/header-cell.js";
import { RowsContainer } from "../rows/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";

const meta: Meta = {
  title: "Grid/Column Manager",
};

export default meta;

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance", pin: "start" },
  { id: "education", pin: "end" },
  { id: "marital", groupPath: ["A", "B"] },
  { id: "default", groupPath: ["A"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["A", "C"] },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
    topData: data.slice(0, 2),
    bottomData: data.slice(0, 2),
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    cellSelectionMode: "range",

    columnBase: {
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

  const { items, lookup } = CM2.useColumnManager({ grid: g });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "30%", height: "90vh", border: "1px solid black" }}></div>
        <div style={{ width: "30%", height: "90vh", border: "1px solid black" }}>
          <CM2.Root grid={g} lookup={lookup}>
            <CM2.Panel>
              {items.map(function Render(item) {
                if (item.kind === "leaf")
                  return (
                    <CM2.Leaf key={item.data.id} item={item} style={{ display: "flex" }}>
                      <CM2.MoveHandle>O</CM2.MoveHandle>
                      <CM2.VisibilityCheckbox />
                      <CM2.Label />
                    </CM2.Leaf>
                  );

                const children = [...item.children.values()];

                return (
                  <CM2.Branch
                    key={item.id}
                    item={item}
                    label={
                      <div style={{ display: "flex", gap: "2px" }}>
                        <CM2.MoveHandle>O</CM2.MoveHandle>
                        <CM2.VisibilityCheckbox />
                        <CM2.Label />
                      </div>
                    }
                    labelWrapStyle={{
                      display: "flex",
                      paddingLeft: "calc(--ln-tree-depth * 16px)",
                    }}
                  >
                    {children.map(Render)}
                  </CM2.Branch>
                );
              })}
            </CM2.Panel>
          </CM2.Root>
        </div>
        <div style={{ width: "40%", height: "90vh", border: "1px solid black" }}>
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
                            key={c.column.id}
                            style={{ border: "1px solid black", background: "lightgray" }}
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
    </div>
  );
}

export const ColumnManagerComp: StoryObj = {
  render: Component,
};
