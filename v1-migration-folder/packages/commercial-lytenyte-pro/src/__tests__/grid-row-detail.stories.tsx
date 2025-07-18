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
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { bankData } from "./sample-data/bank-data";

const meta: Meta = {
  title: "Grid/Row Detail",
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

    rowFullWidthPredicate: (p) => p.rowIndex === 3,

    rowDetailExpansions: new Set("3"),

    rowDetailRenderer: () => {
      return (
        <>
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
          <button>Fourth</button>
        </>
      );
    },
    columnMarker: {
      cellRenderer: (p) => {
        return <button onClick={() => p.grid.api.rowDetailToggle(p.row)}>+</button>;
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
        <button
          onClick={() => g.state.rowDetailHeight.set((prev) => (prev === "auto" ? 300 : "auto"))}
        >
          Toggle Height
        </button>
        <button onClick={() => g.state.columnMarkerEnabled.set((prev) => !prev)}>
          Toggle Marker
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

export const RowDetail: StoryObj = {
  render: Component,
};
