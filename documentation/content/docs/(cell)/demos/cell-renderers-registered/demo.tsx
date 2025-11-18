"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { CellRendererParams, Column } from "@1771technologies/lytenyte-pro/types";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useId } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

type PerformanceData = (typeof companiesWithPricePerf)[number];

const columns: Column<PerformanceData>[] = [
  { id: "Company" },
  { id: "Founded" },
  { id: "Employee Cnt" },
  {
    id: "1 Year Perf",
    cellRenderer: "line-renderer",
  },
  {
    id: "Price",
    cellRenderer: "dollar-renderer",
  },
];

export default function CellRenderersRegistered() {
  const ds = useClientRowDataSource({
    data: companiesWithPricePerf,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    cellRenderers: {
      "line-renderer": SparklineRenderer,
      "dollar-renderer": DollarRenderer,
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

function DollarRenderer(p: CellRendererParams<PerformanceData>) {
  const field = p.grid.api.columnField(p.column, p.row) as string;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        paddingInline: 8,
        boxSizing: "border-box",
        fontFamily: "monospace",
      }}
    >
      ${field}
    </div>
  );
}

function SparklineRenderer(p: CellRendererParams<PerformanceData>) {
  const field = p.grid.api.columnField(p.column, p.row) as number[];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: 4,
      }}
    >
      <Sparklines data={field}>
        <SparklinesLine color="blue" />
      </Sparklines>
    </div>
  );
}
