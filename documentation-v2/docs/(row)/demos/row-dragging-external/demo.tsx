//#start
import "./demo.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import { getRowDragData, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import {
  DragIcon,
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
  SymbolLabel,
  tw,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";

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

const marker: Grid.ColumnMarker<GridSpec> = { on: true, cellRenderer: MarkerCell };

const leafIdFn: Grid.T.LeafIdFn<GridSpec["data"]> = (d) =>
  `${d.symbolTicker}-${d.exchange}-${d.network}-${d.symbol}`;

export default function RowSelection() {
  const ds = useClientDataSource<GridSpec>({ data: data, leafIdFn });

  const [over, setOver] = useState(false);

  const [external, setData] = useState<GridSpec["data"][]>([]);

  return (
    <div className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight ln-cell-marker:px-0 ln-cell-marker:border-e ln-cell-marker:border-ln-border flex flex-col gap-8">
      <div style={{ height: 250 }}>
        <Grid
          columns={columns}
          columnBase={base}
          rowSource={ds}
          columnMarker={marker}
          gridId="primary"
          rowDropAccept={useMemo(() => ["secondary"], [])}
        />
      </div>

      <div
        style={{ height: 250 }}
        className={tw("border-ln-border overflow-auto border-t", over && "bg-ln-primary-10")}
        onDragLeave={() => setOver(false)}
        onDragOver={() => setOver(true)}
        //!next 6
        onDrop={() => {
          setOver(false);
          const row = getRowDragData();

          setData((prev) => [...prev, row.row.data]);
        }}
      >
        {!external.length && (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <DragIcon className="size-12" />
            Drag rows from the grid here.
          </div>
        )}
        {external.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 py-2 font-mono">
            {external.map((x, i) => {
              return (
                <div className="bg-ln-bg-strong rounded px-2 py-2" key={i}>
                  <SymbolLabel data={x} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MarkerCell({ api, rowIndex }: Grid.T.CellRendererParams<GridSpec>) {
  const { props } = api.useRowDrag({ rowIndex });

  return (
    <div className="flex h-full w-full cursor-grab items-center justify-center" {...props}>
      <DragHandleDots2Icon />
    </div>
  );
}
