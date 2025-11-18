"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import type { Column, RowLeaf } from "@1771technologies/lytenyte-pro/types";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useId, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { NumberCell, PriceCell } from "./components";

type PerformanceData = (typeof companiesWithPricePerf)[number];

const columns: Column<PerformanceData>[] = [
  { id: "Company", widthFlex: 2 },
  { id: "Country", widthFlex: 2 },
  { id: "Founded", type: "number" },
  { id: "Employee Cnt", name: "Employees", type: "number", cellRenderer: NumberCell },
  { id: "Price", type: "number", cellRenderer: PriceCell },
];

export default function RowDetail() {
  const ds = useClientRowDataSource({
    data: companiesWithPricePerf,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100, widthFlex: 1 },

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
                        className={
                          "flex items-center bg-gray-300 px-2 text-sm capitalize text-gray-900 dark:bg-gray-100 dark:text-gray-700" +
                          (c.column.type === "number" ? " justify-end" : "")
                        }
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
                  <Grid.Row
                    row={row}
                    key={row.id}
                    className='[&_[data-ln-row-detail="true"]>div]:border-ln-gray-30 group [&_[data-ln-row-detail="true"]>div]:rounded-lg [&_[data-ln-row-detail="true"]>div]:border [&_[data-ln-row-detail="true"]]:p-7'
                  >
                    {row.cells.map((c) => {
                      return (
                        <Grid.Cell
                          key={c.id}
                          cell={c}
                          className={
                            "flex items-center border-b border-gray-200 bg-white px-2 text-sm text-gray-800 group-data-[ln-alternate=true]:bg-gray-100 dark:border-gray-100 dark:bg-gray-50 dark:text-gray-600 dark:group-data-[ln-alternate=true]:bg-gray-100/30" +
                            (c.column.type === "number" ? " justify-end" : "")
                          }
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
        <XAxis
          dataKey="week"
          ticks={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
          fontSize="14px"
          tickLine={false}
        />
        <YAxis fontFamily="Inter" fontSize="14px" tickLine={false} axisLine={false} />
        <CartesianGrid vertical={false} stroke="var(--lng1771-gray-10)" />

        <Area
          key={row.id}
          type="monotone"
          dataKey={row.id}
          stroke={color.solid}
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#${row.id})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
const color = {
  name: "Ruby Red",
  solid: "#CC5500",
  stop5: "#CC5500",
  stop95: "transparent",
};
