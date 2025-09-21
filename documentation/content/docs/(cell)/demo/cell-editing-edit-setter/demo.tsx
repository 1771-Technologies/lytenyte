"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { stockData } from "@1771technologies/sample-data/stock-data-smaller";
import { useId } from "react";

type Stock = (typeof stockData)[number];

const columns: Column<Stock>[] = [
  { field: 0, width: 150, id: "ticker" },
  { field: 1, width: 150, id: "full", widthFlex: 1 },
  { field: 2, width: 150, id: "analyst-rating" },
  {
    width: 150,
    field: ({ data }) => {
      if (data.kind === "branch" || !data.data) return null;

      const value = data.data[3] as number;
      return value;
    },
    cellRenderer: (p) => {
      const field = p.grid.api.columnField(p.column, p.row);

      return (
        <div className="flex h-full w-full items-center justify-end px-2 tabular-nums">
          {`${field}`} USD
        </div>
      );
    },
    id: "price",
  },
  {
    width: 150,
    field: ({ data }) => {
      if (data.kind === "branch" || !data.data) return null;

      const value = data.data[3] as number;
      return Math.round(value * 1.28);
    },
    cellRenderer: (p) => {
      const field = p.grid.api.columnField(p.column, p.row) as number;

      return (
        <div className="flex h-full w-full items-center justify-end px-2 tabular-nums">
          {`${field.toFixed(2)}`} GBP
        </div>
      );
    },
    editSetter: ({ data, value }) => {
      const usdValue = Math.round(value / 1.28);

      data[3] = usdValue;
      return data;
    },

    id: "Price (GBP @ 1.28)",
  },
];

export default function CellEditingEditSetter() {
  const ds = useClientRowDataSource({ data: stockData });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    editCellMode: "cell",

    columnBase: {
      editable: true,
      widthFlex: 1,
    },
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
