"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
  tw,
} from "./components";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data } from "@1771technologies/grid-sample-data/dex-pairs-performance";

const columns: Column<DEXPerformanceData>[] = [
  { id: "Symbol", cellRenderer: SymbolCell, width: 220, field: "symbol" },
  { id: "Network", cellRenderer: NetworkCell, width: 220, field: "network" },
  { id: "Exchange", cellRenderer: ExchangeCell, width: 220, field: "exchange" },

  {
    id: "Change % 24h",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Change", "24h"),
    type: "number,",
    field: "change24h",
  },

  {
    field: "perf1w",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1w"),
    id: "Perf % 1W",
    type: "number,",
  },
  {
    field: "perf1m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1m"),
    id: "Perf % 1M",
    type: "number,",
  },
  {
    field: "perf3m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "3m"),
    id: "Perf % 3M",
    type: "number,",
  },
  {
    field: "perf6m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "6m"),
    id: "Perf % 6M",
    type: "number,",
  },
  {
    field: "perfYtd",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "YTD"),
    id: "Perf % YTD",
    type: "number",
  },
  { field: "volatility", cellRenderer: PercentCell, id: "Volatility", type: "number" },
  {
    field: "volatility1m",
    cellRenderer: PercentCell,
    headerRenderer: makePerfHeaderCell("Volatility", "1m"),
    id: "Volatility 1M",
    type: "number",
  },
];

export default function ColumnBase() {
  const ds = useClientRowDataSource({ data: data.slice(2), topData: data.slice(0, 2) });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 80 },
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
                        className={tw(
                          "text-ln-gray-60! dark:text-ln-gray-70! flex h-full w-full items-center text-nowrap px-2 text-xs capitalize",
                          c.column.type === "number" && "justify-end",
                        )}
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer>
            <Grid.RowsTop>
              {view.rows.top.map((row) => {
                if (row.kind === "full-width") return null;

                return (
                  <Grid.Row row={row} key={row.id}>
                    {row.cells.map((c) => {
                      return (
                        <Grid.Cell
                          key={c.id}
                          cell={c}
                          className="text-xs! flex h-full w-full items-center px-2"
                        />
                      );
                    })}
                  </Grid.Row>
                );
              })}
            </Grid.RowsTop>

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
                          className="text-xs! flex h-full w-full items-center px-2"
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
