"use client";
import "./main.css";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId, useState } from "react";
import { ThemePicker } from "./ui";

import styled from "@emotion/styled";
import { BalanceCell, DurationCell, NumberCell } from "./components";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "job", width: 120 },
  { id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "balance", type: "number", cellRenderer: BalanceCell },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number", cellRenderer: NumberCell },
  { id: "month" },
  { id: "duration", type: "number", cellRenderer: DurationCell },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function GridTheming() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100 },

    cellSelectionMode: "range",
    cellSelections: [{ rowStart: 4, rowEnd: 7, columnStart: 2, columnEnd: 4 }],
  });
  const [theme, setTheme] = useState("lng1771-teal");

  const view = grid.view.useValue();

  return (
    <div className={"lng-grid" + " " + theme} style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 8, display: "flex", gap: 8 }}>
        <ThemePicker theme={theme} setTheme={setTheme} />
      </div>
      <div style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <HeaderCell
                          key={c.id}
                          cell={c}
                          style={{
                            justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                          }}
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Cell
                            key={c.id}
                            cell={c}
                            style={{
                              justifyContent:
                                c.column.type === "number" ? "flex-end" : "flex-start",
                            }}
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}

const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  font-size: 14px;
`;
const HeaderCell = styled(Grid.HeaderCell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  text-transform: capitalize;
  font-size: 14px;
`;
