"use client";
import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId, useMemo } from "react";

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
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function GridReactivitySignal() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowSelectedIds: new Set(["3", "4"]),
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
  });

  const selectedRows = grid.state.rowSelectedIds.useValue();
  const selectedRow = useMemo(() => {
    if (!selectedRows.size) return null;

    return [...selectedRows.values()].join(", ");
  }, [selectedRows]);

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ display: "flex", flexDirection: "column" }}>
      <div className="p-2">
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white dark:text-black"
          onClick={() => grid.state.rowSelectedIds.set(new Set())}
        >
          Clear Row Selection
        </button>
      </div>
      <div
        className="max-h-[200px] max-w-full overflow-auto font-bold"
        style={{ padding: 8, display: "flex", gap: 8, scrollbarWidth: "thin" }}
      >
        {selectedRow && `Currently selected rows: ${selectedRow}`}
        {!selectedRow && "No rows selected"}
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

                      return <Grid.HeaderCell key={c.id} cell={c} />;
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
                        return <Grid.Cell key={c.id} cell={c} />;
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
