"use client";

import { Grid, useClientRowDataSourcePaginated } from "@1771technologies/lytenyte-pro";
import { Pagination } from "@ark-ui/react/pagination";
import "@1771technologies/lytenyte-pro/grid.css";
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

export default function RowPagination() {
  const ds = useClientRowDataSourcePaginated({
    data: bankDataSmall,
    rowsPerPage: 20,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();
  return (
    <div>
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
      <div>
        <Pagination.Root
          className="flex justify-end gap-2 px-2 py-2 text-sm"
          count={bankDataSmall.length}
          pageSize={20}
          siblingCount={2}
          page={ds.page.current.useValue() + 1}
          onPageChange={(d) => {
            ds.page.current.set(d.page - 1);
          }}
        >
          <Pagination.PrevTrigger className="rounded border border-gray-500/50 px-2 py-1">
            Previous Page
          </Pagination.PrevTrigger>
          <Pagination.Context>
            {(pagination) =>
              pagination.pages.map((page, index) =>
                page.type === "page" ? (
                  <Pagination.Item
                    key={index}
                    {...page}
                    className="data-[selected]:bg-brand/40 rounded border border-gray-500/50 px-2 py-1"
                  >
                    {page.value}
                  </Pagination.Item>
                ) : (
                  <Pagination.Ellipsis key={index} index={index}>
                    &#8230;
                  </Pagination.Ellipsis>
                ),
              )
            }
          </Pagination.Context>
          <Pagination.NextTrigger className="rounded border border-gray-500/50 px-2 py-1">
            Next Page
          </Pagination.NextTrigger>
        </Pagination.Root>
      </div>
    </div>
  );
}
