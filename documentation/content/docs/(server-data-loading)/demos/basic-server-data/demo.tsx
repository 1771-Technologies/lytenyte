"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import { Server } from "./server";
import type { MovieData } from "./data";

const columns: Column<MovieData>[] = [
  { id: "name", name: "Title", width: 250, widthFlex: 1 },
  { id: "released_at", name: "Released", width: 120 },
  { id: "genre", name: "Genre" },
  { id: "type", name: "Type", width: 120 },
  { id: "imdb_rating", name: "IMDB Rating", width: 120 },
];

export default function RowDetail() {
  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      return Server(params.requests);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
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
                        className="flex h-full w-full items-center px-2 text-sm capitalize"
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
