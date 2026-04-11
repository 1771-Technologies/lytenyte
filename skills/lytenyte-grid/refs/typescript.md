# TypeScript

## Step-by-Step: Fully Typed Grid

```ts
// 1. Define the row data shape
interface OrderData {
  id: number;
  product: string;
  price: number;
  customer: string;
}

// 2. Define GridSpec — combine all extensions
interface GridSpec {
  readonly data: OrderData;
  readonly column?: { sort?: "asc" | "desc" | null }; // custom column props
  readonly source?: RowSourceClient<GridSpec>;         // unlock rowAdd/rowDelete on API
  readonly api?: {                                     // custom API extensions
    filterModel: PieceWritable<Record<string, unknown>>;
  };
}

// 3. Type your columns
const columns: Grid.Column<GridSpec>[] = [
  { id: "id", name: "ID", type: "number", width: 60 },
  { id: "product", name: "Product", cellRenderer: ProductCell },
  { id: "price", name: "Price", type: "number", cellRenderer: PriceCell },
];

// 4. Type your cell renderers
function ProductCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row)) return null;
  return <span>{row.data.product}</span>; // row.data is OrderData
}

// 5. Render — pass GridSpec to Grid
<Grid<GridSpec> columns={columns} rowSource={ds} />
```

## GridSpec

`GridSpec` is the central type parameter. Define one interface per grid instance:

```ts
interface GridSpec {
  readonly data: MyRowType;               // shape of each row's data
  readonly column?: { sort?: "asc" | "desc" | null };  // column extensions
  readonly source?: RowSourceClient<GridSpec>;          // row source type
  readonly api?: { notifyUser: (msg: string) => void }; // API extensions
}
```

All four fields are optional. The `Grid` namespace reads them:

```ts
type Props  = Grid.Props<GridSpec>;
type Col    = Grid.Column<GridSpec>;
type API    = Grid.API<GridSpec>;
```

### `data`

Drives `row.data` typing throughout the grid. Cell renderers, filter functions, and sort functions all infer from it:

```ts
interface GridSpec { readonly data: { name: string; price: number } }

// ✓ Type-safe
const filter: Grid.T.FilterFn<GridSpec["data"]> = (row) => row.data.price > 50;
```

### `column`

Extends `Grid.Column` with additional properties. Columns gain the extra fields:

```ts
interface GridSpec {
  readonly column: { sort?: "asc" | "desc" | null };
}

// Equivalent to:
interface MyColumn extends Grid.Column {
  readonly sort?: "asc" | "desc" | null;
}

// Usage:
const col: Grid.Column<GridSpec> = { id: "price", sort: "asc" };
```

### `source`

Restricts which row source is expected and unlocks source-specific API methods:

```ts
import { RowSourceClient } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  readonly source: RowSourceClient<GridSpec>;
}
// api.rowAdd, api.rowDelete etc. are now typed
```

Common source types: `RowSourceClient<GridSpec>`, `RowSourceServer`, `RowSourceTree<GridSpec>`.

### `api`

Adds custom methods/state to the grid API via `apiExtension`. Must match the extension object:

```ts
interface GridSpec {
  readonly api: {
    filterModel: PieceWritable<Record<string, GridFilter>>;
    updateHeaderName: (name: string, id: string) => void;
  };
}

// apiExtension must return a value matching GridSpec["api"]
const apiExtension = useMemo<(api: Grid.API<GridSpec>) => GridSpec["api"]>(
  () => (api) => ({
    filterModel: /* PieceWritable instance */,
    updateHeaderName: (name, id) => api.columnUpdate({ [id]: { name } }),
  }),
  []
);
```

---

## Type Namespaces

`Grid` is both the root component and a type namespace:

```tsx
// Component use:
<Grid<GridSpec> ... />

// Type use:
function Wrapper<K extends Grid.GridSpec>(props: Grid.Props<K>) {
  return <Grid {...props} />;
}
```

Sub-namespaces:

- `Grid.T` — auxiliary types for renderers/params
- `Grid.Component` — props for headless component parts

### Renderer Types

Two equivalent ways to type a cell renderer:

```ts
// Method 1 — from column type
const MyCell: Grid.Column<GridSpec>["cellRenderer"] = (props) => { ... };

// Method 2 — explicit params type
function MyCell(props: Grid.T.CellRendererParams<GridSpec>) { ... }
```

Other renderer param types:

```ts
Grid.T.HeaderParams<GridSpec>      // header renderer
Grid.T.EditParams<GridSpec>        // edit renderer
Grid.T.CellRendererParams<GridSpec> // cell renderer
```

Derive renderer types from the column:

```ts
type CellRenderer   = Required<Grid.Column<GridSpec>>["cellRenderer"];
type HeaderRenderer = Required<Grid.Column<GridSpec>>["headerRenderer"];
type EditRenderer   = Required<Grid.Column<GridSpec>>["editRenderer"];
```

---

## RowNode Types

```ts
import type { RowLeaf, RowGroup, RowAggregated, RowNode } from "@1771technologies/lytenyte-pro";

// Type guard in renderers:
function MyCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row)) return null;
  // row.data is now typed as GridSpec["data"]
  return <span>{row.data.name}</span>;
}
```

Row types:
- `RowLeaf<T>` — leaf row with `row.data: T`
- `RowGroup` — group/branch row with `row.id`, `row.depth`, `row.parentId`
- `RowAggregated` — aggregated row
- `RowNode<T>` — union of all three

---

## FilterFn Typing

```ts
type FilterFn<T> = (row: RowLeaf<T>) => boolean;

const priceFilter: Grid.T.FilterFn<GridSpec["data"]> = (row) =>
  row.data.price > 100;
```

---

## Events Typing

```ts
<Grid
  events={useMemo<Grid.Events<GridSpec>>(() => ({
    cell: {
      click: ({ row, column, event, api }) => { ... },
    },
    viewport: {
      keyDown: ({ event }) => { ... },
    },
  }), [])}
/>
```

---

## Gotchas

- **`RowSourceClient<this>` uses a circular reference** — the `this` keyword in `readonly source: RowSourceClient<this>` is intentional TypeScript self-referencing. If your editor flags it, ensure `tsconfig` has `"strict": true` and TypeScript 4.9+.
- **`Grid.T` vs `Grid.Component`** — `Grid.T` is for renderer/callback params (e.g. `CellRendererParams`, `HeaderParams`). `Grid.Component` is for the headless component props (e.g. `Grid.Component.CellProps`). Use `Grid.T` for most custom component work.
- **Avoid `Grid.Column[]` without a `GridSpec`** — typing columns as `Grid.Column[]` (no spec) loses all `row.data` type safety in renderers. Always parameterize: `Grid.Column<GridSpec>[]`.
- **`Grid.API<GridSpec>` includes both the base API and `GridSpec["api"]` extensions** — when typing a helper that receives the API, use `Grid.API<GridSpec>` to get access to both. Using just `Grid.API` (no spec) drops extension types.

## Full Docs

- [TypeScript Guide](/docs/prodready-typescript)
- [Grid Props Reference](/docs/reference/grid-props)
- [Column Reference](/docs/reference/column)
- [Grid API Reference](/docs/reference/grid-api)
- [Grid Types Reference](/docs/reference/grid-types)
