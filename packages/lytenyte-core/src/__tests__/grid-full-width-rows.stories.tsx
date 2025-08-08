import "../../main.css";
import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows-container";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId, useState } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column, Grid } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { bankData } from "./sample-data/bank-data";
import type { InternalAtoms } from "../state/+types";

const meta: Meta = {
  title: "Grid/Full Width",
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
  { id: "job" },
  { id: "balance", pin: "start" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing", pin: "end", width: 140 },
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
  const [d] = useState(data);
  const ds = useClientRowDataSource({
    data: d,
    topData: d.slice(4, 6),
    bottomData: d.slice(0, 2),
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    rowFullWidthPredicate: (p) => p.rowIndex % 2 === 0,
    rowFullWidthRenderer: () => (
      <>
        <button>A</button>
        <button>A</button>
        <button>A</button>
        <button>A</button>
      </>
    ),
  });

  const view = g.view.useValue();

  const grid = g as Grid<any> & { internal: InternalAtoms };

  const focused = grid.internal.focusActive.useValue();

  return (
    <div>
      <div>
        <div>{JSON.stringify(focused)}</div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>

      <div
        className="lng-grid"
        style={{ width: "100%", height: "80vh", border: "1px solid black" }}
      >
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
      <button>After</button>
      <button>After</button>
    </div>
  );
}

export const FullWidth: StoryObj = {
  render: Component,
};
