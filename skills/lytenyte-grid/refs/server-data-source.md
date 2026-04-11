# Server Data Source (PRO)

Use `useServerDataSource` when your dataset is too large to load into the browser at once. Supports viewport-based loading of millions of rows.

**Step-by-step to set up a server data source:**
1. Implement a `queryFn` that accepts `params.requests` and `params.queryKey`, sends them to your backend, and returns `DataResponse[]`
2. Pass `queryKey` with any values that should trigger a full reset on change (sort model, filter model)
3. Your server reads `request.start`/`request.end` to determine which rows to return, and `request.path` to know which group is being expanded
4. Return `size` as the **total** row count at that path (not just the current page), so the grid can size the scrollbar correctly
5. Use `asOfTime: Date.now()` on every response so out-of-order responses are discarded correctly

## Basic Setup

```tsx
import { useServerDataSource } from "@1771technologies/lytenyte-pro";

const ds = useServerDataSource<MyRowType>({
  queryFn: async (params) => {
    return await fetchFromServer(params.requests, params.queryKey);
  },
  queryKey: [],       // dependency array — changes trigger full reset + refetch
  blockSize: 100,     // rows per request block (optional)
});

<Grid rowSource={ds} columns={columns} />
```

`queryKey` works like React's `useMemo` dependencies — include sort/filter models here so the grid refetches when they change.

## Request Interface

LyteNyte Grid calls `queryFn` with:

```ts
interface QueryFnParams<K extends unknown[]> {
  readonly queryKey: K;
  readonly requests: DataRequest[];
  readonly reqTime: number;
  readonly model: {
    readonly rowGroupExpansions: Record<string, boolean | undefined>;
  };
}

interface DataRequest {
  readonly id: string;
  readonly path: (string | null)[];  // [] = root; ["Alpha"] = group expansion
  readonly start: number;
  readonly end: number;
  readonly rowStartIndex: number;
  readonly rowEndIndex: number;
}
```

`path` defines which slice to fetch — empty array = root, `["Alpha"]` = expansion of group "Alpha", `["Alpha","Beta"]` = leaf rows under those groups.

## Response Interface

`queryFn` must return `Promise<(DataResponse | DataResponsePinned)[]>`:

```ts
// Scrollable rows
interface DataResponse {
  readonly kind: "center";
  readonly data: (DataResponseLeafItem | DataResponseBranchItem)[];
  readonly size: number;         // total row count at this path
  readonly asOfTime: number;     // Unix timestamp — resolves out-of-order conflicts
  readonly path: (string | null)[];
  readonly start: number;
  readonly end: number;
}

// Leaf row
interface DataResponseLeafItem {
  readonly kind: "leaf";
  readonly id: string;
  readonly data: any;
}

// Group/branch row
interface DataResponseBranchItem {
  readonly kind: "branch";
  readonly id: string;
  readonly data: any;         // aggregated values
  readonly key: string | null;
  readonly childCount: number;
}

// Pinned rows
interface DataResponsePinned {
  readonly kind: "top" | "bottom";
  readonly data: DataResponseLeafItem[];
  readonly asOfTime: number;
}
```

## Sorting

Include sort model in `queryKey` — the source resets and refetches automatically:

```ts
const [columns, setColumns] = useState(initialColumns);

const sort = useMemo(() => {
  const col = columns.find(c => c.sort);
  if (!col) return null;
  return { columnId: col.id, isDescending: col.sort === "desc" };
}, [columns]);

const ds = useServerDataSource({
  queryFn: (params) => Server(params.requests, params.queryKey[0]),
  queryKey: [sort] as const,
});
```

## Filtering

Same pattern — put filter model in `queryKey`:

```ts
const [filters, setFilters] = useState<Record<string, GridFilter>>({});

const ds = useServerDataSource({
  queryFn: (params) => Server(params.requests, params.queryKey[0]),
  queryKey: [filters] as const,
});
```

## Grouping & Aggregations

The grid sends grouped requests using `path`. The server must return branch rows with `childCount` and optionally aggregated `data`:

```ts
// Server response for a grouped view
[{
  kind: "center",
  path: [],
  start: 0,
  end: 50,
  size: 3,    // 3 group rows at root
  asOfTime: Date.now(),
  data: [
    { kind: "branch", id: "g-usa", key: "USA", childCount: 1200, data: { avgRevenue: 50000 } },
    { kind: "branch", id: "g-gbr", key: "GBR", childCount: 800,  data: { avgRevenue: 45000 } },
  ],
}]
```

The grid sends `path: ["USA"]` when a user expands the USA group.

Set the group model on the grid (drives `model.rowGroupExpansions` in `queryFn`):

```tsx
<Grid rowSource={ds} rowGroupColumn={groupModel} onColumnsChange={setColumns} ... />
```

## Loading State & Errors

```ts
const isLoading = ds.isLoading.useValue();     // true during initial fetch
const error = ds.loadingError.useValue();      // set if queryFn rejects

// Display overlay while loading
<Grid
  slotViewportOverlay={isLoading && <LoadingOverlay />}
  ...
/>
```

> If `queryFn` catches errors internally and doesn't re-throw, the grid cannot detect failure.

## Real-Time Updates

Poll manually by calling `refresh()` or `pushRequests()`:

```ts
// Refresh current view data
ds.refresh();
// Equivalent to:
ds.pushRequests(ds.requestsForView.get());

// In a polling interval:
useEffect(() => {
  const id = setInterval(() => ds.refresh(), 5000);
  return () => clearInterval(id);
}, [ds]);
```

## Push Data from Client

Push pre-computed responses directly into the data source without a network request:

```ts
ds.pushResponses([{
  kind: "center",
  path: [],
  start: 0,
  end: 10,
  size: 10,
  asOfTime: Date.now(),
  data: [...],
}]);
```

## Optimistic Loading

Pre-fetch the next data slice before the user scrolls to it:

```ts
const requests = ds.requestsForView.useValue();
useEffect(() => {
  const view = requests.at(-1);
  if (!view) return;
  const next = ds.requestForNextSlice(view);
  if (!next || ds.seenRequests.has(next.id)) return;
  ds.seenRequests.add(next.id);
  ds.pushRequests([next]);
}, [ds, requests]);
```

Pre-fetch group children on row hover:

```tsx
events={useMemo(() => ({
  row: {
    mouseEnter: ({ layout: { rowIndex } }) => {
      const req = ds.requestForGroup(rowIndex);
      if (!req || ds.seenRequests.has(req.id)) return;
      ds.seenRequests.add(req.id);
      ds.pushRequests([req]);
    },
  },
}), [ds])}
```

## Gotchas

- **`size` must be accurate** — `size` in `DataResponse` tells the grid the total row count at that path. An incorrect value causes scroll bar sizing and row index assignment to break. Use the actual count from your database query.
- **`asOfTime` determines conflict resolution** — if two responses for the same path arrive out of order, the one with the lower `asOfTime` is silently discarded. Always use `Date.now()` or a server-provided monotonic timestamp. Responses with stale `asOfTime` that arrive after a newer one are dropped.
- **`queryFn` errors must propagate** — if your `queryFn` catches errors internally and returns an empty result, `ds.loadingError` stays `null` and the grid shows nothing with no feedback. Re-throw or return a rejected promise to surface errors.
- **`queryKey` change discards all cached data** — even adding a sort column clears everything loaded so far and triggers a full refetch from row 0. Design your `queryKey` to minimize unnecessary changes.
- **Grouped paths: `path: []` is root, not path `[""]`** — an empty array means the root slice. A non-empty array means a specific group expansion. Never pass `null` in the path array for the root request.

## Full Docs

- [Server Overview](/docs/server-data-loading-overview)
- [Data Interface](/docs/server-data-loading-interface)
- [Server Row Data](/docs/server-data-loading-row-data)
- [Server Row Sorting](/docs/server-data-loading-row-sorting)
- [Server Row Filtering](/docs/server-data-loading-row-filtering)
- [Server Grouping & Aggregation](/docs/server-data-loading-row-grouping-and-aggregation)
- [Data Updates](/docs/server-data-loading-row-updating)
- [Push and Pull](/docs/server-data-loading-push-and-pull)
- [Optimistic Loading](/docs/server-data-loading-optimistic-loading)
- [Handling Load Failures](/docs/server-data-loading-handling-load-failures)
