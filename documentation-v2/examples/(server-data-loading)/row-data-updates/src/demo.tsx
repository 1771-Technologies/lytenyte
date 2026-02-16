"use client";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { useEffect, useMemo } from "react";
import { Server } from "./server.js";
import type { DataEntry } from "./data";
import { HeaderCell, NumberCell } from "./components.js";
import { Grid, RowGroupCell, useServerDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { logos } from "@1771technologies/grid-sample-data/stock-data-smaller";

export interface GridSpec {
  readonly data: DataEntry;
  readonly column: { agg?: string };
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "bid",
    name: "Bid",
    type: "number",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "avg",
  },
  {
    id: "ask",
    name: "Ask",
    type: "number",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "avg",
  },
  {
    id: "spread",
    name: "Spread",
    type: "number",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "avg",
  },

  {
    id: "volatility",
    name: "Volatility",
    type: "number",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "first",
  },
  {
    id: "latency",
    name: "Latency",
    type: "number",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "first",
  },
  {
    id: "symbol",
    name: "Symbol",
    hide: true,
    type: "number",
    agg: "first",
  },
];

const base: Grid.ColumnBase<GridSpec> = { headerRenderer: HeaderCell };
const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: (p) => {
    return (
      <RowGroupCell
        {...p}
        groupLabel={(row) => {
          const symbol = row.key;

          return (
            <div className="flex h-full w-full items-center gap-2 overflow-hidden text-nowrap">
              <div className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-full">
                <img
                  src={logos[symbol!]}
                  alt={`Logo of ${symbol}`}
                  className="h-6.5 min-h-6.5 w-6.5 min-w-[26] rounded-full bg-black p-1"
                />
              </div>
              <div className="symbol-cell min-w-15 flex items-center justify-center rounded-2xl bg-teal-600/20 px-1 py-0.5 text-xs">
                {symbol}
              </div>
            </div>
          );
        }}
      />
    );
  },
  pin: "start",
  width: 170,
};

export default function ServerDataDemo() {
  const ds = useServerDataSource<DataEntry>({
    queryFn: async (params) => {
      return await Server(params.requests, ["symbol"], {
        time: { fn: "first" },
        volume: { fn: "group" },
        bid: { fn: "avg" },
        ask: { fn: "avg" },
        spread: { fn: "avg" },
        volatility: { fn: "first" },
        latency: { fn: "first" },
        pnl: { fn: "first" },
        symbol: { fn: "first" },
      });
    },
    hasRowBranches: true,
    queryKey: [],
    blockSize: 50,
  });

  useEffect(() => {
    const i = setInterval(() => {
      ds.refresh();
    }, 1000);

    return () => clearInterval(i);
  }, [ds]);

  const isLoading = ds.isLoading.useValue();

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          rowSource={ds}
          columns={columns}
          columnBase={base}
          rowGroupColumn={group}
          styles={useMemo(() => {
            return { viewport: { style: { scrollbarGutter: "stable" } } };
          }, [])}
          slotViewportOverlay={
            isLoading && (
              <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
            )
          }
        />
      </div>
    </>
  );
}
