"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ArrowDownIcon, ArrowUpIcon } from "@1771technologies/lytenyte-pro/icons";
import type {
  Column,
  HeaderCellRendererParams,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";
import { BalanceCell, DurationCell, NumberCell, tw } from "./components";

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
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function RowSortingMulti() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      width: 100,
      headerRenderer: Header,
    },

    sortModel: [
      { columnId: "education", sort: { kind: "string" }, isDescending: false },
      { columnId: "age", sort: { kind: "number" }, isDescending: true },
    ],
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
                          "flex items-center text-sm capitalize",
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
  );
}

function Header({ column, grid }: HeaderCellRendererParams<BankData>) {
  const sortModel = grid.state.sortModel.useValue();

  const sortIndex = sortModel.findIndex((c) => c.columnId === column.id);

  const sort = sortIndex === -1 ? null : sortModel[sortIndex];

  const isDescending = sort?.isDescending ?? false;

  return (
    <div
      className={tw(
        "hover:bg-ln-gray-10 flex h-full w-full items-center px-2 text-sm transition-all",
        column.type === "number" && "justify-end",
      )}
      onClick={(ev) => {
        const current = grid.api.sortForColumn(column.id);

        const isAdditive = ev.ctrlKey || ev.metaKey;

        let sort: SortModelItem<BankData> | null = null;

        if (current == null) {
          const columnId = column.id;

          if (column.type === "datetime") {
            sort = {
              columnId,
              sort: { kind: "date", options: { includeTime: true } },
            };
          } else if (column.type === "number") {
            sort = { columnId, sort: { kind: "number" } };
          } else {
            sort = { columnId, sort: { kind: "string" } };
          }
        } else {
          // If additive, we allow the current sort direction to continuously flip direction rather than being removed
          if (isAdditive) {
            sort = {
              ...current.sort,
              isDescending: !current.sort.isDescending,
            };
          } else if (!current.sort.isDescending) {
            sort = {
              ...current.sort,
              isDescending: true,
            };
          }
        }

        if (isAdditive) {
          // Remove the sort from the current list if the next sort in the cycle is null
          if (!sort) {
            const nextSortModel = sortModel.filter((x) => x !== sort);
            grid.state.sortModel.set(nextSortModel);
            return;
          }

          // Otherwise add the next sort to the list. If this is a new sort we push
          // it to the end
          const nextSortModel = [...sortModel];
          if (sortIndex === -1) nextSortModel.push(sort);
          else nextSortModel[sortIndex] = sort;

          grid.state.sortModel.set(nextSortModel);
        } else {
          grid.state.sortModel.set(sort ? [sort] : []);
        }
      }}
    >
      {column.name ?? column.id}

      {sort && (
        <div className="text-ln-primary-50 relative font-bold">
          {!isDescending ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
          {sortIndex >= 0 && sortModel.length > 1 && (
            <div className="absolute right-[-2px] top-[-2px] text-xs">{sortIndex + 1}</div>
          )}
        </div>
      )}
    </div>
  );
}
