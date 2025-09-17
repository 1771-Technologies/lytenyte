import "../../main.css";
import { useEffect, useId, useState } from "react";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";
import { bankData } from "./sample-data/bank-data.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import type { Column } from "../+types.js";
import { Root } from "../root/root.js";
import { Viewport } from "../viewport/viewport.js";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { HeaderCell } from "../header/header-cell.js";
import { RowsContainer } from "../rows/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job", pin: "end", width: 110 },
  { id: "balance" },
  { id: "education", width: 120 },
  { id: "marital", width: 160 },
  { id: "default", width: 220 },
  { id: "housing", width: 110 },
  { id: "loan", width: 220 },
  { id: "contact", width: 100 },
  { id: "day", width: 400 },
  { id: "month" },
  { id: "duration", width: 111 },
  { id: "campaign", width: 222 },
  { id: "pdays", width: 180 },
  { id: "previous", width: 190 },
  { id: "poutcome", width: 70 },
  { id: "y", width: 110 },
];

const sets: Record<string, Column<any>[]> = {
  "One Start": [{ id: "age", pin: "start" }],
  "Two Start": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },
  ],
  "Three Start": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },
    { id: "marital", pin: "start", width: 160 },
  ],
  "One End": [{ id: "age", pin: "end" }],
  "Two End": [
    { id: "age", pin: "end" },
    { id: "job", pin: "end", width: 110 },
  ],
  "Three End": [
    { id: "age", pin: "end" },
    { id: "job", pin: "end", width: 110 },
    { id: "marital", pin: "end", width: 160 },
  ],
  "One Start and End": [
    { id: "age", pin: "end" },
    { id: "job", pin: "start", width: 110 },
  ],
  "Two Start and End": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },
    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "Two Start and Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
  ],
  "Two Start, Two End and Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },

    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "One Start, Two End, and Scrollable": [
    { id: "age", pin: "start" },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },

    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "Two Start, One End, and Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },

    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "Two Start, Two End, and Many Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    ...Array.from({ length: 50 }, (_, i) => {
      return [
        { field: "default", id: `${i}` + "default", width: 220 },
        { field: "housing", id: `${i}` + "housing", width: 110 },
        { field: "loan", id: `${i}` + "loan", width: 220 },
        { field: "contact", id: `${i}` + "contact", width: 100 },
        { field: "day", id: `${i}` + "day", width: 300 },
        { field: "month", id: `${i}` + "month" },
        { field: "duration", id: `${i}` + "duration", width: 111 },
      ];
    }).flat(),

    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
};

export default function ColumnPinning() {
  const ds = useClientRowDataSource({
    data: bankData,
    topData: bankData.slice(0, 2),
    bottomData: bankData.slice(0, 2),
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns: sets["oneStart"],
    // rowSelectionMode: "multiple",
    rowDataSource: ds,
    columnMarkerEnabled: false,
    columnMarker: {
      width: 40,
    },
    columnBase: {
      width: 180,
      widthFlex: 0,
      cellRenderer: (p) => {
        const field = p.grid.api.columnField(p.column, p.row);

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingInline: "8px",
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {field as string}
          </div>
        );
      },
      uiHints: {
        resizable: true,
      },
    },
  });

  const view = g.view.useValue();

  const values = Object.keys(sets);
  const [colSet, setColSet] = useState(values[0]);

  useEffect(() => {
    g.state.columns.set(sets[colSet]);
  }, [colSet, g.state.columns]);

  return (
    <div className="lng-grid">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          Toggle RTL: {g.state.rtl.useValue() ? "Currently On" : "Currently Off"}
        </button>
        <button onClick={() => g.state.columnMarkerEnabled.set((prev) => !prev)}>
          Toggle Marker: {g.state.columnMarkerEnabled.useValue() ? "Currently On" : "Currently Off"}
        </button>
        <label>
          Column Sets
          <select value={colSet} onChange={(e) => setColSet(e.target.value)}>
            {values.map((c) => {
              return (
                <option value={c} key={c}>
                  {c}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <div style={{ width: "100%", height: "90vh", border: "1px solid rgba(0,0,0,0.2)" }}>
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
