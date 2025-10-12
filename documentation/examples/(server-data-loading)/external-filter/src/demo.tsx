"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useEffect, useId, useRef, useState } from "react";
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
import { Switch } from "radix-ui";

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
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer, type: "date" },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

export default function Filtering() {
  const [on, setOn] = useState(true);
  const showMovies = useRef(on);

  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      return Server(params.requests, showMovies.current);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    quickSearch: "movie",
  });

  const view = grid.view.useValue();

  useEffect(() => {
    showMovies.current = on;
    ds.reset();
  }, [ds, on]);

  return (
    <>
      <div className="border-b-ln-gray-20 flex items-center gap-1 border-b px-2 py-2.5">
        <div className="flex items-center">
          <label
            className="text-ln-gray-90 pr-[15px] text-[15px] leading-none"
            htmlFor="movie-switch"
          >
            Show TV Shows
          </label>
          <Switch.Root
            checked={on}
            onCheckedChange={setOn}
            className="bg-ln-gray-30 border-ln-gray-60 data-[state=checked]:bg-ln-primary-50 relative h-[25px] w-[42px] cursor-default rounded-full outline-none"
            id="movie-switch"
          >
            <Switch.Thumb className="shadow-blackA4 block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>

          <span className="text-ln-gray-90 pl-[15px] text-[15px] leading-none">Show Movies</span>
        </div>
      </div>
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
                          className="flex items-center px-2 text-sm"
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
    </>
  );
}
