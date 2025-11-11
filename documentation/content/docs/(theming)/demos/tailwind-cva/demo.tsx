"use client";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { cva } from "class-variance-authority";
import { useId } from "react";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "job", width: 120 },
  { id: "age", type: "number", width: 80 },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function GridTheming() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100 },
  });

  const view = grid.view.useValue();

  return (
    <div>
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
                          className={tw(
                            cellStyles({ number: c.column.type === "number", header: true }),
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
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className={tw(
                              cellStyles({
                                number: c.column.type === "number",
                                row: c.rowIndex % 2 ? "even" : "odd",
                              }),
                            )}
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
    </div>
  );
}

const cellStyles = cva("flex items-center bg-gray-50 px-2 text-sm text-gray-800", {
  variants: {
    number: {
      true: "justify-end tabular-nums",
    },
    row: {
      odd: "bg-slate-50 dark:bg-slate-950",
      even: "bg-slate-100 dark:bg-slate-900",
    },
    header: {
      true: "capitalize bg-gray-100 text-gray-700",
    },
  },
});
