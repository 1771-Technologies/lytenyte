import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { Root } from "../root/root.js";
import { RowsContainer } from "../rows/rows-container.js";
import { Viewport } from "../viewport/viewport.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import { useEffect, useId } from "react";
import { HeaderCell } from "../header/header-cell.js";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { bankData } from "./sample-data/bank-data.js";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";

const meta: Meta = {
  title: "Grid/Cell Editing",
};

export default meta;

const columns: Column<any>[] = [
  { id: "age", editable: true },
  { id: "job", groupPath: ["A", "B"], editable: true },
  { id: "balance", groupPath: ["A"], editable: true },
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
  { id: "poutcome" },
  { id: "y" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    columnMarkerEnabled: true,

    editCellMode: "cell",
    editClickActivator: "single",
  });

  const view = g.view.useValue();

  useEffect(() => {
    setTimeout(() => {
      g.api.editUpdate({ column: 0, rowIndex: 0, value: "Lee" });
    }, 100);
  }, [g.api]);

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
        <button onClick={() => g.state.editClickActivator.set("double-click")}>
          Double Click Edit
        </button>
        <button onClick={() => g.state.editClickActivator.set("single")}>Single Click Edit</button>
        <button
          onClick={() => {
            g.api.focusCell({ row: 2, column: 2 });
          }}
        >
          Focus Cell 2
        </button>
        <button
          onClick={() => {
            g.api.focusCell({ kind: "header-cell", colIndex: 2 });
          }}
        >
          Focus Header 2
        </button>
        <button
          onClick={() => {
            g.api.focusCell({ kind: "header-group-cell", colIndex: 1, hierarchyRowIndex: 0 });
          }}
        >
          Focus A
        </button>
        <button
          onClick={() => {
            g.api.focusCell({ kind: "header-group-cell", colIndex: 1, hierarchyRowIndex: 1 });
          }}
        >
          Focus AB
        </button>
        <button
          onClick={() => {
            ds.rowDelete([0]);
          }}
        >
          Delete First
        </button>
        <button
          onClick={() => {
            ds.rowAdd([{}], "beginning");
          }}
        >
          Add
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
  );
}

export const CellEditing: StoryObj = {
  render: Component,
};
