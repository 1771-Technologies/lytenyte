"use client";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId, useState } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function InlineStyles() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  const [cellBg, setCellBg] = useState("#000000");
  const [cellFg, setCellFg] = useState("#ffffff");
  const [headerBg, setHeaderBg] = useState("navy");
  const [headerFg, setHeaderFg] = useState("white");

  return (
    <div>
      <div style={{ paddingInline: "8px", paddingBlock: "8px" }}>
        Click the color boxes to edit the style of the cells in the grid
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "8px",
          alignItems: "center",
          paddingInline: "8px",
        }}
      >
        <span>Cell Background</span>
        <input type="color" value={cellBg} onChange={(e) => setCellBg(e.target.value)} />

        <span>Cell Text</span>
        <input type="color" value={cellFg} onChange={(e) => setCellFg(e.target.value)} />

        <span>Header Background</span>
        <input type="color" value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} />

        <span>Header Text</span>
        <input type="color" value={headerFg} onChange={(e) => setHeaderFg(e.target.value)} />
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
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingInline: "8px",
                            background: headerBg,
                            color: headerFg,
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
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              paddingInline: "8px",
                              background: cellBg,
                              color: cellFg,
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
