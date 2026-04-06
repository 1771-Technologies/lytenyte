# Filtering

All filter types in LyteNyte Grid are custom predicate functions you write. The grid has no built-in filter UI — you build the model and UI, and pass functions to the data source.

Filters apply to **leaf rows before** grouping and aggregation. For post-grouping filtering, see `having` filters in [client-data-source.md](./client-data-source.md).

## How Filters Work

Pass a `filter` function (or array of functions) to your data source:

```ts
// Single filter
const ds = useClientDataSource({ data, filter: myFilterFn });

// Multiple filters (array — ALL must return true to keep a row)
const ds = useClientDataSource({ data, filter: [textFilter, numberFilter] });
```

A filter function has this signature:

```ts
type FilterFn<T> = (row: RowLeaf<T>) => boolean;
```

Return `true` to keep the row, `false` to exclude it.

## Text Filtering

```ts
// Simple contains
const filter: Grid.T.FilterFn<GridSpec["data"]> = (row) =>
  row.data.product.toLowerCase().includes("xbox");

// Case-insensitive with Intl.Collator
const collator = new Intl.Collator("en", { sensitivity: "case" });
const filter: Grid.T.FilterFn<GridSpec["data"]> = (row) =>
  collator.compare("xbox", row.data.product.toLowerCase()) === 0;
```

### Text Filter Model Pattern

```ts
type FilterStringOperator =
  | "equals" | "not_equals"
  | "contains" | "not_contains"
  | "begins_with" | "not_begins_with"
  | "ends_with" | "not_ends_with";

const evaluate = (op: FilterStringOperator, compare: string, value: string): boolean => {
  if (op === "equals")       return compare === value;
  if (op === "contains")     return compare.includes(value);
  if (op === "begins_with")  return compare.startsWith(value);
  if (op === "ends_with")    return compare.endsWith(value);
  if (op === "not_equals")   return compare !== value;
  if (op === "not_contains") return !compare.includes(value);
  if (op === "not_begins_with") return !compare.startsWith(value);
  if (op === "not_ends_with")   return !compare.endsWith(value);
  return false;
};

// Build filter function from model
const filterFn = useMemo(() => {
  return Object.entries(filterModel).map(([col, f]) =>
    (row: Grid.T.RowLeaf<GridSpec["data"]>) => {
      const value = (row.data as any)[col];
      if (typeof value !== "string") return false;
      const v = value.toLowerCase();
      const left = evaluate(f.left.operator, v, f.left.value.toLowerCase());
      if (!f.right) return left;
      const right = evaluate(f.right.operator, v, f.right.value.toLowerCase());
      return f.operator === "OR" ? left || right : left && right;
    }
  );
}, [filterModel]);
```

## Number Filtering

```ts
// Simple predicate
const filter: Grid.T.FilterFn<GridSpec["data"]> = (row) => row.data.price > 50;
```

### Number Filter Model Pattern

```ts
type FilterNumberOperator =
  | "equals" | "not_equals"
  | "greater_than" | "greater_than_or_equals"
  | "less_than" | "less_than_or_equals";

const evaluate = (op: FilterNumberOperator, compare: number, value: number): boolean => {
  if (op === "equals")                  return compare === value;
  if (op === "not_equals")              return compare !== value;
  if (op === "greater_than")            return compare > value;
  if (op === "greater_than_or_equals")  return compare >= value;
  if (op === "less_than")               return compare < value;
  if (op === "less_than_or_equals")     return compare <= value;
  return false;
};
```

## Date Filtering

```ts
import { getYear, isAfter, isBefore, getMonth, getQuarter } from "date-fns";

// Year filter
const filter2025: Grid.T.FilterFn<GridSpec["data"]> = (row) =>
  getYear(row.data.saleDate) === 2025;
```

### Date Filter Model Pattern

```ts
type FilterDateOperator = "equals" | "before" | "after" | "quarter" | "month";

const evaluate = (op: FilterDateOperator, compare: string, value: string | number): boolean => {
  if (op === "equals")  return compare === value;
  if (op === "after")   return isAfter(compare, value as string);
  if (op === "before")  return isBefore(compare, value as string);
  if (op === "month")   return getMonth(compare) === value;
  if (op === "quarter") return getQuarter(compare) === value;
  return false;
};
```

## Quick Search (Global Search)

```ts
const [query, setQuery] = useState("");

const filterFn = useMemo(() => {
  if (!query) return null;
  const q = query.toLowerCase();
  return (row: Grid.T.RowLeaf<GridSpec["data"]>) => {
    const { name, email, product } = row.data;
    return `${name} ${email} ${product}`.toLowerCase().includes(q);
  };
}, [query]);
```

Debounce the input to avoid filtering on every keystroke:

```tsx
const t = useRef<ReturnType<typeof setTimeout> | null>(null);

<input onChange={(e) => {
  if (t.current) clearTimeout(t.current);
  t.current = setTimeout(() => setQuery(e.target.value), 100);
}} />
```

## Set Filtering

```ts
const activePaymentMethods = new Set(["Visa", "Mastercard"]);

const filterFn: Grid.T.FilterFn<GridSpec["data"]> = (row) =>
  activePaymentMethods.has(row.data.paymentMethod);
```

### Tree Set Filter

For hierarchical set filters (e.g. year > month > day), use the [Tree View component](/docs/component-tree-view) and the `RowSelectionLinked` model to track which items are selected, then build an exclusion set from deselected items.

## Sharing Filter Model via API Extension

Store the filter model in a `usePiece` and expose it via `apiExtension` so renderers (e.g. column header filter popovers) can read and update it:

```ts
interface GridSpec {
  readonly data: MyData;
  readonly api: { filterModel: PieceWritable<Record<string, GridFilter>> };
}

const [filter, setFilter] = useState<Record<string, GridFilter>>({});
const filterModel = usePiece(filter, setFilter);

const extension = useMemo(() => ({ filterModel }), [filterModel]);

<Grid<GridSpec> apiExtension={extension} ... />
```

In a column header renderer:

```tsx
function FilterHeader({ column, api }: Grid.T.HeaderParams<GridSpec>) {
  const model = api.filterModel.useValue();
  const isActive = !!model[column.id];
  // render filter icon + popover to update api.filterModel
}
```

## Server-Side Filtering

For server-side data sources, put the filter model in `queryKey`. The source resets and refetches:

```ts
const [filterModel, setFilterModel] = useState({});

const ds = useServerDataSource({
  queryFn: (params) => Server(params.requests, params.queryKey[0]),
  queryKey: [filterModel] as const,
});
```

## Gotchas

- **Filters run on leaf rows only** — they do not apply to group/branch rows. Use `having` (client source) or server-side logic for post-grouping filtering.
- **`null`/`undefined` values are your responsibility** — a filter like `row.data.price > 50` will return `false` for `null` price (since `null > 50` is false), which may not be the intended behavior. Decide explicitly: `if (row.data.price == null) return true/false`.
- **Filter arrays use AND logic** — all predicates in an array must return `true`. There is no built-in OR between array entries. Combine OR logic inside a single predicate.
- **Debounce text inputs** — every filter change triggers a full pass over all rows. Without debouncing, rapid typing causes noticeable lag on large datasets.

## Best Practices

- **Debounce text inputs** — don't filter on every keystroke
- **Handle nulls explicitly** — decide whether null values pass or fail each filter
- **Keep filter functions fast** — they run against every row
- **Order filters** cheapest-first in arrays (evaluated left-to-right, short-circuits on false)
- **Show active filter indicators** — column icons, pill counts, clear buttons

## Full Docs

- [Filtering Text](/docs/filtering-text)
- [Filtering Numbers](/docs/filtering-numbers)
- [Filtering Dates](/docs/filtering-dates)
- [Set Filtering](/docs/filtering-set-filters)
- [Quick Search](/docs/filtering-quick-search)
- [Filtering Best Practices](/docs/filtering-best-practices)
- [Client Row Filtering](/docs/client-source-filtering)
- [Client Having Filters](/docs/client-source-having-filters)
- [Client Label Filters](/docs/client-source-label-filters)
- [Server Row Filtering](/docs/server-data-loading-row-filtering)
- [Tree Filtering](/docs/tree-source-filtering)
