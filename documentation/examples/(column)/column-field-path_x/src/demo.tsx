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
  { id: "Jan", field: { kind: "path", path: "temps.Jan" } },
  { id: "Feb", field: { kind: "path", path: "temps.Feb" } },
  { id: "Mar", field: { kind: "path", path: "temps.Mar" } },
  { id: "Apr", field: { kind: "path", path: "temps.Apr" } },
  { id: "May", field: { kind: "path", path: "temps.May" } },
  { id: "Jun", field: { kind: "path", path: "temps.Jun" } },
  { id: "Jul", field: { kind: "path", path: "temps.Jul" } },
  { id: "Aug", field: { kind: "path", path: "temps.Aug" } },
  { id: "Sep", field: { kind: "path", path: "temps.Sep" } },
  { id: "Oct", field: { kind: "path", path: "temps.Oct" } },
  { id: "Nov", field: { kind: "path", path: "temps.Nov" } },
  { id: "Dec", field: { kind: "path", path: "temps.Dec" } },
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
                          className="border-x-0! data-[ln-cell=true]:border-b-0! flex h-full w-full items-center justify-center text-sm"
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
