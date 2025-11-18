"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import type { Column, RowLeaf } from "@1771technologies/lytenyte-pro/types";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useId, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import styled from "@emotion/styled";
import { NumberCell, PriceCell } from "./components";

type PerformanceData = (typeof companiesWithPricePerf)[number];

const columns: Column<PerformanceData>[] = [
  { id: "Company", widthFlex: 2 },
  { id: "Country", widthFlex: 2 },
  { id: "Founded", type: "number" },
  { id: "Employee Cnt", type: "number", cellRenderer: NumberCell },
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
                      <HeaderCell
                        key={c.id}
                        cell={c}
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
          <RowsContainer>
            <Grid.RowsCenter>
              {view.rows.center.map((row) => {
                if (row.kind === "full-width") return null;

                return (
                  <Row row={row} key={row.id}>
                    {row.cells.map((c) => {
                      return (
                        <Cell
                          key={c.id}
                          cell={c}
                          className="cell"
                          style={{
                            justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                          }}
                        />
                      );
                    })}
                  </Row>
                );
              })}
            </Grid.RowsCenter>
          </RowsContainer>
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

const RowsContainer = styled(Grid.RowsContainer)`
  & [data-ln-row-detail="true"] {
    padding: 24px;
  }

  & [data-ln-row-detail="true"] > div {
    border: 1px solid var(--lng1771-gray-30);
    border-radius: 8px;
    background-color: light-dark(white, transparent);
  }
`;

const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(white, hsla(190, 32%, 6%, 1));
  color: light-dark(hsla(175, 6%, 38%, 1), hsla(175, 10%, 86%, 1));
  font-size: 14px;
  border-bottom: 1px solid light-dark(hsla(175, 20%, 95%, 1), hsla(177, 19%, 17%, 1));
`;

const HeaderCell = styled(Grid.HeaderCell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(hsla(175, 12%, 92%, 1), hsla(177, 19%, 17%, 1));
  color: light-dark(hsla(177, 19%, 17%, 1), hsla(175, 12%, 92%, 1));
  text-transform: capitalize;
  font-size: 14px;
`;

const Row = styled(Grid.Row)`
  &[data-ln-alternate="true"] .cell {
    background-color: light-dark(hsl(0, 27%, 98%), hsl(184, 33%, 8%));
  }
`;
