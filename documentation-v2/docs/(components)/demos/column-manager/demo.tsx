//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { ColumnManager, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { useState } from "react";

export interface GridSpec {
  readonly data: DEXPerformanceData;
}

const initialColumns: Grid.Column<GridSpec>[] = [
  { id: "symbol", groupPath: ["Marker Info"], cellRenderer: SymbolCell, width: 250, name: "Symbol" },
  {
    id: "network",
    groupPath: ["Marker Info"],
    cellRenderer: NetworkCell,
    width: 220,
    hide: true,
    name: "Network",
  },
  {
    id: "exchange",
    groupPath: ["Marker Info"],
    cellRenderer: ExchangeCell,
    width: 220,
    hide: true,
    name: "Exchange",
  },

  {
    id: "change24h",
    groupPath: ["Performance"],
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Change", "24h"),
    name: "Change % 24h",
    type: "number,",
  },

  {
    id: "perf1w",
    groupPath: ["Performance"],
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1w"),
    name: "Perf % 1W",
    type: "number,",
  },
  {
    id: "perf1m",
    groupPath: ["Performance"],
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1m"),
    name: "Perf % 1M",
    type: "number,",
  },
  {
    id: "perf3m",
    groupPath: ["Performance"],
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "3m"),
    name: "Perf % 3M",
    type: "number,",
  },
  {
    id: "perf6m",
    groupPath: ["Performance"],
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "6m"),
    name: "Perf % 6M",
    type: "number,",
  },
  {
    id: "perfYtd",
    groupPath: ["Performance"],
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "YTD"),
    name: "Perf % YTD",
    type: "number",
  },
  { id: "volatility", cellRenderer: PercentCell, name: "Volatility", type: "number" },
  {
    id: "volatility1m",
    cellRenderer: PercentCell,
    headerRenderer: makePerfHeaderCell("Volatility", "1m"),
    name: "Volatility 1M",
    type: "number",
  },
];

const base: Grid.ColumnBase<GridSpec> = { width: 80 };

//#end
export default function ComponentDemo() {
  const ds = useClientDataSource({ data: data });
  const [columns, setColumns] = useState(initialColumns); //!

  return (
    <div className="ln-grid flex">
      <div className="min-w-60 py-2">
        <div className="h-full w-full">
          <ColumnManager columns={columns} onColumnsChange={setColumns} />
        </div>
      </div>
      <div
        className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight border-ln-border flex-1 border-s"
        style={{ height: 500 }}
      >
        <Grid columns={columns} columnBase={base} rowSource={ds} />
      </div>
    </div>
  );
}
