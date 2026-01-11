//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data as rawData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
//#end

export interface GridSpec {
  readonly data: DEXPerformanceData;
}

const exchangeCounts: Record<string, number> = {};
const data = Object.values(
  Object.groupBy(rawData, (x) => {
    return x.exchange;
  }),
).flatMap((x) => {
  exchangeCounts[x![0].exchange] = Math.min(x!.length, 5);
  return x!.slice(0, 5); // Only take the first 5
}) as DEXPerformanceData[];

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "symbol",
    cellRenderer: SymbolCell,
    width: 250,
    name: "Symbol",
    //!next 4
    rowSpan: (r) => {
      const exchange = r.row.data?.exchange as string;
      return exchangeCounts[exchange] ?? 1;
    },
  },
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

export default function ColumnBase() {
  const ds = useClientDataSource({ data: data });

  return (
    <div
      className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight"
      style={{ height: 500 }}
    >
      <Grid columns={columns} columnBase={base} rowSource={ds} cellSelectMode="range" />
    </div>
  );
}
