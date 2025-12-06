"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { stockData } from "@1771technologies/grid-sample-data/stock-data-smaller";
import { useId } from "react";
import {
  PercentCell,
  CurrencyCell,
  SymbolCell,
  CompactNumberCell,
  HeaderRenderer,
  AnalystRatingCell,
  PriceCell,
} from "./components";

type StockData = (typeof stockData)[number];

const columns: Column<StockData>[] = [
  { field: 0, id: "symbol", name: "Symbol", cellRenderer: SymbolCell, width: 220 },
  { field: 2, id: "analyst-rating", cellRenderer: AnalystRatingCell, width: 130 },
  {
    field: 3,
    id: "price",
    name: "USD Price",
    type: "number",
    cellRenderer: PriceCell,
    width: 110,
    colSpan: 2,
  },
  { id: "price", name: "GBP Price", type: "number", width: 110 },
  { field: 5, id: "change", type: "number", cellRenderer: PercentCell, width: 130 },
  { field: 11, id: "eps", name: "EPS", type: "number", cellRenderer: CurrencyCell, width: 130 },
  { field: 6, id: "volume", type: "number", cellRenderer: CompactNumberCell, width: 130 },
];

export default function ColumnFieldNumberIndex() {
  const ds = useClientRowDataSource({ data: stockData });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: {
      headerRenderer: HeaderRenderer,
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
                        <Grid.Cell key={c.id} cell={c} className="text-xs! flex text-nowrap" />
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
