import "./grid-navigation.css";
import "../../main.css";
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
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { bankData } from "./sample-data/bank-data.js";

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
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
    columnMarker: {
      cellRenderer: (p) => {
        return (
          <>
            {p.rowIndeterminate ? "I" : null}
            <input
              type="checkbox"
              onClick={(e) => {
                e.stopPropagation();
                p.grid.api.rowHandleSelect({ target: e.currentTarget, shiftKey: e.shiftKey });
              }}
              checked={p.rowSelected}
              onChange={() => {}}
            />
          </>
        );
      },
    },
  });

  useEffect(() => {
    return g.api.eventAddListener("rowSelectBegin", () => {
      console.log(" iran");
    });
  }, [g.api, g.state.rowSelectedIds]);
  const view = g.view.useValue();

  return (
    <div className="lng-grid">
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
                        return <HeaderGroupCell cell={c} key={c.idOccurrence} />;
                      }
                      return <HeaderCell cell={c} key={c.column.id} />;
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
