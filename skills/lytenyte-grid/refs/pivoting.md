# Pivoting (PRO)

Pivoting creates dynamic columns from the unique values of a column, then aggregates measures for each pivot intersection. Managed entirely through the **client data source**.

**Step-by-step to enable pivoting:**
1. Set `pivotMode: true` on `useClientDataSource`
2. Define a `pivotModel` with `columns` (what generates the dynamic column headers), `rows` (grouping axis), and `measures` (what to aggregate)
3. Register named aggregator functions with `aggregateFns` on the data source
4. Call `ds.usePivotProps()` inside the component and spread the result onto `<Grid />`
5. Do NOT also pass `columns` or `rowSource` directly — `usePivotProps()` provides those

## Minimum Setup

```tsx
import { useClientDataSource } from "@1771technologies/lytenyte-pro";

function PivotGrid() {
  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      columns: [{ id: "ageGroup" }],    // pivot column dimension
      rows: [{ id: "country" }],         // pivot row grouping
      measures: [
        {
          dim: { id: "profit", name: "Profit", type: "number", cellRenderer: ProfitCell, width: 120 },
          fn: "sum",
        },
      ],
    },
    aggregateFns: { sum: aggSum },
  });

  const pivotProps = ds.usePivotProps();  // must call this and spread onto Grid

  return <Grid {...pivotProps} />;
}
```

> **Always** call `ds.usePivotProps()` and spread the result onto `<Grid />` in pivot mode. This provides the generated columns and other required props.

## PivotModel Interface

```ts
interface PivotModel<Spec extends GridSpec = GridSpec> {
  readonly columns?: (Column<Spec> | PivotField<Spec>)[];   // generates dynamic pivot columns
  readonly rows?: (Column<Spec> | PivotField<Spec>)[];      // groups rows before measuring
  readonly measures?: { dim: Column<Spec>; fn: Aggregator | string }[];

  readonly sort?: SortFn;
  readonly filter?: (HavingFilterFn | null)[];
  readonly rowLabelFilter?: (LabelFilter | null)[];
  readonly colLabelFilter?: (LabelFilter | null)[];
}
```

**Behavior matrix:**

| columns | rows | measures | Result |
|---|---|---|---|
| ✓ | — | ✓ | Measure aggregated per unique column value |
| — | ✓ | ✓ | Measure aggregated per row group |
| ✓ | ✓ | ✓ | Full pivot: measures split across rows AND columns |
| — | — | ✓ | Single totals row per measure |

## Measures

A measure is a `{ dim, fn }` pair:
- `dim` — column definition used as a **template** for generated pivot columns
- `fn` — aggregator name (string) or inline `Aggregator` function

```ts
// Named aggregator (registered on the grid)
{ dim: profitColumn, fn: "sum" }

// Inline aggregator
{ dim: profitColumn, fn: (field, leafRows) => leafRows.reduce((s, r) => s + computeField<number>(field, r), 0) }
```

Register named aggregators on the `useClientDataSource` hook:

```ts
const ds = useClientDataSource({
  aggregateFns: {
    sum: (field, rows) => rows.reduce((s, r) => s + (computeField<number>(field, r) ?? 0), 0),
    avg: (field, rows) => rows.reduce((s, r) => s + (computeField<number>(field, r) ?? 0), 0) / rows.length,
  },
});
```

### Multiple Measures

```ts
measures: [
  { dim: { ...profitCol, id: "profit_sum", name: "Profit (Sum)" }, fn: "sum" },
  { dim: { ...profitCol, id: "profit_avg", name: "Profit (Avg)" }, fn: "avg" },
]
```

When using the same source column for multiple measures, give each a **unique `id`**.

## Dynamic Column Updates

Pivot columns support drag-reorder and resize by default. To control column state explicitly:

```ts
const [pivotState, setPivotState] = useState<Grid.T.PivotState>({
  columnGroupState: {},
  columnState: { ordering: [], pinning: {}, resizing: {} },
  rowGroupExpansions: { Australia: false },
});

const ds = useClientDataSource({
  pivotMode: true,
  pivotState,
  onPivotStateChange: setPivotState,
  pivotModel: { ... },
});
```

### Modify Generated Columns

Use `pivotColumnProcessor` to post-process the dynamically created columns:

```ts
const ds = useClientDataSource({
  pivotMode: true,
  pivotColumnProcessor: (columns) =>
    columns.filter(col => !col.id.includes("total")),
  pivotModel: { ... },
});
```

## Grand Totals

```ts
const ds = useClientDataSource({
  pivotMode: true,
  pivotGrandTotals: "bottom",  // "top" | "bottom"
  pivotModel: { ... },
});
```

Grand totals row is an aggregation row pinned to the specified position.

## Pivot Sorting

Pass a `sort` function inside `pivotModel`:

```ts
pivotModel: {
  sort: (a, b) => a.data.profit - b.data.profit,
  ...
}
```

## Pivot Filtering (Having & Label)

Filter group rows after aggregation inside `pivotModel`:

```ts
pivotModel: {
  filter: [null, (row) => (row.data.profit as number) > 0],  // depth-indexed having filter
  rowLabelFilter: [(label) => label !== "Unknown"],
  colLabelFilter: [(label) => label !== "N/A"],
  ...
}
```

## Column Group Expansions

Pivot column hierarchies are collapsible using the standard `api.columnToggleGroup` method. Render a custom `columnGroupRenderer` with a toggle button.

## Gotchas

- **`ds.usePivotProps()` is mandatory** — omitting it means the grid receives no pivot columns and renders empty. It must be called inside the component and its result spread onto `<Grid />` on every render.
- **Multiple measures using the same source column need unique `id`s** — the `dim.id` for each measure must be distinct. Reusing the same `id` causes one measure to silently overwrite the other.
- **`pivotColumnProcessor` runs after column generation** — it receives the fully generated pivot column array. Modifying the input array in place is not recommended; return a new array.
- **Pivot does not support `useServerDataSource`** — pivoting is a client-only feature. Server-side grouping and aggregation is handled by returning branch rows in `DataResponse`, not by `pivotMode`.

## Full Docs

- [Pivoting Overview](/docs/pivoting-overview)
- [Pivot Columns & Rows](/docs/pivoting-columns-and-rows)
- [Pivot Measures](/docs/pivoting-measures)
- [Pivot Grand Totals](/docs/pivoting-grand-totals)
- [Pivot Sorting](/docs/pivoting-sorting)
- [Pivot Filtering](/docs/pivoting-filtering)
- [Pivot State Persistence](/docs/pivoting-state-persistence)
