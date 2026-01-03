//#start
import "./demo.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import { Grid, moveRelative, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import {
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data as initialData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
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

const marker: Grid.ColumnMarker<GridSpec> = { on: true, cellRenderer: MarkerCell };

export default function RowSelection() {
  const [data, setData] = useState(initialData);

  const ds = useClientDataSource({ data });

  return (
    <div
      className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight ln-cell-marker:px-0"
      style={{ height: 500 }}
    >
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        columnMarker={marker}
        onRowDragEnter={(p) => {
          if (p.over.kind === "viewport") return;

          const overIndex = p.over.rowIndex;
          const dragIndex = p.source.rowIndex;

          if (overIndex === dragIndex) return;

          if (overIndex < dragIndex) p.over.element.setAttribute("data-ln-drag-position", "before");
          else p.over.element.setAttribute("data-ln-drag-position", "after");
        }}
        onRowDragLeave={(p) => {
          if (p.over.kind === "viewport") return;
          p.over.element.removeAttribute("data-ln-drag-position");
        }}
        onRowDrop={(p) => {
          if (p.over.kind === "viewport") return;
          p.over.element.removeAttribute("data-ln-drag-position");

          setData((prev) => {
            if (p.over.kind === "viewport") return prev;

            const next = moveRelative(prev, p.source.rowIndex, p.over.rowIndex);

            return next;
          });
        }}
      />
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
