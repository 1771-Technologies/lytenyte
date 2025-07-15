import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows-container";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { bankData } from "./sample-data/bank-data";

const meta: Meta = {
  title: "Grid/Row Selection",
};

export default meta;

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
  { id: "poutcome" },
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
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
    columnMarker: {
      cellRenderer: (p) => {
        return (
          <>
            {p.rowIndeterminate ? "I" : null}
            <input
              type="checkbox"
              checked={p.rowSelected}
              onChange={(e) => {
                p.grid.api.rowHandleSelect(e);
              }}
            />
          </>
        );
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
        <button onClick={() => g.state.rowSelectionMode.set("multiple")}>Multi Select</button>
        <button onClick={() => g.state.rowSelectionMode.set("single")}>Single</button>
        <button onClick={() => g.state.rowSelectionActivator.set("none")}>No click</button>
        <button onClick={() => g.state.rowSelectionActivator.set("single-click")}>
          Single Click
        </button>
        <button onClick={() => g.state.rowSelectionActivator.set("double-click")}>
          Double Click
        </button>
        <button onClick={() => g.api.rowSelectAll()}>Select All</button>
        <button onClick={() => g.api.rowSelectAll({ deselect: true })}>Deselect All</button>
        <button onClick={() => g.state.rowGroupModel.set(["age", "job"])}>Group</button>
        <button onClick={() => g.state.rowSelectChildren.set(true)}>Select Children</button>
        <button onClick={() => g.state.rowSelectChildren.set(false)}>Don't Select Children</button>
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

export const RowSelection: StoryObj = {
  render: Component,
};
