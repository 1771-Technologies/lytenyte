//#start
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
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

const columns: Grid.Column<GridSpec>[] = [
  { id: "symbol", cellRenderer: SymbolCell, width: 250, name: "Symbol" },
  { id: "network", cellRenderer: NetworkCell, width: 220, name: "Network" },
  { id: "exchange", cellRenderer: ExchangeCell, width: 220, name: "Exchange" },

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

//!next 5
const sortByChange24: Grid.T.SortFn<GridSpec["data"]> = (left, right) => {
  const leftData = left.data as DEXPerformanceData;
  const rightData = right.data as DEXPerformanceData;

  return leftData.change24h - rightData.change24h;
};

export default function ClientDemo() {
  const [sort, setSort] = useState<Grid.T.SortFn<GridSpec["data"]> | null>(null);

  const ds = useClientDataSource<GridSpec>({ data, sort }); //!

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-4 py-3">
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setSort(() => sortByChange24);
          }}
        >
          Sort: Ch. 24H
        </button>
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setSort(null);
          }}
        >
          Clear Sort
        </button>
      </div>
      <div
        className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight"
        style={{ height: 500 }}
      >
        <Grid columns={columns} columnBase={base} rowSource={ds} />
      </div>
    </>
  );
}
