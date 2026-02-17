"use client";

import { Grid, measureText, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import {
  ExchangeCell,
  GridButton,
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
  {
    id: "symbol",
    cellRenderer: SymbolCell,
    name: "Crypto Currency Symbol, Ticker, and Name",
    autosizeHeaderFn: (p) => {
      const textWidth = measureText(
        `${p.column.name ?? p.column.id}`,
        p.grid.state.viewport.get(),
      ).width;

      const padding = 20;
      return textWidth + padding;
    },
    autosizeCellFn: (p) => {
      if (p.row.kind !== "leaf" || !p.row.data) return null;

      const data = p.row.data;
      const textWidth = measureText(
        `${data.symbol.split("/")[0].trim()}${data.symbolTicker}`,
        p.grid.state.viewport.get(),
      ).width;
      const iconWidth = 20;
      const gapWidth = 20;
      const padding = 24;

      return textWidth + iconWidth + gapWidth + padding;
    },
  },
  {
    id: "network",
    cellRenderer: NetworkCell,
    name: "Network",
    autosizeCellFn: (p) => {
      if (p.row.kind !== "leaf" || !p.row.data) return null;

      const data = p.row.data;
      const textWidth = measureText(data.network, p.grid.state.viewport.get()).width;
      const iconWidth = 20;
      const gapWidth = 6;
      const padding = 20;

      return textWidth + iconWidth + gapWidth + padding;
    },
  },
  {
    id: "exchange",
    cellRenderer: ExchangeCell,
    name: "Exchange",

    autosizeCellFn: (p) => {
      if (p.row.kind !== "leaf" || !p.row.data) return null;

      const data = p.row.data;
      const textWidth = measureText(data.exchange, p.grid.state.viewport.get()).width;
      const iconWidth = 20;
      const gapWidth = 6;
      const padding = 20;

      return textWidth + iconWidth + gapWidth + padding;
    },
  },

  {
    id: "change24h",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Change", "24H"),
    name: "Change % 24h",
    type: "number,",
  },

  {
    id: "perf1w",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1W"),
    name: "Perf % 1W",
    type: "number,",
  },
  {
    id: "perf1m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1M"),
    name: "Perf % 1M",
    type: "number,",
  },
  {
    id: "perf3m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "3M"),
    name: "Perf % 3M",
    type: "number,",
  },
  {
    id: "perf6m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "6M"),
    name: "Perf % 6M",
    type: "number,",
  },
  {
    id: "perfYtd",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "YTD"),
    name: "Perf % YTD",
    type: "number",
  },
  { id: "volatility", cellRenderer: PercentCell, name: "Volatility", type: "number" },
  {
    id: "volatility1m",
    cellRenderer: PercentCell,
    headerRenderer: makePerfHeaderCell("Volatility", "1M"),
    name: "Volatility 1M",
    type: "number",
  },
];

export default function ColumnBase() {
  const ds = useClientRowDataSource({ data: data });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  return (
    <div>
      <div className="flex gap-2 border-b px-2 py-2">
        <GridButton
          onClick={() => {
            grid.api.columnAutosize({ includeHeader: true });
          }}
        >
          Autosize Including Headers
        </GridButton>

        <GridButton
          onClick={() => {
            grid.state.columns.set(columns);
          }}
        >
          Reset Columns
        </GridButton>
      </div>
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport className="text-xs">
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
                            "text-ln-gray-60! dark:text-ln-gray-70! flex h-full w-full items-center text-nowrap px-2 text-xs",
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
    </div>
  );
}
