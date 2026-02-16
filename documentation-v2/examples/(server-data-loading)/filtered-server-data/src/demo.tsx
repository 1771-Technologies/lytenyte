"use client";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  Grid,
  usePiece,
  useServerDataSource,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro-experimental";

import { useMemo, useState } from "react";
import { Server } from "./server.js";
import type { MovieData } from "./data";
import {
  GenreRenderer,
  Header,
  LinkRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components.js";
import type { GridFilter } from "./types.js";

export interface GridSpec {
  readonly data: MovieData;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, GridFilter>>;
  };
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
    headerRenderer: () => <div />,
  },
  { id: "name", name: "Title", width: 250, widthFlex: 1, cellRenderer: NameCellRenderer },
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer, type: "date" },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

const base: Grid.ColumnBase<GridSpec> = { headerRenderer: Header };

export default function ServerDataDemo() {
  const [filters, setFilters] = useState<Record<string, GridFilter>>({});

  const model = usePiece(filters, setFilters);

  const ds = useServerDataSource({
    queryFn: (params) => Server(params.requests, params.queryKey[0]),
    queryKey: [filters] as const,
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();
  const apiExtension = useMemo(() => ({ filterModel: model }), [model]);

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        apiExtension={apiExtension}
        rowSource={ds}
        columns={columns}
        columnBase={base}
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
