"use client";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { useCallback, useMemo, useState } from "react";
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
import {
  Grid,
  useServerDataSource,
  type UseServerDataSourceParams,
} from "@1771technologies/lytenyte-pro-experimental";

export interface GridSpec {
  readonly data: MovieData;
}

const cellRenderers = {
  "#": LinkRenderer,
  released_at: ReleasedRenderer,
  genre: GenreRenderer,
  name: NameCellRenderer,
  type: TypeRenderer,
  imdb_rating: RatingRenderer,
};

export default function ServerDataDemo() {
  const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([]);

  const queryFn: UseServerDataSourceParams<GridSpec["data"], []>["queryFn"] = useCallback(async (params) => {
    const res = await Server(params.requests);

    if (res.columns) {
      setColumns(
        res.columns.map((x) => {
          return {
            ...x,
            cellRenderer: cellRenderers[x.id as keyof typeof cellRenderers],
          } satisfies Grid.Column<GridSpec>;
        }),
      );
    }

    return res.data;
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
