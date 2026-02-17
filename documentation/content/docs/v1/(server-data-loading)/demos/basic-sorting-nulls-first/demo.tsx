"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useEffect, useId, useState } from "react";
import { Server } from "./server";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  GridCheckbox,
  HeaderRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components";
import { context } from "./nulls-first-context";

const columns: Column<MovieData>[] = [
  { id: "name", name: "Title", width: 250, widthFlex: 1, cellRenderer: NameCellRenderer },
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

export default function SortingNullsFirst() {
  const ds = useServerDataSource<MovieData>({
    dataFetcher: (params) => {
      return Server(params.requests, params.model.sorts);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    sortModel: [
      {
        columnId: "released_at",
        sort: { kind: "string", options: { nullsFirst: true } },
        isDescending: false,
      },
    ],

    columnBase: {
      headerRenderer: HeaderRenderer,
    },
  });

  const [nullsFirst, setNullsFirst] = useState(true);
  const view = grid.view.useValue();

  useEffect(() => {
    grid.state.sortModel.set((prev) => {
      return prev.map((c) => {
        return {
          ...c,
          sort: { ...c.sort, options: { ...c.sort.options, nullsFirst: nullsFirst } },
        };
      });
    });
  }, [grid.state.sortModel, nullsFirst]);

  return (
    <context.Provider value={nullsFirst}>
      <div>
        <div className="border-ln-gray-20 flex items-center border-b px-2 py-1">
          <label className="flex items-center gap-2">
            <GridCheckbox checked={nullsFirst} onCheckedChange={(b) => setNullsFirst(!!b)} />
            Display Nulls First
          </label>
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
      </div>
    </context.Provider>
  );
}
