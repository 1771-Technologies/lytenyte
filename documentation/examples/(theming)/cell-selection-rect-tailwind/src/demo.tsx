"use client";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";
import { BalanceCell, DurationCell, NumberCell } from "./components";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "job", width: 120 },
  { id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "balance", type: "number", cellRenderer: BalanceCell },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number", cellRenderer: NumberCell },
  { id: "month" },
  { id: "duration", type: "number", cellRenderer: DurationCell },
  { id: "poutcome" },
  { id: "y" },
];

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export default function CellSelectionRect() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100 },

    cellSelectionMode: "range",
    cellSelections: [{ rowStart: 4, rowEnd: 7, columnStart: 2, columnEnd: 4 }],
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
            <Grid.RowsContainer
              className={tw(
                '**:not-data-[ln-cell-selection-is-unit="true"]:data-[ln-cell-selection-rect]:bg-ln-primary-30 **:data-[ln-cell-selection-rect]:border-ln-primary-50',
                '**:not-data-[ln-cell-selection-is-unit="true"]:data-[ln-cell-selection-border-top=true]:border-t',
                '**:not-data-[ln-cell-selection-is-unit="true"]:data-[ln-cell-selection-border-bottom=true]:border-b',
                '**:not-data-[ln-cell-selection-is-unit="true"]:data-[ln-cell-selection-border-start=true]:border-l',
                '**:not-data-[ln-cell-selection-is-unit="true"]:data-[ln-cell-selection-border-end=true]:border-r',
                '**:data-[ln-cell-selection-is-unit="true"]:outline **:data-[ln-cell-selection-is-unit="true"]:outline-ln-primary-50 **:data-[ln-cell-selection-is-unit="true"]:-outline-offset-1',
              )}
            >
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
    </div>
  );
}
