//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/pill-manager.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  ExchangeCell,
  HeaderGroupCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data } from "@1771technologies/grid-sample-data/dex-pairs-performance";

export interface GridSpec {
  readonly data: DEXPerformanceData;
}
//#end

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "symbol",
    cellRenderer: SymbolCell,
    width: 220,
    name: "Symbol",
    groupPath: ["Market Info"],
  },
  {
    id: "network",
    cellRenderer: NetworkCell,
    width: 220,
    name: "Network",
    groupPath: ["Market Info"],
  },
  {
    id: "exchange",
    cellRenderer: ExchangeCell,
    width: 220,
    name: "Exchange",
    groupPath: ["Market Info"],
  },

  {
    id: "change24h",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Change", "24h"),
    name: "Change % 24h",
    type: "number,",
    groupPath: ["Performance"],
  },

  {
    id: "perf1w",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1w"),
    name: "Perf % 1W",
    type: "number,",
    groupPath: ["Performance"],
  },
  {
    id: "perf1m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "1m"),
    name: "Perf % 1M",
    type: "number,",
    groupPath: ["Performance"],
  },
  {
    id: "perf3m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "3m"),
    name: "Perf % 3M",
    type: "number,",
    groupPath: ["Performance"],
  },
  {
    id: "perf6m",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "6m"),
    name: "Perf % 6M",
    type: "number,",
    groupPath: ["Performance"],
  },
  {
    id: "perfYtd",
    cellRenderer: PercentCellPositiveNegative,
    headerRenderer: makePerfHeaderCell("Perf %", "YTD"),
    name: "Perf % YTD",
    type: "number",
    groupPath: ["Performance"],
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

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  return (
    <div
      className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight ln-header-group:text-center ln-header-group:text-xs"
      style={{ height: 500 }}
    >
      <Grid columns={columns} columnBase={base} rowSource={ds} columnGroupRenderer={HeaderGroupCell} />
    </div>
  );
}
