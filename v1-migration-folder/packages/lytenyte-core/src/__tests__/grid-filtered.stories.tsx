import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { bankData } from "./sample-data/bank-data";
import { RowHandler } from "./sample-data/row-handler";

const meta: Meta = {
  title: "Grid/Filtering",
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
  });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
        <button
          onClick={() => {
            g.state.filterModel.set([
              { field: "job", kind: "string", value: "unemployed", operator: "equals" },
            ]);
          }}
        >
          Filtered
        </button>
        <button
          onClick={() => {
            g.state.filterModel.set([]);
          }}
        >
          No Filtered
        </button>
      </div>
      <div></div>

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
                          onClick={() => {
                            const current = g.api.sortForColumn(c.column.id);

                            if (current == null) {
                              g.state.sortModel.set([
                                {
                                  columnId: c.column.id,
                                  sort: { kind: "string" },
                                  isDescending: false,
                                },
                              ]);
                              return;
                            }
                            if (!current.sort.isDescending) {
                              g.state.sortModel.set([{ ...current.sort, isDescending: true }]);
                            } else {
                              g.state.sortModel.set([]);
                            }
                          }}
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

export const Filtering: StoryObj = {
  render: Component,
};
