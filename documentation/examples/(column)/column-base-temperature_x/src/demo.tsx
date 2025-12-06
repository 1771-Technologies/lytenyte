"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import type { MonthlyTemperature } from "@1771technologies/grid-sample-data/temperatures";
import { data } from "@1771technologies/grid-sample-data/temperatures";
import { HeatMapCell, tw, YearCell } from "./components";

const columns: Column<MonthlyTemperature>[] = [
  { id: "year", cellRenderer: YearCell, width: 100 },
  { id: "Jan" },
  { id: "Feb" },
  { id: "Mar" },
  { id: "Apr" },
  { id: "May" },
  { id: "Jun" },
  { id: "Jul" },
  { id: "Aug" },
  { id: "Sep" },
  { id: "Oct" },
  { id: "Nov" },
  { id: "Dec" },
];

export default function ColumnBase() {
  const ds = useClientRowDataSource({ data: data });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      widthMin: 30,
      width: 50,
      widthFlex: 1,
      cellRenderer: HeatMapCell,
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
                        className={tw(
                          "flex h-full w-full items-center justify-center text-nowrap text-sm capitalize",
                          c.column.type === "number" && "justify-end",
                        )}
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
                  <Grid.Row row={row} key={row.id} className="group">
                    {row.cells.map((c) => {
                      return (
                        <Grid.Cell
                          key={c.id}
                          cell={c}
                          className="flex h-full w-full items-center justify-center text-sm"
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
