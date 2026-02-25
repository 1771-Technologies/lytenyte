import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useServerDataSource, type DataResponse } from "@1771technologies/lytenyte-pro";

import { useMemo, useRef, useState } from "react";
import { Server } from "./server.jsx";
import type { MovieData } from "./data.js";
import {
  GenreRenderer,
  Header,
  LinkRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components.jsx";
import { Pager } from "./pager.jsx";

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

const pageSize = 10;

const base: Grid.ColumnBase<GridSpec> = { headerRenderer: Header };

const headerHeight = 40;
const rowHeight = 40;

export default function PaginationDemo() {
  const [columns, setColumns] = useState(initialColumns);
  const [page, setPage] = useState(1); //!
  const [count, setCount] = useState<number | null>(null); //!

  const sort = useMemo(() => {
    const columnWithSort = columns.find((x) => x.sort);
    if (!columnWithSort) return null;

    return { columnId: columnWithSort.id, isDescending: columnWithSort.sort === "desc" };
  }, [columns]);

  const responseCache = useRef<Record<number, DataResponse[]>>({});

  const ds = useServerDataSource({
    queryFn: async ({ requests, queryKey }) => {
      const page = queryKey[0];
      const sort = queryKey[1];

      if (responseCache.current[page]) {
        return responseCache.current[page].map((x) => ({ ...x, asOfTime: Date.now() }));
      }

      const result = await Server(requests, page - 1, pageSize, sort);
      responseCache.current[page] = result.pages;

      setCount(result.count);

      return result.pages;
    },
    queryKey: [page, sort] as const,
  });

  const isLoading = ds.isLoading.useValue();

  const apiExtension = useMemo<GridSpec["api"]>(() => {
    return {
      sortColumn: (id, dir) => {
        setColumns((prev) => {
          responseCache.current = {};
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
    <div>
      <div className="ln-grid" style={{ height: pageSize * rowHeight + headerHeight }}>
        <Grid
          rowSource={ds}
          columns={columns}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          apiExtension={apiExtension}
          columnBase={base}
          slotViewportOverlay={
            isLoading && (
              <div className="bg-ln-gray-20/40 top-(--ln-top-offset) absolute left-0 z-20 h-[calc(100%-var(--ln-top-offset))] w-full animate-pulse"></div>
            )
          }
        />
      </div>
      <div className="border-ln-border flex h-12 items-center justify-end gap-4 border-t px-4">
        {count && <Pager page={page} pageSize={pageSize} count={count} onPageChange={setPage} />}
      </div>
    </div>
  );
}
