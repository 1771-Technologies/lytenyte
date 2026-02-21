import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  Grid,
  usePiece,
  useServerDataSource,
  type DataResponse,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro";

import { useCallback, useMemo, useRef, useState } from "react";
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

const pageSize = 10;

const formatter = Intl.NumberFormat("en-Us", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const headerHeight = 40;
const rowHeight = 40;

export default function PaginationDemo() {
  const [page, setPage] = useState(0); //!
  const [count, setCount] = useState<number | null>(null); //!

  const [filters, setFilters] = useState<Record<string, GridFilter>>({});
  const responseCache = useRef<Record<number, DataResponse[]>>({});

  const setFilterAndResetCache: typeof setFilters = useCallback((arg) => {
    setFilters(arg);
    responseCache.current = {};
  }, []);

  const model = usePiece(filters, setFilterAndResetCache);

  const ds = useServerDataSource({
    queryFn: async ({ requests, queryKey }) => {
      const page = queryKey[0];
      const filter = queryKey[1];

      if (responseCache.current[page]) {
        return responseCache.current[page].map((x) => ({ ...x, asOfTime: Date.now() }));
      }

      const result = await Server(requests, page, pageSize, filter);
      responseCache.current[page] = result.pages;

      setCount(result.count);

      return result.pages;
    },
    queryKey: [page, filters] as const,
  });

  const isLoading = ds.isLoading.useValue();
  const apiExtension = useMemo(() => ({ filterModel: model }), [model]);

  return (
    <div>
      <div className="ln-grid" style={{ height: pageSize * rowHeight + headerHeight }}>
        <Grid
          rowSource={ds}
          apiExtension={apiExtension}
          columnBase={base}
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
      <div className="border-ln-border flex h-12 items-center justify-end gap-4 border-t px-4">
        {count && (
          <>
            <div className="text-sm tabular-nums">
              {formatter.format(page * pageSize + 1)}-{formatter.format(page * pageSize + pageSize)} of{" "}
              {formatter.format(count)}
            </div>
            <div className="flex items-center">
              <button
                data-ln-button="tertiary"
                data-ln-size="lg"
                className="rounded-e-none"
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              >
                <svg width="14" height="14" fill="currentcolor" viewBox="0 0 256 256">
                  <path d="M168,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,168,48Z"></path>
                </svg>
              </button>
              <button
                data-ln-button="tertiary"
                data-ln-size="lg"
                className="rounded-s-none border-s-0"
                onClick={() => setPage((prev) => Math.min(Math.ceil(count / pageSize) - 1, prev + 1))}
              >
                <svg width="14" height="14" fill="currentcolor" viewBox="0 0 256 256">
                  <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
