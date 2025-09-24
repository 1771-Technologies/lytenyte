"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number", groupPath: ["One Group"] },
  { id: "job", groupPath: ["One Group"], groupVisibility: "close" },
  { id: "balance", type: "number", groupPath: ["One Group"] },
  { id: "education", hide: true },
  { id: "marital" },
];

export default function ColumnVisibilityWithGroups() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      widthFlex: 1,
    },
  });

  const view = grid.view.useValue();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex gap-2 py-2">
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white dark:text-black"
          onClick={() =>
            grid.api.columnUpdate({
              education: { hide: false },
              marital: { hide: false },
            })
          }
        >
          Show Education
        </button>
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white dark:text-black"
          onClick={() =>
            grid.api.columnUpdate(Object.fromEntries(columns.map((c) => [c.id, { hide: true }])))
          }
        >
          Hide All
        </button>
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white dark:text-black"
          onClick={() => grid.state.columns.set(columns)}
        >
          Reset
        </button>
      </div>
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group")
                        return (
                          <Grid.HeaderGroupCell
                            cell={c}
                            key={c.idOccurrence}
                            className="group flex items-center"
                          >
                            <div>{c.groupPath.at(-1)}</div>
                            <button
                              className="text-ln-gray-90 flex items-center justify-center"
                              onClick={() => grid.api.columnToggleGroup(c.id)}
                            >
                              <ChevronLeftIcon className="hidden group-data-[ln-collapsed=false]:block" />
                              <ChevronRightIcon className="block group-data-[ln-collapsed=false]:hidden" />
                            </button>
                          </Grid.HeaderGroupCell>
                        );

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
    </div>
  );
}
