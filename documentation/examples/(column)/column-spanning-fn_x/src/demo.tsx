"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { CellSpanFnParams, Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import type { MonthlyTemperature } from "@1771technologies/grid-sample-data/temperatures";
import { data } from "@1771technologies/grid-sample-data/temperatures";
import { HeatMapCell, tw, YearCell } from "./components";

const ordering: (keyof MonthlyTemperature["temps"])[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function joinSimilarTemps(x: CellSpanFnParams<MonthlyTemperature>) {
  if (x.row.kind !== "leaf" || !x.row.data) return 1;
  const temps = x.row.data.temps;
  const myOrder = ordering[x.colIndex - 1];
  const value = temps[myOrder];

  let count = 1;
  let i = x.colIndex; // index is already offset by 1 due to the year column
  while (true) {
    const next = ordering[i];

    if (!next) break;

    const nextValue = temps[next];
    if (myOrder === "Jul") console.log(next);
    if (Math.abs(nextValue - value) < 3) {
      count++;
      i++;
    } else {
      break;
    }
  }

  return count;
}

const columns: Column<MonthlyTemperature>[] = [
  { id: "year", cellRenderer: YearCell, width: 100 },
  { id: "Jan", colSpan: joinSimilarTemps },
  { id: "Feb", colSpan: joinSimilarTemps },
  { id: "Mar", colSpan: joinSimilarTemps },
  { id: "Apr", colSpan: joinSimilarTemps },
  { id: "May", colSpan: joinSimilarTemps },
  { id: "Jun", colSpan: joinSimilarTemps },
  { id: "Jul", colSpan: joinSimilarTemps },
  { id: "Aug", colSpan: joinSimilarTemps },
  { id: "Sep", colSpan: joinSimilarTemps },
  { id: "Oct", colSpan: joinSimilarTemps },
  { id: "Nov", colSpan: joinSimilarTemps },
  { id: "Dec", colSpan: joinSimilarTemps },
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
