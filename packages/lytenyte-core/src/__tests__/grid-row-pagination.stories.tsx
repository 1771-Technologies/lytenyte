import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
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
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { bankData } from "./sample-data/bank-data.js";
import { useClientRowDataSourcePaginated } from "../row-data-source/use-client-data-source-paginated.js";

const meta: Meta = {
  title: "Grid/Row Paging",
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
  const ds = useClientRowDataSourcePaginated({
    data: data.slice(0, 249),
    rowsPerPage: 20,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    virtualizeRows: false,

    columnBase: {
      widthMin: 0,
      uiHints: {
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
        <button onClick={() => g.state.virtualizeRows.set((prev) => !prev)}>Virtualize Rows</button>
        <button onClick={() => g.state.virtualizeCols.set((prev) => !prev)}>Virtualize Cols</button>
        <div style={{ display: "flex" }}>
          <button onClick={() => ds.page.current.set((prev) => prev - 1)}>-</button>
          <div>{ds.page.current.useValue() + 1}</div>/<div>{ds.page.pageCount.useValue()}</div>
          <button onClick={() => ds.page.current.set((prev) => prev + 1)}>+</button>
        </div>
        <button onClick={() => ds.page.current.set(12)}>Jump to end</button>
        <button onClick={() => ds.page.current.set(4)}>Jump to 5</button>
        <button onClick={() => ds.page.current.set(0)}>Jump to 1</button>
        <button onClick={() => ds.page.perPage.set(50)}>50 Per page</button>
        <button onClick={() => ds.page.perPage.set(20)}>20 Per page</button>
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

export const RowPaging: StoryObj = {
  render: Component,
};
