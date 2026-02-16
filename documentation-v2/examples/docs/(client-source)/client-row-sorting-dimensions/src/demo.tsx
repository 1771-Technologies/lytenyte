//#start
import { computeField, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  ExchangeCell,
  Header,
  makePerfHeaderCell,
  NetworkCell,
  PercentCell,
  PercentCellPositiveNegative,
  SymbolCell,
} from "./components.jsx";
import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { data } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { useMemo, useState } from "react";

const initialColumns: Grid.Column<GridSpec>[] = [
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
  { id: "volatility", cellRenderer: PercentCell, name: "Volatility", type: "number", width: 110 },
  {
    id: "volatility1m",
    cellRenderer: PercentCell,
    headerRenderer: makePerfHeaderCell("Volatility", "1m"),
    name: "Volatility 1M",
    type: "number",
  },
];

const base: Grid.ColumnBase<GridSpec> = { width: 90, headerRenderer: Header };
//#end

export interface GridSpec {
  readonly data: DEXPerformanceData;
  readonly column: { sort?: "asc" | "desc" };
  readonly api: {
    sortColumn: (id: string, dir: "asc" | "desc" | null) => void;
  };
}

export default function ClientDemo() {
  const [columns, setColumns] = useState(initialColumns);

  const sortDimension = useMemo(() => {
    const columnWithSort = columns.find((x) => x.sort);
    if (!columnWithSort) return null;

    return [
      {
        dim: {
          ...columnWithSort,
          field: (p) => {
            const value = computeField(columnWithSort.id ?? columnWithSort.field, p.row);
            if (typeof value === "string") return value.toLowerCase();
            return value;
          },
        },
        descending: columnWithSort.sort === "desc",
      },
    ] satisfies Grid.T.DimensionSort<GridSpec["data"]>[];
  }, [columns]);

  const apiExtension = useMemo<GridSpec["api"]>(() => {
    return {
      sortColumn: (id, dir) => {
        setColumns((prev) => {
          const next = prev.map((x) => {
            // Remove any existing sort
            if (x.sort && x.id !== id) {
              const next = { ...x };
              delete next.sort;
              return next;
            }
            // Apply our new sort
            if (x.id === id) {
              const next = { ...x };
              if (dir == null) delete next.sort;
              else next.sort = dir;

              return next;
            }
            return x;
          });
          return next;
        });
      },
    };
  }, []);

  const ds = useClientDataSource<GridSpec>({ data, sort: sortDimension }); //!

  return (
    <>
      <div
        className="ln-grid ln-cell:text-xs ln-header:text-xs ln-header:text-ln-text-xlight"
        style={{ height: 500 }}
      >
        <Grid
          apiExtension={apiExtension}
          columns={columns}
          columnBase={base}
          rowSource={ds}
          events={{
            headerCell: {
              keyDown: ({ event: ev, column }) => {
                if (ev.key === "Enter") {
                  const nextSort = column.sort === "asc" ? null : column.sort === "desc" ? "asc" : "desc";
                  apiExtension.sortColumn(column.id, nextSort);
                }
              },
            },
          }}
        />
      </div>
    </>
  );
}
