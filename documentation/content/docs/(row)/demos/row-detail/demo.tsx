"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column, RowLeaf } from "@1771technologies/lytenyte-pro/types";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useId, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

type PerformanceData = (typeof companiesWithPricePerf)[number];

const columns: Column<PerformanceData>[] = [
  { id: "Company" },
  { id: "Founded" },
  { id: "Employee Cnt" },
  { id: "Country" },
  { id: "Price" },
];

export default function RowDetail() {
  const ds = useClientRowDataSource({
    data: companiesWithPricePerf,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowDetailExpansions: new Set(["0"]),
    rowDetailRenderer: (p) => {
      if (!grid.api.rowIsLeaf(p.row)) return;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            padding: "20px 20px 20px 0px",
          }}
        >
          <PriceChart row={p.row} />
        </div>
      );
    },
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ height: 500 }}>
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
  );
}

function PriceChart({ row }: { row: RowLeaf<PerformanceData> }) {
  const data = useMemo(() => {
    if (!row.data) return [];
    const weeks: Record<string, { week: number; [key: string]: number }> = Object.fromEntries(
      Array.from({ length: 52 }, (_, i) => [i + 1, { week: i + 1 }]),
    );

    const data = row.data["1 Year Perf"];

    data.forEach((dp, i) => {
      weeks[i + 1][row.id] = dp;
    });
    return Object.values(weeks).sort((l, r) => l.week - r.week);
  }, [row.data, row.id]);

  return (
    <ResponsiveContainer height="100%" width="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient key={row.id} id={row.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color.stop5} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color.stop95} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="week" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Area
          key={row.id}
          type="monotone"
          dataKey={row.id}
          stroke={color.solid}
          fillOpacity={1}
          fill={`url(#${row.id})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
const color = {
  name: "Ruby Red",
  solid: "#2de045",
  stop5: "#e6fbe6",
  stop95: "#3ee362",
};
