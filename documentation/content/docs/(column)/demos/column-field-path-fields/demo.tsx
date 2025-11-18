"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { performance } from "@1771technologies/grid-sample-data/performance";
import { useId } from "react";

type PerformanceData = (typeof performance)[number];

const columns: Column<PerformanceData>[] = [
  { id: "name" },
  { id: "q1", field: { kind: "path", path: "performance.q1" } },
  { id: "q2", field: { kind: "path", path: "performance.q2" } },
  { id: "q3", field: { kind: "path", path: "performance.q3" } },
  { id: "q4", field: { kind: "path", path: "performance.q4" } },
  { id: "q1 revenue", field: { kind: "path", path: "revenue[0]" } },
  { id: "q2 revenue", field: { kind: "path", path: "revenue[1]" } },
  { id: "q3 revenue", field: { kind: "path", path: "revenue[2]" } },
  { id: "q4 revenue", field: { kind: "path", path: "revenue[3]" } },
];

export default function ColumnFieldPath() {
  const ds = useClientRowDataSource({ data: performance });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
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
