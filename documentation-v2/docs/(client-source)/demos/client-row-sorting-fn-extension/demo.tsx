//#start
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
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

export default function ColumnBase() {
  const [columns, setColumns] = useState(initialColumns);

  const sortFn = useMemo(() => {
    const columnWithSort = columns.find((x) => x.sort);
    if (!columnWithSort) return null;

    const sort: Grid.T.SortFn<GridSpec["data"]> = (left, right) => {
      const leftData = left.data as DEXPerformanceData;
      const rightData = right.data as DEXPerformanceData;

      let leftValue = leftData[columnWithSort.id as keyof DEXPerformanceData];
      let rightValue = rightData[columnWithSort.id as keyof DEXPerformanceData];

      if (typeof leftValue === "string") leftValue = leftValue.toLowerCase();
      if (typeof rightValue === "string") rightValue = rightValue.toLowerCase();

      const dirChanger = columnWithSort.sort === "asc" ? -1 : 1;

      if (leftValue < rightValue) return -1 * dirChanger;
      if (leftValue > rightValue) return 1 * dirChanger;
      return 0;
    };

    return sort;
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

  const ds = useClientDataSource<GridSpec>({ data, sort: sortFn }); //!

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
              keyDown: ({ column, event: ev }) => {
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
