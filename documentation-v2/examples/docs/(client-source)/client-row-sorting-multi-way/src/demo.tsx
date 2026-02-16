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
  { id: "network", cellRenderer: NetworkCell, width: 220, name: "Network", sort: "desc", sortIndex: 1 },
  { id: "exchange", cellRenderer: ExchangeCell, width: 220, name: "Exchange", sort: "asc", sortIndex: 2 },

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
  readonly column: { sort?: "asc" | "desc"; sortIndex?: number };
  readonly api: {
    sortColumn: (id: string, dir: "asc" | "desc" | null, additive?: boolean) => void;
  };
}

export default function ClientDemo() {
  const [columns, setColumns] = useState(initialColumns);

  const sortDimension = useMemo(() => {
    const sorts = columns.filter((x) => x.sort).sort((l, r) => (l.sortIndex ?? 0) - (r.sortIndex ?? 0));

    return sorts.map((columnWithSort) => {
      return {
        dim: {
          ...columnWithSort,
          field: (p) => {
            const value = computeField(columnWithSort.id ?? columnWithSort.field, p.row);
            if (typeof value === "string") return value.toLowerCase();
            return value;
          },
        },
        descending: columnWithSort.sort === "desc",
      } satisfies Grid.T.DimensionSort<GridSpec["data"]>;
    });
  }, [columns]);

  const apiExtension = useMemo<GridSpec["api"]>(() => {
    return {
      sortColumn: (id, dir, additive) => {
        setColumns((prev) => {
          const nextIndex = Math.max(0, ...prev.map((x) => x.sortIndex ?? 0));

          const updated = prev.map((x) => {
            let next = x;
            // Remove any existing sort when we are performing a non-additive sort.
            if (x.sort && x.id !== id && !additive) {
              next = { ...x };
              delete next.sort;
              delete next.sortIndex;
            } else if (x.id === id) {
              next = { ...x };
              if (dir == null) {
                delete next.sort;
                delete next.sortIndex;
              } else {
                // We are adding a new sort
                next.sort = dir;
                if (additive && next.sortIndex == null) {
                  next.sortIndex = nextIndex + 1;
                }
              }
            }

            return next;
          });

          // Ensures the sort index consistency
          const sortIndexEntries = updated
            .filter((x) => x.sort)
            .toSorted((l, r) => (l.sortIndex ?? 0) - (r.sortIndex ?? 0))
            .map((c, i) => [c.id, i + 1]);
          const newSortIndices = Object.fromEntries(sortIndexEntries);

          return updated.map((col) => {
            if (newSortIndices[col.id])
              return {
                ...col,
                // If we have only one sort there is no need for a sort index number.
                sortIndex: sortIndexEntries.length === 1 ? undefined : newSortIndices[col.id],
              };
            return col;
          });
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
              keyDown: ({ column, event: ev }) => {
                if (ev.key === "Enter") {
                  const nextSort = column.sort === "asc" ? null : column.sort === "desc" ? "asc" : "desc";
                  apiExtension.sortColumn(column.id, nextSort, ev.metaKey || ev.ctrlKey);
                }
              },
            },
          }}
        />
      </div>
    </>
  );
}
