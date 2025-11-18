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

export default function RowSorting() {
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
    sortModel: [{ columnId: "age", sort: { kind: "number" }, isDescending: false }],
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

function Header({ column, grid }: HeaderCellRendererParams<BankData>) {
  const sort = grid.state.sortModel.useValue().find((c) => c.columnId === column.id);

  const isDescending = sort?.isDescending ?? false;

  return (
    <div
      className="hover:bg-ln-gray-10 flex h-full w-full items-center px-2 text-sm transition-all"
      onClick={() => {
        const current = grid.api.sortForColumn(column.id);

        if (current == null) {
          let sort: SortModelItem<BankData>;
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

          grid.state.sortModel.set([sort]);
          return;
        }
        if (!current.sort.isDescending) {
          grid.state.sortModel.set([{ ...current.sort, isDescending: true }]);
        } else {
          grid.state.sortModel.set([]);
        }
      }}
    >
      {column.name ?? column.id}

      {sort && (
        <>
          {!isDescending ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </>
      )}
    </div>
  );
}
