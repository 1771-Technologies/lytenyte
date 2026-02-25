import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useServerDataSource, type DataResponse } from "@1771technologies/lytenyte-pro";

import { useRef, useState } from "react";
import { Server } from "./server.jsx";
import type { MovieData } from "./data.js";
import {
  GenreRenderer,
  LinkRenderer,
  NameCellRenderer,
  RatingRenderer,
  ReleasedRenderer,
  TypeRenderer,
} from "./components.jsx";
import { Pager } from "./pager.jsx";

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

const pageSize = 10;

const headerHeight = 40;
const rowHeight = 40;

export default function PaginationDemo() {
  const [page, setPage] = useState(1); //!
  const [count, setCount] = useState<number | null>(null); //!

  const responseCache = useRef<Record<number, DataResponse[]>>({});

  const ds = useServerDataSource<GridSpec["data"], [page: number]>({
    queryFn: async ({ requests, queryKey }) => {
      const page = queryKey[0];

      if (responseCache.current[page]) {
        return responseCache.current[page].map((x) => ({ ...x, asOfTime: Date.now() }));
      }

      const result = await Server(requests, page - 1, pageSize);
      responseCache.current[page] = result.pages;

      setCount(result.count);

      return result.pages;
    },
    queryKey: [page],
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <div>
      <div className="ln-grid" style={{ height: pageSize * rowHeight + headerHeight }}>
        <Grid
          rowSource={ds}
          columns={columns}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          slotViewportOverlay={
            isLoading && (
              <div className="bg-ln-gray-20/40 top-(--ln-top-offset) absolute left-0 z-20 h-[calc(100%-var(--ln-top-offset))] w-full animate-pulse"></div>
            )
          }
        />
      </div>
      <div className="border-ln-border h-13 flex items-center justify-end gap-4 border-t px-4">
        {count && <Pager page={page} onPageChange={setPage} count={count} pageSize={pageSize} />}
      </div>
    </div>
  );
}
