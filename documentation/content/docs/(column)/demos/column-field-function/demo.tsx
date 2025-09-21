"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { stockData } from "@1771technologies/sample-data/stock-data-smaller";
import { useId } from "react";

type Stock = (typeof stockData)[number];

const columns: Column<Stock>[] = [
  { field: 0, id: "ticker" },
  { field: 1, id: "full", widthFlex: 1 },
  { field: 2, id: "analyst-rating" },
  {
    field: ({ data }) => {
      if (data.kind === "branch" || !data.data) return null;

      const value = data.data[3] as number;
      return `$${value}`;
    },
    id: "price",
  },
  {
    field: ({ data }) => {
      if (data.kind === "branch" || !data.data) return null;

      const value = data.data[3] as number;
      return `£${(value / 1.28).toFixed(2)}`;
    },

    id: "Price (GBP @ 1.28)",
  },
];

export default function ColumnFieldFunction() {
  const ds = useClientRowDataSource({ data: stockData });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  return (
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
                        className="flex h-full w-full items-center px-2 capitalize"
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
                          className="flex h-full w-full items-center overflow-hidden text-ellipsis text-nowrap px-2 text-sm"
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
  );
}
