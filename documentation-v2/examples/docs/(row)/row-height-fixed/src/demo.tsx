//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/pill-manager.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
  ToggleGroup,
  ToggleItem,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { useState } from "react";

export interface GridSpec {
  readonly data: DEXPerformanceData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "symbol", cellRenderer: SymbolCell, width: 250, name: "Symbol" },
  { id: "network", cellRenderer: NetworkCell, width: 220, hide: true, name: "Network" },
  { id: "exchange", cellRenderer: ExchangeCell, width: 220, hide: true, name: "Exchange" },

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
export default function RowDemo() {
  const ds = useClientDataSource({ data: data });
  const [rowHeight, setRowHeight] = useState(40); //!

  return (
    <>
      <div className={"border-ln-border flex h-full items-center gap-1 text-nowrap border-b px-2 py-2"}>
        <div className={"text-light hidden text-xs font-medium md:block"}>Row Height:</div>
        <ToggleGroup
          type="single"
          value={`${rowHeight}`}
          className={"flex flex-wrap"}
          onValueChange={(c) => {
            if (!c) return;
            setRowHeight(Number.parseInt(c)); //!
          }}
        >
          <ToggleItem value="30">Small</ToggleItem>
          <ToggleItem value="40">Medium</ToggleItem>
          <ToggleItem value="60">Large</ToggleItem>
        </ToggleGroup>
      </div>
      <div
        className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight"
        style={{ height: 500 }}
      >
        <Grid rowHeight={rowHeight} columns={columns} columnBase={base} rowSource={ds} /> //!
      </div>
    </>
  );
}
