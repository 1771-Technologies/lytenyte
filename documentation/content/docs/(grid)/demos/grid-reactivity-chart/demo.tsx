"use client";

import "@1771technologies/lytenyte-pro/grid.css";
import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import type { Column, Grid as GridType } from "@1771technologies/lytenyte-pro/types";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useEffect, useId, useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { MarkerCell, MarkerHeader, NumberCell, PriceCell } from "./components";

type RowData = (typeof companiesWithPricePerf)[number];

const columns: Column<RowData>[] = [
  { id: "Company", widthFlex: 2 },
  { id: "Country", widthFlex: 2 },
  { id: "Founded", type: "number" },
  { id: "Employee Cnt", name: "Employees", type: "number", cellRenderer: NumberCell },
  { id: "Price", type: "number", cellRenderer: PriceCell },
];

export default function GridReactivityChart() {
  const ds = useClientRowDataSource({ data: companiesWithPricePerf.slice(0, 9) });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100, widthFlex: 1 },
    rowHeight: "fill:24",

    columnMarker: {
      cellRenderer: MarkerCell,
      headerRenderer: MarkerHeader,
    },
    columnMarkerEnabled: true,

    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
  });

  useEffect(() => {
    // Row data source may not be immediately ready since we rendering everything in one go.
    // Hence apply the state update in an effect.
    grid.state.rowSelectedIds.set(new Set(["2", "0", "4", "7"]));
  }, [grid.state.rowSelectedIds]);

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          className="flex h-full w-full items-center px-2 text-sm capitalize"
                          style={{
                            justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                          }}
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className="flex h-full w-full items-center px-2 text-sm"
                            style={{
                              justifyContent:
                                c.column.type === "number" ? "flex-end" : "flex-start",
                            }}
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
      <div className="p-2">
        <div className="h-[300px] w-full pr-10 pt-2">
          <PriceChart grid={grid} />
        </div>
      </div>
    </div>
  );
}

function PriceChart({ grid }: { grid: GridType<RowData> }) {
  const state = grid.state;
  const selected = state.rowSelectedIds.useValue();

  const rows = useMemo(() => {
    return [...selected.values()]
      .map((rowId) => grid.api.rowById(rowId))
      .filter((row) => !!row)
      .sort((l, r) => l.id.localeCompare(r.id));
  }, [grid.api, selected]);

  const data = useMemo(() => {
    const weeks: Record<string, { week: number; [key: string]: number }> = Object.fromEntries(
      Array.from({ length: 52 }, (_, i) => [i + 1, { week: i + 1 }]),
    );

    rows.forEach((row) => {
      if (!row?.data || !grid.api.rowIsLeaf(row)) return;

      const data = row.data["1 Year Perf"];

      data.forEach((dp, i) => {
        weeks[i + 1][row.id] = dp;
      });
    });

    return Object.values(weeks).sort((l, r) => l.week - r.week);
  }, [grid.api, rows]);

  return (
    <div className="px-4">
      <ResponsiveContainer height={300} width="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="week"
            ticks={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
            fontSize="14px"
            tickLine={false}
          />
          <YAxis fontFamily="Inter" fontSize="14px" tickLine={false} axisLine={false} />
          <CartesianGrid vertical={false} stroke="var(--lng1771-gray-10)" />
          {rows.map((row) => {
            const color = colors[row.id as unknown as number];

            return (
              <Line
                type="monotone"
                key={row.id}
                dataKey={row.id}
                stroke={color.solid}
                strokeWidth={2}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
const colors = [
  { name: "Royal Blue", solid: "#4169E1", stop5: "#E8EDFC", stop95: "#5479E4" },
  { name: "Teal", solid: "#008080", stop5: "#E0F0F0", stop95: "#199999" },
  { name: "Emerald", solid: "#50C878", stop5: "#EAF8EF", stop95: "#62CE86" },
  { name: "Magenta", solid: "#FF00FF", stop5: "#FFE0FF", stop95: "#FF19FF" },
  { name: "Amber", solid: "#FFBF00", stop5: "#FFF7E0", stop95: "#FFC519" },
  { name: "Sienna", solid: "#A0522D", stop5: "#F3EAE6", stop95: "#AC6542" },
  { name: "Lime Green", solid: "#32CD32", stop5: "#E7F9E7", stop95: "#47D247" },
  { name: "Violet", solid: "#8A2BE2", stop5: "#F1E6FB", stop95: "#9641E5" },
  { name: "Steel Blue", solid: "#4682B4", stop5: "#E9EFF6", stop95: "#588FBB" },

  { name: "Coral", solid: "#FF7F50", stop5: "#FFEFE9", stop95: "#FF8C61" },
  {
    name: "Golden Yellow",
    solid: "#FFD700",
    stop5: "#FFFAE0",
    stop95: "#FFDB19",
  },
  { name: "Emerald", solid: "#50C878", stop5: "#EAF8EF", stop95: "#62CE86" },
  { name: "Teal", solid: "#008080", stop5: "#E0F0F0", stop95: "#199999" },
  { name: "Sky Blue", solid: "#87CEEB", stop5: "#F1F9FD", stop95: "#93D4ED" },
  { name: "Purple", solid: "#800080", stop5: "#F0E0F0", stop95: "#911991" },
  { name: "Hot Pink", solid: "#FF69B4", stop5: "#FFEDF6", stop95: "#FF78BB" },
  { name: "Chocolate", solid: "#D2691E", stop5: "#F9EEE4", stop95: "#D77935" },
  { name: "Olive", solid: "#808000", stop5: "#F0F0E0", stop95: "#919119" },
  {
    name: "Forest Green",
    solid: "#228B22",
    stop5: "#E5F1E5",
    stop95: "#399939",
  },
  { name: "Navy Blue", solid: "#000080", stop5: "#E0E0F0", stop95: "#191999" },
  { name: "Slate Gray", solid: "#708090", stop5: "#EEF0F2", stop95: "#7F8C9A" },
  { name: "Charcoal", solid: "#36454F", stop5: "#E7E9EA", stop95: "#4B5962" },
  { name: "Crimson", solid: "#DC143C", stop5: "#FAE3E7", stop95: "#E02A4F" },
  { name: "Turquoise", solid: "#40E0D0", stop5: "#E8FBF9", stop95: "#53E3D4" },
  { name: "Salmon", solid: "#FA8072", stop5: "#FEEFED", stop95: "#FB8D80" },
  { name: "Tan", solid: "#D2B48C", stop5: "#F9F6F1", stop95: "#D7BD98" },
  { name: "Maroon", solid: "#800000", stop5: "#F0E0E0", stop95: "#991919" },
  { name: "Aquamarine", solid: "#7FFFD4", stop5: "#EFFFF9", stop95: "#8CFFD8" },
  { name: "Steel Blue", solid: "#4682B4", stop5: "#E9EFF6", stop95: "#588FBB" },
  { name: "Khaki", solid: "#C3B091", stop5: "#F7F5F1", stop95: "#C9B99D" },
  { name: "Plum", solid: "#8E4585", stop5: "#F1E9F0", stop95: "#9B5892" },

  { name: "Navy Blue", solid: "#000080", stop5: "#E0E0F0", stop95: "#191999" },
  { name: "Slate Gray", solid: "#708090", stop5: "#EEF0F2", stop95: "#7F8C9A" },
  { name: "Charcoal", solid: "#36454F", stop5: "#E7E9EA", stop95: "#4B5962" },
  { name: "Crimson", solid: "#DC143C", stop5: "#FAE3E7", stop95: "#E02A4F" },
  { name: "Turquoise", solid: "#40E0D0", stop5: "#E8FBF9", stop95: "#53E3D4" },
  { name: "Violet", solid: "#8A2BE2", stop5: "#F1E6FB", stop95: "#9641E5" },
  { name: "Salmon", solid: "#FA8072", stop5: "#FEEFED", stop95: "#FB8D80" },
  { name: "Tan", solid: "#D2B48C", stop5: "#F9F6F1", stop95: "#D7BD98" },
  { name: "Maroon", solid: "#800000", stop5: "#F0E0E0", stop95: "#991919" },
  { name: "Aquamarine", solid: "#7FFFD4", stop5: "#EFFFF9", stop95: "#8CFFD8" },
  { name: "Khaki", solid: "#C3B091", stop5: "#F7F5F1", stop95: "#C9B99D" },
  { name: "Plum", solid: "#8E4585", stop5: "#F1E9F0", stop95: "#9B5892" },
];
