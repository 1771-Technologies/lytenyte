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

export default function PaginationDemo() {
  const [filters, setFilters] = useState<Record<string, GridFilter>>({});
  const responseCache = useRef<Record<number, DataResponse[]>>({});

  const setFilterAndResetCache: typeof setFilters = useCallback((arg) => {
    setFilters(arg);
    responseCache.current = {};
  }, []);

  const model = usePiece(filters, setFilterAndResetCache);

  const ds = useServerDataSource({
    queryFn: async ({ requests, queryKey }) => {
      const filter = queryKey[0];

      return await Server(requests, filter);
    },
    queryKey: [filters] as const,
  });

  const isLoading = ds.isLoading.useValue();
  const apiExtension = useMemo(() => ({ filterModel: model }), [model]);

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        apiExtension={apiExtension}
        columnBase={base}
        columns={columns}
        events={useMemo<Grid.Events<GridSpec>>(() => {
          return {
            viewport: {
              scrollEnd: ({ viewport }) => {
                const top = viewport.scrollTop;
                const left = viewport.scrollHeight - viewport.clientHeight - top;
                if (left < 100) {
                  const req = ds.requestsForView.get().at(-1)!;
                  const next = { ...req, start: req.end, end: req.end + 100 };
                  ds.pushRequests([next]);
                }
              },
            },
          };
        }, [ds])}
        styles={useMemo(() => {
          return { viewport: { style: { scrollbarGutter: "stable" } } };
        }, [])}
        slotViewportOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 top-(--ln-top-offset) absolute left-0 z-20 h-[calc(100%-var(--ln-top-offset))] w-full animate-pulse"></div>
          )
        }
      />
    </div>
  );
}
