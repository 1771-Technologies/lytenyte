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
import { useClientRowDataSource } from "../row-data-source/use-client-data-source.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { bankData } from "./sample-data/bank-data.js";

const meta: Meta = {
  title: "Grid/Column Moving",
};

export default meta;

const columns: Column<any>[] = [
  { id: "age", groupPath: ["A"] },
  { id: "job", width: 100, groupPath: ["A"], groupVisibility: "close" },
  { id: "balance", pin: "end" },
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

    columnBase: {
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

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
        <button onClick={() => g.api.exportCsv().then((c) => console.log(c))}>Export CSV</button>
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

                      return <HeaderCell cell={c} key={c.id} />;
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

export const ColumnMoving: StoryObj = {
  render: Component,
};
