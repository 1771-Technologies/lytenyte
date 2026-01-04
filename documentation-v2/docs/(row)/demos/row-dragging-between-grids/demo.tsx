//#start
import "./demo.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import { Grid, moveRelative, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import {
  DragIcon,
  ExchangeCell,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
  tw,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data as initialData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
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
  const [primary, setPrimary] = useState(initialData);
  const [secondary, setSecondary] = useState<typeof initialData>([]);

  const ds = useClientDataSource<GridSpec>({ data: primary, leafIdFn });
  const dsOther = useClientDataSource<GridSpec>({ data: secondary, leafIdFn });

  const [entered, setEntered] = useState(false);

  return (
    <div className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight ln-cell-marker:px-0 flex flex-col gap-8">
      <div style={{ height: 250 }}>
        <Grid
          columns={columns}
          columnBase={base}
          rowSource={ds}
          columnMarker={marker}
          gridId="primary"
          rowDropAccept={useMemo(() => ["secondary"], [])}
          onRowDragEnter={(p) => {
            if (p.over.kind === "viewport") return;

            if (p.over.id === p.source.id && p.over.rowIndex === p.source.rowIndex) return;

            const isBefore = p.over.id !== p.source.id || p.over.rowIndex > p.source.rowIndex;

            if (isBefore) p.over.element.setAttribute("data-ln-drag-position", "after");
            else p.over.element.setAttribute("data-ln-drag-position", "before");
          }}
          onRowDragLeave={(p) => {
            if (p.over.kind === "viewport") return;
            p.over.element.removeAttribute("data-ln-drag-position");
          }}
          onRowDrop={(p) => {
            p.over.element.removeAttribute("data-ln-drag-position");
            if (p.over.id === p.source.id) {
              if (p.over.kind === "viewport") return;

              setPrimary((prev) => {
                if (p.over.kind === "viewport") return prev;
                const next = moveRelative(prev, p.source.rowIndex, p.over.rowIndex);
                return next;
              });
            } else {
              // Start by removing the row from the source
              const sourceIndex = primary.indexOf(p.source.row.data);
              setSecondary((prev) => {
                const next = [...prev];
                next.splice(sourceIndex, 1);
                return next;
              });

              setPrimary((prev) => {
                if (p.over.kind === "viewport") return [...prev, p.source.row.data];

                const next = [...prev];
                next.splice(p.over.rowIndex + 1, 0, p.source.row.data);
                return next;
              });
            }
          }}
        />
      </div>

      <div style={{ height: 250 }} className="border-ln-border border-t">
        <Grid
          gridId="secondary"
          columns={columns}
          columnBase={base}
          rowSource={dsOther}
          columnMarker={marker}
          rowDropAccept={useMemo(() => ["primary"], [])}
          slotRowsOverlay={
            secondary.length ? null : (
              <div className="sticky start-0 top-0 h-0 w-0">
                <div
                  className={tw(
                    "w-(--ln-vp-width) h-(--ln-vp-row-height) absolute left-0 top-0 flex items-center justify-center",

                    entered && "bg-ln-primary-10",
                  )}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <DragIcon className="size-12" />
                    Drag rows from the grid here.
                  </div>
                </div>
              </div>
            )
          }
          onRowDragEnter={(p) => {
            if (!secondary.length && p.over.kind === "viewport") {
              setEntered(true);
              return;
            }
            if (p.over.kind === "viewport") return;

            if (p.over.id === p.source.id && p.over.rowIndex === p.source.rowIndex) return;

            const isBefore = p.over.id !== p.source.id || p.over.rowIndex > p.source.rowIndex;

            if (isBefore) p.over.element.setAttribute("data-ln-drag-position", "after");
            else p.over.element.setAttribute("data-ln-drag-position", "before");
          }}
          onRowDragLeave={(p) => {
            setEntered(false);
            if (p.over.kind === "viewport") return;
            p.over.element.removeAttribute("data-ln-drag-position");
          }}
          onRowDrop={(p) => {
            setEntered(false);
            p.over.element.removeAttribute("data-ln-drag-position");

            if (p.over.id === p.source.id) {
              if (p.over.kind === "viewport") return;

              setSecondary((prev) => {
                if (p.over.kind === "viewport") return prev;
                const next = moveRelative(prev, p.source.rowIndex, p.over.rowIndex);
                return next;
              });
            } else {
              // Start by removing the row from the source
              const sourceIndex = primary.indexOf(p.source.row.data);
              setPrimary((prev) => {
                const next = [...prev];
                next.splice(sourceIndex, 1);
                return next;
              });

              setSecondary((prev) => {
                if (p.over.kind === "viewport") return [...prev, p.source.row.data];

                const next = [...prev];
                next.splice(p.over.rowIndex + 1, 0, p.source.row.data);
                return next;
              });
            }
          }}
        />
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
