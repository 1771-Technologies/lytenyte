"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
];

export default function ColumnHeaderFloatingRowHeight() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    floatingRowEnabled: true,
    floatingRowHeight: 20,

    columnBase: {
      widthFlex: 1,
    },
  });

  const view = grid.view.useValue();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{ display: "flex", gap: 8, alignItems: "center" }}
        className="py-2"
      >
        <div>Change Floating Row Height: </div>

        <button
          className="bg-gray-900 text-white border border-gray-600 rounded px-2"
          onClick={() => grid.state.floatingRowHeight.set(20)}
        >
          Small
        </button>
        <button
          className="bg-gray-900 text-white border border-gray-600 rounded px-2"
          onClick={() => grid.state.floatingRowHeight.set(50)}
        >
          Medium
        </button>
        <button
          className="bg-gray-900 text-white border border-gray-600 rounded px-2"
          onClick={() => grid.state.floatingRowHeight.set(80)}
        >
          Large
        </button>
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

                      if (c.kind === "floating") {
                        return (
                          <Grid.HeaderCell
                            key={c.id}
                            cell={c}
                            className="flex w-full h-full capitalize px-2 items-center"
                          >
                            Floating Cell
                          </Grid.HeaderCell>
                        );
                      }

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
