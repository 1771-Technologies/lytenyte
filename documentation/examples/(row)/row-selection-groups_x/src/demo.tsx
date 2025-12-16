"use client";
import "./main.css";
import "@1771technologies/lytenyte-pro/grid.css";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";
import { tw } from "./ui";
import { BalanceCell, DurationCell, MarkerCell, MarkerHeader, NumberCell } from "./components";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "job", width: 120, hide: true },
  { id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "balance", type: "number", cellRenderer: BalanceCell },
  { id: "education", hide: true },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number", cellRenderer: NumberCell },
  { id: "month" },
  { id: "duration", type: "number", cellRenderer: DurationCell },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function GridTheming() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    rowGroupModel: ["job", "education"],
    columns,
    columnBase: { width: 100 },
    rowGroupExpansions: {
      "+.+Unemployed": true,
      "+.+Unemployed/Primary": true,
    },
    rowSelectedIds: new Set(["+.+Unemployed/Primary", "0", "99", "108"]),
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
    rowSelectChildren: true,

    columnMarkerEnabled: true,
    columnMarker: {
      cellRenderer: MarkerCell,
      headerRenderer: MarkerHeader,
    },

    rowGroupColumn: {
      width: 200,
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
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ display: "flex", flexDirection: "column" }}>
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
                            "flex items-center px-2 text-sm capitalize",
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
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className={tw(
                              "flex items-center px-2 text-sm",
                              c.column.type === "number" && "justify-end tabular-nums",
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
