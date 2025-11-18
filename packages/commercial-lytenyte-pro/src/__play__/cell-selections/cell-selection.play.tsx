import "../../../main.css";
import "./cell-selection.css";
import { useClientRowDataSource } from "../../row-data-source-client/use-client-data-source.js";
import { useLyteNyte } from "../../state/use-lytenyte.js";
import { useId } from "react";
import { Viewport } from "../../grid/viewport.js";
import { Root } from "../../grid/root.js";
import { Header } from "../../grid/header.js";
import { HeaderRow } from "../../grid/header-row.js";
import { HeaderGroupCell } from "../../grid/header-group-cell.js";
import { HeaderCell } from "../../grid/header-cell.js";
import { RowsContainer } from "../../grid/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../../grid/rows-sections.js";
import { RowHandler } from "../test-utils/row-handler.js";
import { bankDataSmall } from "../test-utils/bank-data-smaller.js";
import type { Column } from "../../+types";

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job" },
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
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function CellSelection({ data = bankDataSmall }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
    topData: data.slice(0, 2),
    bottomData: data.slice(0, 2),
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    cellSelectionMode: "range",

    columnBase: {
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

  const view = g.view.useValue();

  const selections = g.state.cellSelections.useValue();
  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
        <button onClick={() => g.state.columnMarkerEnabled.set((prev) => !prev)}>
          Toggle Marker
        </button>
        <button
          onClick={() =>
            g.state.cellSelectionMode.set((prev) =>
              prev === "multi-range" ? "range" : "multi-range",
            )
          }
        >
          Range Selection
        </button>
        <pre>{JSON.stringify(selections)}</pre>
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
                            style={{
                              paddingInline: "16px",
                              background: "light-dark(rgb(200,200,200),rgb(57, 39, 39))",
                              color: "light-dark(black,white)",
                              display: "flex",
                              alignItems: "center",
                              borderBottom: "1px solid light-dark(gray, #444242)",
                              borderRight: "1px solid light-dark(gray, #444242)",
                            }}
                          />
                        );
                      }
                      return (
                        <HeaderCell
                          cell={c}
                          key={c.column.id}
                          style={{
                            paddingInline: "16px",
                            background: "light-dark(rgb(200,200,200),rgb(57, 39, 39))",
                            color: "light-dark(black,white)",
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid light-dark(gray, #444242)",
                            borderRight: "1px solid light-dark(gray, #444242)",
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
                <RowHandler rows={view.rows.top} withStyles pinned />
              </RowsTop>

              <RowsCenter>
                <RowHandler rows={view.rows.center} withStyles />
              </RowsCenter>

              <RowsBottom>
                <RowHandler rows={view.rows.bottom} withStyles pinned />
              </RowsBottom>
            </RowsContainer>
          </Viewport>
        </Root>
      </div>
    </div>
  );
}
