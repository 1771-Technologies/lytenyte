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
  title: "Grid/Pinned Columns",
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

const columnsPinStart: Column<any>[] = [
  { id: "age" },
  { id: "job", pin: "start" },
  { id: "balance", pin: "start" },
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
const columnsPinEnd: Column<any>[] = [
  { id: "age" },
  { id: "job", pin: "end" },
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

const columnsPinBoth: Column<any>[] = [
  { id: "age" },
  { id: "job", pin: "end" },
  { id: "balance", pin: "end" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration", pin: "start" },
  { id: "campaign", pin: "start" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

const columnsPinEndOnly: Column<any>[] = [
  { id: "job", pin: "end" },
  { id: "balance", pin: "end" },
];
const columnsPinStartOnly: Column<any>[] = [
  { id: "job", pin: "start" },
  { id: "balance", pin: "start" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
  });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>
      <div>
        <button onClick={() => g.state.columns.set(columnsPinStart)}>Pin Start</button>
        <button onClick={() => g.state.columns.set(columnsPinEnd)}>Pin End</button>
        <button onClick={() => g.state.columns.set(columnsPinBoth)}>Pin Both</button>
        <button onClick={() => g.state.columns.set(columns)}>No Pin</button>
        <button onClick={() => g.state.columns.set(columnsPinEndOnly)}>Pin End Only</button>
        <button onClick={() => g.state.columns.set(columnsPinStartOnly)}>Pin Start Only</button>
      </div>

      <div
        className="lng-grid"
        style={{ width: "100%", height: "92vh", border: "1px solid black" }}
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
    </div>
  );
}

export const PinnedColumns: StoryObj = {
  render: Component,
};
