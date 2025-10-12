"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId, useRef } from "react";
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

const columns: Column<MovieData>[] = [
  {
    id: "#",
    name: "",
    width: 30,
    field: "link",
    widthMin: 30,
    widthMax: 30,
    cellRenderer: LinkRenderer,
  },
  { id: "name", name: "Title", width: 250, widthFlex: 1, cellRenderer: NameCellRenderer },
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

export default function ServerDataFailFirst() {
  // Track a fail ref to simulate network failure but still allow the demo to be reset.
  const shouldFailRef = useRef(true);
  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      const fail = shouldFailRef.current;
      shouldFailRef.current = false;
      return Server(params.requests, fail);
    },
    blockSize: 50,
  });
  const error = ds.loadError.useValue();

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid relative" style={{ height: 500 }}>
      {!!error && (
        <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 bg-red-500/20">
          <span>{`${error}`}</span>
          <button
            onClick={() => {
              ds.reset();
            }}
            className="border-primary-500 bg-primary-200 text-primary-800 rounded-xs hover:bg-primary-300 cursor-pointer border px-2"
          >
            Retry - it will work now
          </button>
        </div>
      )}

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
