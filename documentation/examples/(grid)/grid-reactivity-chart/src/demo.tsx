"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import type { Column, Grid as GridType } from "@1771technologies/lytenyte-pro/types";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useId, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

type RowData = (typeof companiesWithPricePerf)[number];

const columns: Column<RowData>[] = [
  { id: "Company" },
  { id: "Founded" },
  { id: "Employee Cnt" },
  { id: "Country" },
  { id: "Price" },
];

export default function GridReactivityChart() {
  const ds = useClientRowDataSource({ data: companiesWithPricePerf });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowSelectedIds: new Set(["0"]),
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
  });

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
                          className="flex h-full w-full items-center px-2 capitalize"
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
      <div style={{ borderTop: "1px solid gray" }} className="pr-10 pt-2">
        {" "}
        <PriceChart grid={grid} />
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
    <ResponsiveContainer height={300} width="100%">
      <AreaChart data={data}>
        <defs>
          {rows.map((row, i) => {
            const color = colors[i];

            return (
              <linearGradient key={row.id} id={row.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color.stop5} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color.stop95} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <XAxis dataKey="week" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        {rows.map((row, i) => {
          const color = colors[i];

          return (
            <Area
              type="monotone"
              key={row.id}
              dataKey={row.id}
              stroke={color.solid}
              fillOpacity={1}
              fill={`url(#${row.id})`}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
const colors = [
  { name: "Ruby Red", solid: "#E02D3F", stop5: "#FBE6E8", stop95: "#E33E4F" },
  { name: "Coral", solid: "#FF7F50", stop5: "#FFEFE9", stop95: "#FF8C61" },
  { name: "Amber", solid: "#FFBF00", stop5: "#FFF7E0", stop95: "#FFC519" },
  {
    name: "Golden Yellow",
    solid: "#FFD700",
    stop5: "#FFFAE0",
    stop95: "#FFDB19",
  },
  { name: "Lime Green", solid: "#32CD32", stop5: "#E7F9E7", stop95: "#47D247" },
  { name: "Emerald", solid: "#50C878", stop5: "#EAF8EF", stop95: "#62CE86" },
  { name: "Teal", solid: "#008080", stop5: "#E0F0F0", stop95: "#199999" },
  { name: "Sky Blue", solid: "#87CEEB", stop5: "#F1F9FD", stop95: "#93D4ED" },
  { name: "Royal Blue", solid: "#4169E1", stop5: "#E8EDFC", stop95: "#5479E4" },
  { name: "Indigo", solid: "#4B0082", stop5: "#E9E0F0", stop95: "#5C1993" },
  { name: "Purple", solid: "#800080", stop5: "#F0E0F0", stop95: "#911991" },
  { name: "Magenta", solid: "#FF00FF", stop5: "#FFE0FF", stop95: "#FF19FF" },
  { name: "Hot Pink", solid: "#FF69B4", stop5: "#FFEDF6", stop95: "#FF78BB" },
  { name: "Chocolate", solid: "#D2691E", stop5: "#F9EEE4", stop95: "#D77935" },
  { name: "Sienna", solid: "#A0522D", stop5: "#F3EAE6", stop95: "#AC6542" },
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
  { name: "Violet", solid: "#8A2BE2", stop5: "#F1E6FB", stop95: "#9641E5" },
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
  { name: "Steel Blue", solid: "#4682B4", stop5: "#E9EFF6", stop95: "#588FBB" },
  { name: "Khaki", solid: "#C3B091", stop5: "#F7F5F1", stop95: "#C9B99D" },
  { name: "Plum", solid: "#8E4585", stop5: "#F1E9F0", stop95: "#9B5892" },
];
