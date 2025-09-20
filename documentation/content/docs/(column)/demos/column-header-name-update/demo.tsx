"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { name: "Years Alive", id: "age", type: "number" },
  { name: "Employment", id: "job" },
  { name: "Money In Bank", id: "balance", type: "number" },
  { name: "Smartness Level", id: "education" },
  { name: "Single Or Not?", id: "marital" },
];

export default function ColumnHeaderNameUpdate() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      widthFlex: 1,
    },
  });

  const cols = grid.state.columns.useValue();

  const view = grid.view.useValue();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex gap-2">
        <input
          className="text-sm px-2 h-full border rounded-xs bg-gray-900 text-white p-1"
          aria-label="update-age"
          style={{ width: 150, boxSizing: "border-box" }}
          value={cols[0].name ?? ""}
          onChange={(e) => {
            grid.api.columnUpdate({ [cols[0].id]: { name: e.target.value } });
          }}
        />
        <input
          aria-label="update-job"
          className="text-sm px-2 h-full border rounded-xs bg-gray-900 text-white p-1"
          style={{ width: 150, boxSizing: "border-box" }}
          value={cols[1].name ?? ""}
          onChange={(e) => {
            grid.api.columnUpdate({ [cols[1].id]: { name: e.target.value } });
          }}
        />
        <input
          aria-label="update-balance"
          className="text-sm px-2 h-full border rounded-xs bg-gray-900 text-white p-1"
          style={{ width: 150, boxSizing: "border-box" }}
          value={cols[2].name ?? ""}
          onChange={(e) => {
            grid.api.columnUpdate({ [cols[2].id]: { name: e.target.value } });
          }}
        />
        <input
          aria-label="update-education"
          className="text-sm px-2 h-full border rounded-xs bg-gray-900 text-white p-1"
          style={{ width: 150, boxSizing: "border-box" }}
          value={cols[3].name ?? ""}
          onChange={(e) => {
            grid.api.columnUpdate({ [cols[3].id]: { name: e.target.value } });
          }}
        />
        <input
          aria-label="update-marital"
          className="text-sm px-2 h-full border rounded-xs bg-gray-900 text-white p-1"
          style={{ width: 150, boxSizing: "border-box" }}
          value={cols[4].name ?? ""}
          onChange={(e) => {
            grid.api.columnUpdate({ [cols[4].id]: { name: e.target.value } });
          }}
        />
      </div>

      <div className="lng-grid" style={{ height: 500 }}>
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
                          className="flex w-full h-full capitalize px-2 items-center"
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
                            className="text-sm flex items-center px-2 h-full w-full"
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
