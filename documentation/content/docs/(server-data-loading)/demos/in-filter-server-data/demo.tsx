"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import { Server, ServerInFilter } from "./server";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  HeaderRenderer,
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
  {
    id: "name",
    name: "Title",
    width: 250,
    widthFlex: 1,
    cellRenderer: NameCellRenderer,
    headerRenderer: HeaderRenderer,
  },
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer, type: "date" },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer, headerRenderer: HeaderRenderer },
  {
    id: "type",
    name: "Type",
    width: 120,
    cellRenderer: TypeRenderer,
    headerRenderer: HeaderRenderer,
  },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

export default function Filtering() {
  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      return Server(params.requests, params.model.filtersIn);
    },
    dataInFilterItemFetcher: (params) => {
      return ServerInFilter(params.column);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    filterInModel: {
      genre: {
        kind: "in",
        operator: "not_in",
        value: new Set(["Drama", "Animation", "Anime"]),
      },
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
                        className="flex items-center px-2 text-sm"
                        key={c.id}
                        cell={c}
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
