"use client";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  Grid,
  useServerDataSource,
  type UseServerDataSourceParams,
} from "@1771technologies/lytenyte-pro-experimental";

import { useCallback } from "react";
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
  const queryFn: UseServerDataSourceParams<GridSpec["data"], []>["queryFn"] = useCallback((params) => {
    return Server(params.requests);
  }, []);

  const ds = useServerDataSource<GridSpec["data"], []>({
    queryFn,
    queryKey: [],
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        slotViewportOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
          )
        }
      />
    </div>
  );
}
