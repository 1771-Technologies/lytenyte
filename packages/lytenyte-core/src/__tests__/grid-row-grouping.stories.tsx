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
import { bankDataSmall } from "./sample-data/bank-data-smaller";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";

const meta: Meta = {
  title: "Grid/Row Grouping",
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

function MainComp() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    rowGroupModel: ["job"],
    rowGroupDisplayMode: "multi-column",

    rowGroupColumn: {
      pin: "start",
    },

    aggModel: {
      job: { fn: "first" },
      balance: { fn: "sum" },
      education: { fn: () => 1 },
    },

    columnBase: {
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
      </div>
      <div>
        <button onClick={() => g.state.rowGroupDisplayMode.set("single-column")}>
          Single Group
        </button>
        <button onClick={() => g.state.rowGroupDisplayMode.set("multi-column")}>Multi Group</button>
        <button onClick={() => g.state.rowGroupDisplayMode.set("custom")}>Custom</button>
        <button
          onClick={() =>
            g.state.columns.set(
              g.state.columnMeta.get().columnsVisible.toSorted(() => Math.random() - 0.5),
            )
          }
        >
          Shuffle
        </button>

        <button onClick={() => g.state.rowGroupModel.set(["job"])}>Group on Job</button>
        <button onClick={() => g.state.rowGroupModel.set(["job", "education"])}>
          Group on Job & Education
        </button>
        <button onClick={() => g.state.rowGroupModel.set([])}>No Group</button>

        <button
          onClick={() => g.state.aggModel.set((prev) => ({ ...prev, balance: { fn: "sum" } }))}
        >
          Sum
        </button>
        <button
          onClick={() => g.state.aggModel.set((prev) => ({ ...prev, balance: { fn: "avg" } }))}
        >
          Avg
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

export const RowGrouping: StoryObj = {
  render: MainComp,
};
