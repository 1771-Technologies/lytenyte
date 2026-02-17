"use client";
import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  Grid,
  useServerDataSource,
  type UseServerDataSourceParams,
} from "@1771technologies/lytenyte-pro";

import { useCallback, useMemo, useState } from "react";
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

export interface GridSpec {
  readonly data: MovieData;
  readonly column: { sort?: "asc" | "desc" };
  readonly api: {
    sortColumn: (id: string, dir: "asc" | "desc" | null) => void;
  };
}

const initialColumns: Grid.Column<GridSpec>[] = [
  {
    id: "#",
    name: "",
    width: 30,
    field: "link",
    widthMin: 30,
    widthMax: 30,
    cellRenderer: LinkRenderer,
    headerRenderer: () => <div></div>,
  },
  { id: "name", name: "Title", width: 250, widthFlex: 1, cellRenderer: NameCellRenderer },
  { id: "released_at", name: "Released", width: 120, cellRenderer: ReleasedRenderer },
  { id: "genre", name: "Genre", cellRenderer: GenreRenderer },
  { id: "type", name: "Type", width: 120, cellRenderer: TypeRenderer },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: RatingRenderer },
];

const base: Grid.ColumnBase<GridSpec> = { headerRenderer: Header };

export default function ServerDataDemo() {
  const [columns, setColumns] = useState(initialColumns);
  const queryFn: UseServerDataSourceParams<
    GridSpec["data"],
    [{ columnId: string; isDescending: boolean } | null]
  >["queryFn"] = useCallback((params) => {
    return Server(params.requests, params.queryKey[0]);
  }, []);

  const sort = useMemo(() => {
    const columnWithSort = columns.find((x) => x.sort);
    if (!columnWithSort) return null;

    return { columnId: columnWithSort.id, isDescending: columnWithSort.sort === "desc" };
  }, [columns]);

  const ds = useServerDataSource({
    queryFn,
    queryKey: [sort] as const,
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  const apiExtension = useMemo<GridSpec["api"]>(() => {
    return {
      sortColumn: (id, dir) => {
        setColumns((prev) => {
          const next = prev.map((x) => {
            // Remove any existing sort
            if (x.sort && x.id !== id) {
              const next = { ...x };
              delete next.sort;
              return next;
            }
            // Apply our new sort
            if (x.id === id) {
              const next = { ...x };
              if (dir == null) delete next.sort;
              else next.sort = dir;

              return next;
            }
            return x;
          });
          return next;
        });
      },
    };
  }, []);

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
        slotRowsOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 absolute left-0 top-0 h-full w-full animate-pulse"></div>
          )
        }
        events={{
          headerCell: {
            keyDown: ({ event: ev, column }) => {
              if (ev.key === "Enter") {
                const nextSort = column.sort === "asc" ? null : column.sort === "desc" ? "asc" : "desc";
                apiExtension.sortColumn(column.id, nextSort);
              }
            },
          },
        }}
      />
    </div>
  );
}
