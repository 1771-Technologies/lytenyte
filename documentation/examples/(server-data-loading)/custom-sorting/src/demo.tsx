"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Server } from "./server";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  HeaderRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components";
import type { CustomSort } from "./custom-sort-context";
import { context } from "./custom-sort-context";

const columns: Column<MovieData>[] = [
  { id: "name", name: "Title", width: 250, widthFlex: 1, cellRenderer: NameCellRenderer },
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

export default function SortingNullsFirst() {
  const [sort, setSort] = useState<CustomSort | null>({ columnId: "name", isDescending: false });
  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      return Server(params.requests, sort);
    },
    dataFetchExternals: [sort],
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: {
      headerRenderer: HeaderRenderer,
    },
  });

  const view = grid.view.useValue();

  return (
    <context.Provider value={useMemo(() => ({ sort, setSort }), [sort])}>
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
                          className="flex h-full w-full items-center text-sm capitalize"
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
    </context.Provider>
  );
}
