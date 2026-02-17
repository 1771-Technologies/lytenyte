//#start
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
import { Grid, measureText, useClientDataSource } from "@1771technologies/lytenyte-pro";
import { useRef, useState } from "react";

export interface GridSpec {
  readonly data: DEXPerformanceData;
}

const initialColumns: Grid.Column<GridSpec>[] = [
  {
    id: "symbol",
    cellRenderer: SymbolCell,
    name: "Crypto Currency Symbol, Ticker, and Name",
    autosizeHeaderFn: (p) => {
      const textWidth = measureText(`${p.column.name ?? p.column.id}`, p.api.viewport())?.width ?? 100;

      const padding = 20;
      return textWidth + padding;
    },
    autosizeCellFn: (p) => {
      if (p.row.kind !== "leaf" || !p.row.data) return null;

      const data = p.row.data;
      const textWidth =
        measureText(`${data.symbol.split("/")[0].trim()}${data.symbolTicker}`, p.api.viewport())?.width ??
        100;
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
      const textWidth = measureText(data.network, p.api.viewport())?.width ?? 100;
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
      const textWidth = measureText(data.exchange, p.api.viewport())?.width ?? 100;
      const iconWidth = 20;
      const gapWidth = 6;
      const padding = 20;

      return textWidth + iconWidth + gapWidth + padding;
    },
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
export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  const ref = useRef<Grid.API<GridSpec>>(null);
  const [columns, setColumns] = useState(initialColumns);

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-2 py-2">
        <button
          data-ln-button="website"
          data-ln-size="mx"
          onClick={() => {
            ref.current?.columnAutosize({ includeHeader: true }); //!
          }}
        >
          Autosize Including Headers
        </button>
        <button
          data-ln-button="website"
          data-ln-size="mx"
          onClick={() => {
            setColumns(initialColumns);
          }}
        >
          Reset Columns
        </button>
      </div>
      <div
        className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight"
        style={{ height: 500 }}
      >
        <Grid columns={columns} onColumnsChange={setColumns} columnBase={base} rowSource={ds} ref={ref} />
      </div>
    </>
  );
}
