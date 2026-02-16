import { Grid, Popover, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental"; //!
import "@1771technologies/lytenyte-pro-experimental/components.css";

//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data, networks } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: DEXPerformanceData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "symbol", cellRenderer: SymbolCell, width: 250, name: "Symbol" },
  { id: "network", cellRenderer: NetworkCell, width: 220, name: "Network", hide: true },
  { id: "exchange", cellRenderer: ExchangeCell, width: 220, name: "Exchange", hide: true },

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
export default function CellDemo() {
  const [network, setNetwork] = useState<string | null>(null); //!
  const [anchor, setAnchor] = useState<HTMLElement | null>(null); //!
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
        events={useMemo<Grid.Events<GridSpec>>(() => {
          return {
            cell: {
              focus: ({ column, event, row, api }) => {
                if (column.id !== "symbol" || !api.rowIsLeaf(row)) return;

                setNetwork(row.data.network);
                setAnchor(event.target);
              },
              blur: () => {
                setNetwork(null);
                setAnchor(null);
              },
            },
          };
        }, [])}
      />
      <Popover
        anchor={anchor}
        open={!!network}
        modal={false}
        focusTrap={false}
        hide
        placement="top"
        sideOffset={2}
      >
        {network && (
          <Popover.Container className="bg-ln-bg-popover border-ln-border-xstrong grid grid-cols-[auto_20px_1fr] items-center gap-1.5 rounded-lg border p-2 text-xs">
            <div className="font-bold">Network:</div>

            <div>
              <img
                src={networks[network]}
                alt={`Logo for network ${network}`}
                className="h-full w-full overflow-hidden rounded-full"
              />
            </div>
            <div className="w-full overflow-hidden text-ellipsis">{network}</div>
          </Popover.Container>
        )}
      </Popover>
    </div>
  );
}
