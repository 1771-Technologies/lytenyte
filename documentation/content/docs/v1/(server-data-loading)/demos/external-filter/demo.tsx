"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId, useState } from "react";
import { Server } from "./server";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  LinkRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  ToggleGroup,
  ToggleItem,
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
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer, type: "date" },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

export default function Filtering() {
  const [on, setOn] = useState(true);

  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      return Server(params.requests, on);
    },
    dataFetchExternals: [on],
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    quickSearch: "movie",
  });

  const view = grid.view.useValue();

  return (
    <>
      <div className="border-b-ln-gray-20 flex items-center gap-1 border-b px-2 py-2.5">
        <ToggleGroup type="single" value={on ? "1" : "0"} onValueChange={(x) => setOn(x === "1")}>
          <ToggleItem value="0">TV Shows</ToggleItem>
          <ToggleItem value="1">Movies</ToggleItem>
        </ToggleGroup>
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
