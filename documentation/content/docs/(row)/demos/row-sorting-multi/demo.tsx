"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type {
  Column,
  HeaderCellRendererParams,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "education" },
  { id: "marital" },
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
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

export default function RowSortingMulti() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
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
                        className="flex w-full h-full capitalize px-2 items-center"
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
                          className="text-sm flex items-center px-2 h-full w-full"
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
      className="flex items-center px-2 w-full h-full text-sm hover:bg-ln-gray-10 transition-all"
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
        } else if (!current.sort.isDescending) {
          sort = { ...current.sort, isDescending: true };
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
        <div className="relative">
          {!isDescending ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
          {sortIndex >= 0 && sortModel.length > 1 && (
            <div className="absolute top-[-2px] right-[-2px] text-xs text-ln-primary-5">
              {sortIndex + 1}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
