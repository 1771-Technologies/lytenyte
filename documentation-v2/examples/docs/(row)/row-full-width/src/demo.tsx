//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
  tw,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { exchanges, data as rawData } from "@1771technologies/grid-sample-data/dex-pairs-performance";

const data = Object.values(
  Object.groupBy(rawData, (x) => {
    return x.exchange;
  }),
).flatMap((x) => {
  return [{ exchange: x![0].exchange, fullWidth: true }, ...x!];
}) as DEXPerformanceData[];

export interface GridSpec {
  readonly data: DEXPerformanceData & { fullWidth?: boolean };
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

const fullWidthPredicate: Grid.Props<GridSpec>["rowFullWidthPredicate"] = (p) =>
  p.api.rowIsLeaf(p.row) && !!p.row.data.fullWidth;

//#end
export default function RowDemo() {
  const ds = useClientDataSource({ data: data });
  return (
    <div
      className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight"
      style={{ height: 500 }}
    >
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        //!next 2
        rowFullWidthPredicate={fullWidthPredicate}
        rowFullWidthRenderer={FullWidthCell}
      />
    </div>
  );
}

//!next 15
function FullWidthCell({ api, row, rowIndex }: Grid.T.RowFullWidthRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const name = row.data.exchange;
  const image = exchanges[name];

  return (
    <div
      className={tw(
        "bg-ln-gray-05 flex h-full w-full items-center justify-center gap-1.5 text-xs",
        rowIndex === 0 && "border-ln-border border-b",
        rowIndex !== 0 && "border-ln-border border-y",
      )}
    >
      <div>
        <img src={image} alt={`Logo for exchange ${name}`} className="size-5 overflow-hidden rounded-full" />
      </div>
      <div className="overflow-hidden text-ellipsis">{name}</div>
    </div>
  );
}
