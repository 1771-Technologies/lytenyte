"use client";

import {
  Grid,
  GROUP_COLUMN_SINGLE_ID,
  useClientRowDataSource,
} from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
];

export default function ColumnPivotingRowGroups() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowGroupColumn: {
      cellRenderer: ({ grid, row, column }) => {
        if (!grid.api.rowIsGroup(row)) return null;

        const field = grid.api.columnField(column, row);
        const isExpanded = grid.api.rowGroupIsExpanded(row);

        const canBeExpanded = row.depth + 1 < grid.state.columnPivotModel.get().rows.length;

        return (
          <div
            className="flex h-full w-full items-center gap-2"
            style={{ paddingLeft: row.depth * 16 + (!canBeExpanded ? 20 : 0) }}
          >
            {canBeExpanded && (
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
            )}

            <div>{`${field}`}</div>
          </div>
        );
      },
    },

    columnPivotMode: true,
    columnPivotModel: {
      columns: [{ field: "job" }],
      rows: [{ field: "education" }, { field: "marital" }],
      sorts: [],
      values: [{ field: "balance", aggFn: "sum" }],
      filters: {},
      filtersIn: {},
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
                    if (c.kind === "group") {
                      return (
                        <Grid.HeaderGroupCell
                          key={c.idOccurrence}
                          cell={c}
                          className="flex items-center gap-2 px-2"
                        >
                          <div>{c.groupPath.at(-1)}</div>
                        </Grid.HeaderGroupCell>
                      );
                    }

                    return (
                      <Grid.HeaderCell
                        key={c.id}
                        cell={c}
                        className="flex h-full w-full items-center px-2 capitalize"
                      >
                        {c.id === GROUP_COLUMN_SINGLE_ID ? "Group" : c.id.split("-->").at(-1)}
                      </Grid.HeaderCell>
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
