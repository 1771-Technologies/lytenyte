"use client";

import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  Grid,
  useServerDataSource,
  type UseServerDataSourceParams,
} from "@1771technologies/lytenyte-pro";

import { useCallback, useMemo } from "react";
import { Server } from "./server.js";
import { data, type MovieData } from "./data.js";
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
    <>
      <div className="border-b-ln-gray-20 flex gap-2 border-b px-2 py-4">
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            ds.pushResponses([
              {
                kind: "top",
                asOfTime: Date.now(),
                data: [{ id: data[0].uniq_id, kind: "leaf", data: data[0] }],
              },
            ]);
          }}
        >
          Pin One Top
        </button>
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            ds.pushResponses([
              {
                kind: "top",
                asOfTime: Date.now(),
                data: [],
              },
            ]);
          }}
        >
          Remove Pinned
        </button>
      </div>

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
    </>
  );
}
