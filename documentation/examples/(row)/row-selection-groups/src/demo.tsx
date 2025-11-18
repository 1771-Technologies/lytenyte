"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
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

export default function RowSelectionGroups() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowGroupModel: ["job", "education"],
    rowSelectionMode: "multiple",
    rowSelectChildren: true,
    rowSelectedIds: new Set(["root:services"]),

    rowGroupColumn: {
      cellRenderer: ({ grid, row, column }) => {
        if (!grid.api.rowIsGroup(row)) return null;

        const field = grid.api.columnField(column, row);
        const isExpanded = grid.api.rowGroupIsExpanded(row);

        return (
          <div
            className="flex h-full w-full items-center gap-2"
            style={{ paddingLeft: row.depth * 16 }}
          >
            <button
              className="flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                grid.api.rowGroupToggle(row);
              }}
            >
              {!isExpanded && <ChevronRightIcon />}
              {isExpanded && <ChevronDownIcon />}
            </button>

            <div>{`${field}`}</div>
          </div>
        );
      },
    },

    rowGroupExpansions: {
      "root:services": true,
      "root:services/secondary": true,
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
