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
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";
import { useServerDataSource } from "../row-data-source-server/use-server-data-source.js";
import { handleRequest } from "./db/server.js";
import { cycleSorts } from "../utils/cycle-sorts.js";

const meta: Meta = {
  title: "Grid/Server Side Source",
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

function Component() {
  const ds = useServerDataSource({
    dataFetcher: async (p) => {
      const res = await handleRequest(p.requests, p.model);
      return res;
    },
    dataColumnPivotFetcher: async () => {
      return [{ id: "x" }, { id: "y" }];
    },
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    rowGroupModel: ["job"],
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
    editCellMode: "cell",

    rowGroupColumn: {
      cellRenderer: ({ grid, row }) => {
        if (!grid.api.rowIsGroup(row)) return null;

        return (
          <div>
            Group
            <button onClick={() => grid.api.rowGroupToggle(row)}>T</button>
            {row.loading && <div>Loading</div>}
          </div>
        );
      },
    },
  });

  const view = g.view.useValue();

  const [qsLocal, setQsLocal] = useState(g.state.quickSearch.get() ?? "");

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
        <button onClick={() => g.state.columnPivotMode.set((prev) => !prev)}>
          Pivot Mode {g.state.columnPivotMode.useValue() ? "Yes" : "No"}
        </button>
        <button onClick={() => g.state.rowGroupModel.set(["job"])}>Group By Job</button>
        <button onClick={() => g.state.rowGroupModel.set(["job", "education"])}>
          Group By Job and Education
        </button>
        <button onClick={() => g.state.rowGroupModel.set([])}>No Group</button>
        <input value={qsLocal} onChange={(e) => setQsLocal(e.target.value)} />
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
                          onClick={() => {
                            cycleSorts(g, c.column);
                          }}
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

export const ServerSideSource: StoryObj = {
  render: Component,
};
