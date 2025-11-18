"use client";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId, useState } from "react";
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

export default function InlineStyles() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100 },
  });

  const view = grid.view.useValue();

  const [cellBg, setCellBg] = useState("#0a1314");
  const [cellFg, setCellFg] = useState("#d8dfde");
  const [headerBg, setHeaderBg] = useState("#233433");
  const [headerFg, setHeaderFg] = useState("#e8eded");

  return (
    <div>
      <div className="flex flex-col gap-2 px-2 pb-4 pt-2">
        <div className="grid grid-cols-2 gap-2 2xl:grid-cols-4 2xl:gap-8">
          <label className="flex flex-col">
            <span className="pl-1 text-sm font-bold">Cell Background</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={cellBg}
                onChange={(e) => setCellBg(e.target.value)}
              />
              <div className="text-sm">{cellBg}</div>
            </div>
          </label>
          <label className="flex flex-col">
            <span className="px-1 text-sm font-bold">Cell Text</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={cellFg}
                onChange={(e) => setCellFg(e.target.value)}
              />
              <div className="text-sm">{cellFg}</div>
            </div>
          </label>

          <label className="flex flex-col">
            <span className="pl-1 text-sm font-bold">Header Background</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={headerBg}
                onChange={(e) => setHeaderBg(e.target.value)}
              />
              <div className="text-sm">{headerBg}</div>
            </div>
          </label>
          <label className="flex flex-col">
            <span className="pl-1 text-sm font-bold">Header Text</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={headerFg}
                onChange={(e) => setHeaderFg(e.target.value)}
              />
              <div className="text-sm">{headerFg}</div>
            </div>
          </label>
        </div>
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
                            justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                            fontSize: 14,
                            background: headerBg,
                            color: headerFg,
                            textTransform: "capitalize",
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
                              justifyContent:
                                c.column.type === "number" ? "flex-end" : "flex-start",
                              fontSize: 14,
                              background: cellBg,
                              color: cellFg,
                              borderBottom: "1px solid hsla(177, 19%, 17%, 1)",
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
