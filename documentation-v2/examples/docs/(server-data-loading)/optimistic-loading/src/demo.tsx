"use client";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro-experimental";

import { useEffect, useMemo } from "react";
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
  const ds = useServerDataSource<GridSpec["data"], []>({
    queryFn: (params) => Server(params.requests),
    queryKey: [],
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  const requests = ds.requestsForView.useValue();
  useEffect(() => {
    // When the view changes, grab the next view value using the atom's get method.
    // Since this grid is flat, take the last item in the view.
    const view = requests.at(-1);
    if (!view) return;

    // Compute the next slice for this view. Returns null if the current view is the last one.
    const next = ds.requestForNextSlice(view);
    if (!next || ds.seenRequests.has(next.id)) return;

    // Mark this request as seen so the grid doesn’t refetch it when scrolled into view.
    // This step is optional but helps LyteNyte Grid track requested data.
    ds.seenRequests.add(next.id);

    // Push the new request into the grid. This triggers LyteNyte Grid to fetch the data.
    ds.pushRequests([next]);
  }, [ds, requests]);

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        styles={useMemo(() => {
          return { viewport: { style: { scrollbarGutter: "stable" } } };
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
