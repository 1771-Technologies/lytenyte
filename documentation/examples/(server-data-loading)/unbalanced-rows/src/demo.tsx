"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import { Server } from "./server";
import { GroupCellRenderer, LastModified, SizeRenderer, tw } from "./components";

const columns: Column<any>[] = [
  { id: "name", width: 200, widthFlex: 1, cellRenderer: GroupCellRenderer },
  { id: "size", cellRenderer: SizeRenderer },
  { id: "last_modified", name: "Modified", cellRenderer: LastModified },
  { id: "type", width: 100, name: "Ext" },
];

export default function BasicServerData() {
  const ds = useServerDataSource<any>({
    dataFetcher: (params) => {
      return Server(params.requests);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    rowGroupExpansions: { Documents: true },
    columns,
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
                          "flex h-full w-full items-center px-2 text-sm capitalize",
                          c.column.id === "size" && "justify-end",
                        )}
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer
            className={ds.isLoading.useValue() ? "animate-pulse bg-gray-100" : ""}
          >
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
