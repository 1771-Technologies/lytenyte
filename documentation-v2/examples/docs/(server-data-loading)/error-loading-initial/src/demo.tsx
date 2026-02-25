"use client";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";

import { Server } from "./server.js";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  LinkRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components.js";
import { useMemo, useRef } from "react";

export interface GridSpec {
  readonly data: MovieData;
}

const columns: Grid.Column<GridSpec>[] = [
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
export default function ServerDataDemo() {
  // Track a fail ref to simulate network failure but still allow the demo to be reset.
  const shouldFailRef = useRef(true);
  const ds = useServerDataSource<MovieData>({
    queryFn: (params) => {
      const fail = shouldFailRef.current;
      shouldFailRef.current = false;
      return Server(params.requests, fail);
    },
    queryKey: [],
    blockSize: 50,
  });
  const error = ds.loadingError.useValue();
  const isLoading = ds.isLoading.useValue();

  return (
    <div className="ln-grid relative" style={{ height: 500 }}>
      {!!error && (
        <div className="z-2 absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-red-500/20">
          <span>{`${error}`}</span>
          <button
            data-ln-button="website"
            data-ln-size="md"
            onClick={() => {
              ds.reset();
            }}
          >
            Retry / Resolve
          </button>
        </div>
      )}

      <Grid
        rowSource={ds}
        columns={columns}
        styles={useMemo(() => {
          return { viewport: { style: { overflowY: "scroll" } } };
        }, [])}
        slotViewportOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
          )
        }
      />
    </div>
  );
}
