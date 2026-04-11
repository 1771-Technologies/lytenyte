# Client Data Source

Use `useClientDataSource` when all row data is available in the browser. Practical upper bound: ~10,000 rows.

## Basic Setup

```tsx
import { useClientDataSource } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  readonly data: MyRowType;
}

const ds = useClientDataSource<GridSpec>({ data: myData });

<Grid rowSource={ds} columns={columns} />
```

## Updating Data

Pass a new `data` array reference. LyteNyte Grid diffs row references and only updates changed rows — reuse unchanged row objects for best performance:

```ts
const [data, setData] = useState(initialData);
const ds = useClientDataSource({ data });

// Efficient: reuse unchanged row objects
setData(prev => prev.map(row =>
  row.id === updatedId ? { ...row, price: newPrice } : row
));
```

**Tips:**
- Batch updates to 200ms–few second intervals to reduce render churn
- The source handles >10,000 updates/second even with filtering and grouping

## Pinned Rows

```ts
const ds = useClientDataSource({
  data,
  topData: [summaryRow1, summaryRow2],  // pinned at top
  botData: [totalRow],                  // pinned at bottom
});
```

Pinned rows are never filtered, sorted, or grouped.

## Row Filtering

Pass a predicate (or array of predicates) to `filter`. Filters run on **leaf rows before** grouping/aggregation:

```ts
const [filterFn, setFilterFn] = useState<Grid.T.FilterFn<GridSpec["data"]> | null>(null);

const ds = useClientDataSource({ data, filter: filterFn });

// Single filter
setFilterFn(() => (row) => row.data.paymentMethod === "Mastercard");

// Multiple filters (array — all must pass)
const ds = useClientDataSource({
  data,
  filter: [columnFilter1, columnFilter2],
});
```

See [filtering.md](./filtering.md) for text, number, date, and set filter implementations.

## Row Sorting

Pass either a **sort function** or a **dimension sort array**:

```ts
// Sort function (manual comparator)
const ds = useClientDataSource({
  data,
  sort: (a, b) => a.data.price - b.data.price,
});

// Dimension sort (declarative, preferred)
const sort = useMemo<DimensionSort<GridSpec["data"]>[]>(() => {
  const col = columns.find(c => c.sort);
  if (!col) return null;
  return [{ dim: col, descending: col.sort === "desc" }];
}, [columns]);

const ds = useClientDataSource({ data, sort });
```

Multi-way sort (array of dimensions applied in order):

```ts
const sort = [
  { dim: { id: "country" }, descending: false },
  { dim: { id: "price" }, descending: true },
];
```

Sort the auto-created group column using the special id `"__ln_group__"`:

```ts
{ dim: { id: "__ln_group__" }, descending: false }
```

## Row Grouping

Pass a **group function** or an **array of dimensions**:

```ts
// Group function (supports non-uniform / null paths)
const ds = useClientDataSource({
  data,
  group: (row) => [row.data.country, row.data.region],
});

// Non-uniform: return null to leave some rows ungrouped
const ds = useClientDataSource({
  data,
  group: (row) => row.data.education === "Secondary" ? null : [row.data.job, row.data.education],
});

// Dimension array (uniform, uses column field/id)
const ds = useClientDataSource({
  data,
  group: [countryColumn, regionColumn],
});
```

### Group Expansion

```ts
// Expand all groups by default
const ds = useClientDataSource({ data, group, rowGroupDefaultExpansion: true });

// Expand only depth 0 (top-level groups)
const ds = useClientDataSource({ data, group, rowGroupDefaultExpansion: 0 });

// Collapse all (default behavior)
const ds = useClientDataSource({ data, group, rowGroupDefaultExpansion: false });
```

Control expansions explicitly (controlled):

```ts
const [expansions, setExpansions] = useState<Record<string, boolean>>({});

const ds = useClientDataSource({
  data,
  group,
  rowGroupExpansions: expansions,
  onRowGroupExpansionChange: (delta) => setExpansions(prev => ({ ...prev, ...delta })),
});
```

Toggle programmatically:

```ts
api.rowGroupToggle(rowId);
```

### Group Collapse Behavior (PRO)

```ts
const ds = useClientDataSource({
  data,
  group,
  rowGroupCollapseBehavior: "no-collapse", // default
  rowGroupCollapseBehavior: "full-tree",   // collapse single-child groups at every depth
  rowGroupCollapseBehavior: "last-only",   // collapse single-child groups at final depth only
});
```

## Row Aggregations

Pass an `aggregate` function or dimension array to compute values for group rows:

```ts
// Aggregation function (full control)
const ds = useClientDataSource({
  data,
  group,
  aggregate: (leafRows) => ({
    price: leafRows.reduce((sum, r) => sum + r.data.price, 0) / leafRows.length,
    count: leafRows.length,
  }),
});

// Aggregation dimensions (declarative)
const aggModel = useMemo(() =>
  columns.map(col => ({ dim: col, fn: col.agg }))
, [columns]);

const ds = useClientDataSource({ data, group, aggregate: aggModel });

// Register named aggregators on the grid:
<Grid aggregateFns={{ sum: sumAggregator, avg: avgAggregator }} ... />
```

Built-in string aggregators (register via `aggregateFns`): `same`, `first`, `last`, `count`, `avg`, `sum`, `max`, `min`.

Use `computeField` to read row values inside custom aggregators:

```ts
import { computeField } from "@1771technologies/lytenyte-pro";

const sumAgg: Grid.T.Aggregator<MyData> = (field, leafRows) => {
  return leafRows.reduce((sum, row) => sum + (computeField<number>(field, row) ?? 0), 0);
};
```

## Having Filters (PRO — post-grouping)

Filter group rows **after** grouping/aggregation. Array index = group depth; use `null` to skip a depth:

```ts
const ds = useClientDataSource({
  data,
  group,
  aggregate,
  having: [
    null,                                          // skip depth 0
    (row) => (row.data.avgBalance as number) > 0,  // filter depth 1 groups
  ],
});
```

## Label Filters (PRO)

Filter group rows by their group key (label). Array index = group depth:

```ts
const labelFilter: (Grid.T.LabelFilter | null)[] = [
  (label) => label !== "Unknown",  // depth 0: exclude "Unknown" groups
  null,                             // depth 1: no filtering
];

const ds = useClientDataSource({ data, group, labelFilter });
```

## Adding Rows

```ts
const ds = useClientDataSource({
  data,
  onRowsAdded: (params) => {
    setData(prev => {
      if (params.placement === "start") return [...params.newData, ...prev];
      if (params.placement === "end") return [...prev, ...params.newData];
      const next = [...prev];
      next.splice(params.placement, 0, ...params.newData);
      return next;
    });
  },
});

// Trigger from anywhere (e.g. a button):
api.rowAdd({ data: newRow, placement: "end" });
```

## Deleting Rows

```ts
const ds = useClientDataSource({
  data,
  onRowsDeleted: (params) => {
    setData(prev => prev.filter((_, i) => !params.sourceIndices.includes(i)));
  },
});

// Trigger deletion (e.g. from a cell renderer):
api.rowDelete({ rowIndex });
```

> Use `filter` (not `splice`) when deleting — `splice` changes indices and invalidates `sourceIndices`.

## TypeScript — RowSourceClient Type

To type the extended row source API (includes `rowAdd`, `rowDelete`):

```ts
import type { RowSourceClient } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  readonly data: OrderData;
  readonly source: RowSourceClient<this>; // circular ref — use `this`
}
```

## Gotchas

- **`filter` runs only on leaf rows** — use `having` for post-grouping filtering of group rows. Passing a leaf predicate to `filter` will not affect branch/aggregated rows.
- **`topData`/`botData` are never filtered, sorted, or grouped** — they always appear pinned regardless of the current filter/sort state.
- **`onRowsDeleted`: use `filter`, not `splice`** — `splice` shifts indices and causes `sourceIndices` in the callback to reference the wrong rows.
- **`rowSelectKey` controls when selection resets** — if you forget to include the group/filter model in `rowSelectKey`, selections from a previous view persist after a filter change (stale IDs stay selected).
- **`group` function returning `null` opts that row out of grouping** — it appears as a standalone leaf outside any group, not as a top-level group entry.

## Full Docs

- [Client Source Overview](/docs/client-source-overview)
- [Client Row Data](/docs/client-source-data)
- [Client Row Filtering](/docs/client-source-filtering)
- [Client Row Sorting](/docs/client-source-row-sorting)
- [Client Row Grouping](/docs/client-source-row-grouping)
- [Client Row Aggregations](/docs/client-source-aggregations)
- [Client Row Pinning](/docs/client-source-row-pinning)
- [Client Row Adding](/docs/client-source-row-adding)
- [Client Row Deleting](/docs/client-source-row-deleting)
- [Client Having Filters](/docs/client-source-having-filters) (PRO)
- [Client Label Filters](/docs/client-source-label-filters) (PRO)
- [Row Group Collapsing](/docs/client-source-row-group-collapsing) (PRO)
