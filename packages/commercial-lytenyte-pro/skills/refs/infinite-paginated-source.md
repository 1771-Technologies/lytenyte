# Infinite Scrolling & Pagination (PRO)

Both patterns are implemented on top of `useServerDataSource`. Read [server-data-source.md](./server-data-source.md) first.

## Infinite Scrolling

Detect scroll-near-end and push additional data requests:

```tsx
import { useServerDataSource } from "@1771technologies/lytenyte-pro";

const ds = useServerDataSource<GridSpec["data"]>({
  queryFn: (params) => Server(params.requests),
  queryKey: [],
});

<Grid
  rowSource={ds}
  columns={columns}
  events={useMemo<Grid.Events<GridSpec>>(() => ({
    viewport: {
      scrollEnd: ({ viewport }) => {
        const distanceFromBottom =
          viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;

        if (distanceFromBottom < 100) {
          const req = ds.requestsForView.get().at(-1)!;
          // Request the next block of rows
          const next = { ...req, start: req.end, end: req.end + 100 };
          ds.pushRequests([next]);
        }
      },
    },
  }), [ds])}
/>
```

The key pattern: take the last request from `ds.requestsForView`, extend its `start`/`end` range, and push it with `ds.pushRequests`.

### Sorting & Filtering for Infinite Scroll

Same `queryKey` pattern as the server source — put sort/filter models in `queryKey`:

```ts
const ds = useServerDataSource({
  queryFn: (params) => Server(params.requests, params.queryKey[0], params.queryKey[1]),
  queryKey: [sortModel, filterModel] as const,
});
```

When `queryKey` changes, the grid resets and starts from page 0.

## Pagination

Use `page` state in `queryKey` to drive page-based fetching:

```tsx
const [page, setPage] = useState(1);
const [totalCount, setTotalCount] = useState(0);
const pageSize = 50;
const responseCache = useRef<Record<number, DataResponse[]>>({});

const ds = useServerDataSource<GridSpec["data"], [page: number]>({
  queryFn: async ({ requests, queryKey }) => {
    const page = queryKey[0];

    // Cache to avoid refetching visited pages
    if (responseCache.current[page]) {
      return responseCache.current[page].map(x => ({ ...x, asOfTime: Date.now() }));
    }

    const result = await Server(requests, page, pageSize);
    responseCache.current[page] = result.pages;
    setTotalCount(result.count);
    return result.pages;
  },
  queryKey: [page],
});
```

Changing `pageSize` should clear the cache and reset page:

```ts
const handlePageSizeChange = (newSize: number) => {
  responseCache.current = {};
  setPage(1);
  setPageSize(newSize);
};
```

The server response must include `size` (total rows for the current page's path) so LyteNyte Grid knows the scrollable area size.

### Sorting & Filtering for Pagination

```ts
const ds = useServerDataSource({
  queryFn: (params) => Server(params.requests, params.queryKey[0], params.queryKey[1], params.queryKey[2]),
  queryKey: [page, sortModel, filterModel] as const,
});

// When sort/filter changes, reset to page 1:
const handleSortChange = (sort) => {
  setPage(1);
  setSortModel(sort);
};
```

## Key Differences

| | Infinite Scroll | Pagination |
|---|---|---|
| Data grows | Yes — appends | No — replaces per page |
| `queryKey` changes | Only for sort/filter | Every page change |
| Cache strategy | Grid caches loaded rows | App-level cache recommended |
| UX | Scroll to load more | Explicit page navigation |

## Gotchas

- **Never put `pushRequests` arguments in `queryKey`** — `pushRequests` extends the current view; putting it in `queryKey` triggers a full grid reset on every push, discarding all loaded rows and restarting from row 0. Only sort/filter models belong in `queryKey`.
- **Guard against undefined request before pushing** — `ds.requestsForView.get().at(-1)` returns `undefined` before the data source has loaded any view. Always guard: `const req = ds.requestsForView.get().at(-1); if (!req) return;` before calling `ds.pushRequests`.
- **Tune `distanceFromBottom` threshold to your row height** — `100` pixels works for 40px rows, but for tall rows (120px+) or very fast scrollers, increase the threshold so the next batch loads before the user reaches the end.
- **Pagination: pageSize change must clear cache AND reset page** — if you clear the cache but don't reset page, `queryKey` doesn't change and `queryFn` isn't called. If you reset page but don't clear the cache, stale cached responses for the old page size are returned. Both must happen together.
- **Server `size` must reflect the full dataset count, not the page slice** — the grid uses `size` to calculate the total scrollable area and scrollbar position. Returning `pageSize` (e.g. 50) instead of `totalCount` (e.g. 5000) makes the grid think there are only 50 rows.
- **Don't include `page` in `queryKey` for infinite scroll** — for infinite scroll, page state is managed internally via `pushRequests`. Including `page` in `queryKey` resets the grid on every push. Only use `page` in `queryKey` for explicit pagination.

## Full Docs

- [Infinite Rows](/docs/infinite-rs-rows)
- [Infinite Row Sorting](/docs/infinite-rs-row-sorting)
- [Infinite Row Filtering](/docs/infinite-rs-row-filtering)
- [Paginated Rows](/docs/paginated-rs-rows)
- [Paginated Row Sorting](/docs/paginated-rs-row-sorting)
- [Paginated Row Filtering](/docs/paginated-rs-row-filtering)
- [Server Data Interface](/docs/server-data-loading-interface)
