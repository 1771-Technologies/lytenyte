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
import { ColumnPills } from "./pill-manager";
import { ChevronLeftIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";

const columns: Column<DEXPerformanceData>[] = [
  {
    id: "symbol",
    cellRenderer: SymbolCell,
    width: 220,
    name: "Symbol",
    groupPath: ["Market Info"],
    groupVisibility: "always",
  },
  {
    id: "network",
    cellRenderer: NetworkCell,
    width: 220,
    name: "Network",
    groupPath: ["Market Info"],
    groupVisibility: "open",
  },

  {
    id: "exchange",
    cellRenderer: ExchangeCell,
    width: 220,
    name: "Exchange",
    groupPath: ["Market Info"],
    groupVisibility: "open",
  },

  {
    id: "change24h",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Change", "24h"),
    name: "Change % 24h",
    type: "number,",
  },

  {
    id: "perf1w",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1w"),
    name: "Perf % 1W",
    type: "number,",
  },
  {
    id: "perf1m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1m"),
    name: "Perf % 1M",
    type: "number,",
  },
  {
    id: "perf3m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "3m"),
    name: "Perf % 3M",
    type: "number,",
  },
  {
    id: "perf6m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "6m"),
    name: "Perf % 6M",
    type: "number,",
  },
  {
    id: "perfYtd",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "YTD"),
    name: "Perf % YTD",
    type: "number,",
  },
  { id: "volatility", cellRenderer: PercentCell, name: "Volatility", type: "number" },
  {
    id: "volatility1m",
    cellRenderer: PercentCell,
    headerRenderer: makePerfHeaderCell("Volatility", "1m"),
    name: "Volatility 1M",
    type: "number,",
  },
];

export default function ColumnBase() {
  const ds = useClientRowDataSource({ data: data });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    headerGroupHeight: 30,
    columnBase: { width: 80 },
    columnGroupExpansions: { "Market Info": false },
  });

  const view = grid.view.useValue();

  return (
    <div>
      <ColumnPills grid={grid} />
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group")
                        return (
                          <Grid.HeaderGroupCell
                            cell={c}
                            key={c.idOccurrence}
                            className="text-xs! group flex items-center px-2"
                          >
                            <div className="flex-1">{c.id}</div>
                            <button
                              className="text-ln-gray-90 hidden items-center justify-center text-base group-data-[ln-collapsible=true]:flex"
                              onClick={() => grid.api.columnToggleGroup(c.id)}
                            >
                              <ChevronLeftIcon className="hidden group-data-[ln-collapsed=false]:block" />
                              <ChevronRightIcon className="block group-data-[ln-collapsed=false]:hidden" />
                            </button>
                          </Grid.HeaderGroupCell>
                        );

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
