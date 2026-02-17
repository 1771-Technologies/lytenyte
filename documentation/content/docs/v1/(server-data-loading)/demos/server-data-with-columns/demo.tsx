"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { useId } from "react";
import { Server } from "./server";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  LinkRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components";

export default function BasicServerData() {
  const ds = useServerDataSource<MovieData>({
    dataFetcher: async (params) => {
      const res = await Server(params.requests);

      // if we haven't defined our columns, then we will use the columns on the response
      // to set our grid columns.
      if (!params.grid.state.columns.get().length) {
        params.grid.state.columns.set(res.columns);
      }

      return res.data;
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns: [],

    cellRenderers: {
      link: LinkRenderer,
      release: ReleasedRenderer,
      genre: GenreRenderer,
      name: NameCellRenderer,
      type: TypeRenderer,
      rating: RatingRenderer,
    },
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ height: 500 }}>
      <Grid.Root grid={grid}>
        <Grid.Viewport style={{ overflowY: "scroll" }}>
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
