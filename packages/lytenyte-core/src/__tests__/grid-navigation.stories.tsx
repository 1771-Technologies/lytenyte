import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { Root } from "../root/root.js";
import { RowsContainer } from "../rows/rows-container.js";
import { Viewport } from "../viewport/viewport.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import { useId, useState } from "react";
import { HeaderCell } from "../header/header-cell.js";
import type { Column, Grid } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { bankData } from "./sample-data/bank-data.js";
import type { InternalAtoms } from "../state/+types.js";

const meta: Meta = {
  title: "Grid/Navigation",
};

export default meta;

const columns: Column<any>[] = [
  {
    id: "age",
    cellRenderer: ({ rowIndex, colIndex }) => {
      return (
        <>
          <>
            ({rowIndex},{colIndex})
          </>
          <button>A</button>
          <button>B</button>
        </>
      );
    },
  },
  {
    id: "job",
    rowSpan: 3,

    cellRenderer: ({ rowIndex, colIndex }) => {
      return (
        <>
          <>
            ({rowIndex},{colIndex})
          </>
          <button>A</button>
          <button>B</button>
        </>
      );
    },
  },
  { id: "balance", pin: "start" },
  { id: "education", colSpan: 2, rowSpan: 2 },
  { id: "marital" },
  { id: "default" },
  { id: "housing", pin: "end", width: 140, rowSpan: 2 },
  { id: "loan", groupPath: ["A", "B"] },
  { id: "contact", groupPath: ["A"] },
  { id: "day", groupPath: ["A"] },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

function Component({ data = bankData.slice(0, 200) }: { data?: any[] }) {
  const [d, setd] = useState(data);
  const ds = useClientRowDataSource({
    data: d,
    topData: d.slice(4, 6),
    bottomData: d.slice(0, 2),
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    rowFullWidthPredicate: (p) => p.rowIndex === 12 || p.rowIndex === 15 || p.rowIndex === 16,
  });

  const view = g.view.useValue();

  const grid = g as Grid<any> & { internal: InternalAtoms };

  const focused = grid.internal.focusActive.useValue();

  return (
    <div className="lng-grid">
      <div>
        <div>{JSON.stringify(focused)}</div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
        <button
          onClick={() => {
            g.api.scrollIntoView({ row: 100, behavior: "smooth" });
          }}
        >
          Scroll Row 100 Into View
        </button>
        <button
          onClick={() => {
            g.api.scrollIntoView({ column: "job", behavior: "smooth" });
          }}
        >
          Scroll to job
        </button>
        <button
          onClick={() => {
            g.api.scrollIntoView({ column: "poutcome", behavior: "smooth" });
          }}
        >
          Scroll to poutcome
        </button>
        <button
          onClick={() => {
            g.api.scrollIntoView({ column: "age", behavior: "smooth" });
          }}
        >
          Scroll to age
        </button>
        <button onClick={() => setd(data.slice(0, 2))}>Small Data</button>
        <button onClick={() => setd(data)}>All Data</button>
      </div>

      <div style={{ width: "100%", height: "80vh", border: "1px solid black" }}>
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
      <button>After</button>
      <button>After</button>
    </div>
  );
}

export const Navigation: StoryObj = {
  render: Component,
};
