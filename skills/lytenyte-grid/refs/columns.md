# Columns

Columns are the primary way to configure what is displayed in LyteNyte Grid. They are always a flat array — even grouped columns stay flat.

## Minimal Column Definition

Only `id` is required. Everything else is optional:

```ts
const columns: Grid.Column<GridSpec>[] = [
  { id: "name" },
  { id: "price", type: "number", width: 100, name: "Price" },
];
```

Pass columns to the grid and provide `onColumnsChange` if you need the grid to update them:

```tsx
const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([...]);

<Grid columns={columns} onColumnsChange={setColumns} rowSource={ds} />
```

## Column ID & Name

- `id` — **required**, unique, immutable. LyteNyte Grid uses it to track and identify the column. Changing it creates a new column.
- `name` — optional display name. Falls back to `id` when not set. Used in headers and column-management components.

```ts
{ id: "purchaseDate", name: "Purchase Date" }
```

Update `name` at runtime via `api.columnUpdate`:

```ts
api.columnUpdate({ purchaseDate: { name: "Date of Purchase" } });
```

## Column Field — Reading Cell Values

`field` controls how the grid reads the cell value from row data. Defaults to the column `id` (string key lookup).

| Field type                         | Usage                               |
| ---------------------------------- | ----------------------------------- |
| `string`                           | Key on a flat object row            |
| `number`                           | Index into an array row             |
| `function`                         | Computed/derived value              |
| `{ kind: "path", path: "a.b[0]" }` | Nested object (Lodash `get` syntax) |

```ts
// String field (most common)
{ id: "customer", field: "customerName" }

// Number field (array rows, most performant)
{ id: "price", field: 3 }

// Function field (derived value)
{ id: "gbpPrice", field: (p) => p.data.usdPrice * 0.79 }

// Path field (nested object)
{ id: "jan", field: { kind: "path", path: "temps.Jan" } }
```

> `field` cannot be set in `columnBase` — it must be on each column individually.

## Column Base — Default Properties

`columnBase` provides default values merged into every column. Override any property except `field` and `pin`.

```tsx
const base: Grid.ColumnBase<GridSpec> = {
  width: 150,
  headerRenderer: MyHeader,
  cellRenderer: DefaultCell,
};

<Grid columnBase={base} ... />
```

## Column Width & Sizing

```ts
{ id: "name", width: 200 }         // fixed width
{ id: "name", widthMin: 80 }       // minimum width
{ id: "name", widthMax: 400 }      // maximum width
{ id: "name", widthFlex: 2 }       // flex ratio (similar to CSS flex)
{ id: "name", resizable: true }    // user can drag to resize
```

### Autosizing

```ts
// Autosize all columns
api.columnAutosize();

// Include header text in calculation
api.columnAutosize({ includeHeader: true });

// Specific columns only
api.columnAutosize({ columns: ["name", "price"] });

// Dry run — get widths without applying
const widths = api.columnAutosize({ dryRun: true });
```

Enable double-click-to-autosize on the grid:

```tsx
<Grid columnDoubleClickToAutosize columnBase={{ resizable: true }} ... />
```

Provide custom measurement functions when using custom renderers:

```ts
{
  id: "symbol",
  autosizeCellFn: (p) => measureText(p.row.data.symbol, p.api.viewport()).width + 24,
  autosizeHeaderFn: (p) => measureText(p.column.name ?? p.column.id, p.api.viewport()).width + 20,
}
```

## Column Visibility

```ts
{ id: "email", hide: true }   // hidden by default
```

Toggle visibility at runtime by updating the column in state:

```ts
setColumns((cols) => cols.map((c) => (c.id === "email" ? { ...c, hide: !c.hide } : c)));
```

> Avoid toggling visibility too frequently — each update triggers a layout recalculation.

## Column Pinning

```ts
{ id: "id", pin: "start" }   // pinned left (LTR) / right (RTL)
{ id: "action", pin: "end" } // pinned right (LTR) / left (RTL)
```

Uses logical CSS (`start`/`end`) so it works correctly in RTL mode. `pin` cannot be set in `columnBase`.

## Column Groups

Columns stay in a flat array. Groups are defined by `groupPath` — an array of group names forming the hierarchy:

```ts
const columns = [
  { id: "symbol", groupPath: ["Market Info"] },
  { id: "network", groupPath: ["Market Info"] },
  { id: "price", groupPath: ["Performance"] },
  { id: "volume", groupPath: ["Performance"] },
  // nested group
  { id: "city", groupPath: ["Location", "City"] },
];
```

Columns without `groupPath` span the full header height.

### Collapsible Groups

Use `groupVisibility` on columns to make a group collapsible:

```ts
{ id: "network", groupPath: ["Market Info"], groupVisibility: "open" }   // visible when expanded
{ id: "symbol",  groupPath: ["Market Info"], groupVisibility: "closed" } // visible when collapsed
{ id: "exchange",groupPath: ["Market Info"], groupVisibility: "always" } // always visible
```

Toggle programmatically:

```ts
api.columnToggleGroup(["Market Info"]);
```

Control initial expansion state:

```tsx
<Grid columnGroupDefaultExpansion={false} />
// or specify per group:
<Grid columnGroupExpansions={{ "Market Info": false }} />
```

### Group Header Renderer

```tsx
function MyGroupHeader({ groupPath, collapsible, collapsed, api }: Grid.T.HeaderGroupParams<GridSpec>) {
  return (
    <div>
      <span>{groupPath.at(-1)}</span>
      {collapsible && (
        <button onClick={() => api.columnToggleGroup(groupPath)}>
          {collapsed ? "▶" : "◀"}
        </button>
      )}
    </div>
  );
}

<Grid columnGroupRenderer={MyGroupHeader} ... />
```

## Column Header Renderer

```tsx
function MyHeader({ column, api }: Grid.T.HeaderParams<GridSpec>) {
  return <div className="header">{column.name ?? column.id}</div>;
}

// Per column:
{ id: "price", headerRenderer: MyHeader }

// Or as a default via columnBase:
const base: Grid.ColumnBase<GridSpec> = { headerRenderer: MyHeader };
```

## Column Moving (Drag Reorder)

```ts
{ id: "name", movable: true }
```

Dragging across a pinned/unpinned boundary changes the `pin` state.

Programmatic reorder:

```ts
api.columnMove({ moveColumns: ["price"], moveTarget: "name", before: true });
```

Handle drop-outside:

```tsx
<Grid
  onColumnMoveOutside={({ columns }) => {
    // e.g. hide columns dropped outside
  }}
/>
```

## Column Spanning

```ts
// Fixed span — all rows span 2 columns
{ id: "price", colSpan: 2 }

// Dynamic span — varies per row
{ id: "jan", colSpan: (p) => computeSpan(p) }
```

Cells always span toward the end (next columns). The grid skips rendering covered cells.

## Marker Column

The marker column is a special auxiliary column always pinned to the start. Not part of `columns` array.

```tsx
const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  width: 40,
  cellRenderer: MarkerCell,
  headerRenderer: () => <div className="sr-only">Actions</div>,
};

<Grid columnMarker={marker} ... />
```

Common uses: row index display, selection checkboxes.

## Column Type

The `type` property controls sorting comparison, filter behavior, and CSS alignment:

| `type`      | Sort comparison             | Filter behavior          | Default CSS                             |
| ----------- | --------------------------- | ------------------------ | --------------------------------------- |
| _(omitted)_ | String lexicographic        | Text substring match     | left-aligned                            |
| `"number"`  | Numeric (`<`/`>`)           | Numeric range comparison | `data-ln-type="number"` → right-aligned |
| `"date"`    | Date chronological          | Date range comparison    | left-aligned                            |
| `"boolean"` | Boolean (false before true) | Exact match              | left-aligned                            |

```ts
{ id: "price",  type: "number" }
{ id: "joined", type: "date" }
{ id: "active", type: "boolean" }
// default is string/text when omitted
```

Setting `type: "number"` on a price column is important — without it, `"10"` sorts before `"9"` (string order) and `"9.99"` filters incorrectly.

## Floating Header Row

A secondary header row that appears below the main column headers. Typically used for per-column filter inputs, but can render any content.

```tsx
// 1. Enable the floating row on the grid
const [floatingRowEnabled, setFloatingRowEnabled] = useState(true);
<Grid floatingRowEnabled={floatingRowEnabled} ... />

// 2. Add a floatingCellRenderer to each column that needs it
const columns: Grid.Column<GridSpec>[] = [
  {
    id: "product",
    name: "Product",
    floatingCellRenderer: ({ column, api }) => (
      <input
        className="h-full w-full px-2"
        placeholder={`Filter ${column.name ?? column.id}...`}
        onChange={(e) => {
          const v = e.target.value.toLowerCase();
          // update your filter state here
        }}
      />
    ),
  },
];
```

The floating row height is controlled by `columnFloatingHeaderHeight` on the grid.

## Gotchas

- **`field` and `pin` cannot be set in `columnBase`** — both are silently ignored there. They must be on each column individually.
- **`id` defaults as `field`** — if your column has `id: "customer"` but the row data property is `customerName`, the field lookup returns `undefined` silently. Either set `field: "customerName"` or match the id to the property name.
- **Changing `id` at runtime creates a new column** — the grid tracks columns by `id`. If you change a column's id (e.g. to rename it), the grid treats it as a column removal + addition, losing all layout state for that column. Use `name` for display names, `id` for identity.
- **`colSpan` cells must still be present in the column array** — spanned cells are not rendered, but the columns they span must still exist in the `columns` array. A missing column at the spanned position breaks the layout.
- **`widthFlex` columns require at least one non-flex column or a container of known width** — if all columns use `widthFlex`, they split the viewport equally. Set `widthMin` on flex columns to prevent them from collapsing to zero when the viewport is narrow.
- **`type: "number"` is important for correctness, not just cosmetics** — without it, numbers sort lexicographically (`"10"` before `"9"`) and numeric range filters don't work. Always set `type: "number"` on numeric columns.
- **`groupPath` is the full path from root, not just the parent label** — `groupPath: ["A", "B"]` means column belongs to group "B" under group "A". `groupPath: ["B"]` would be a top-level group named "B".

## Full Docs

- [Columns Overview](/docs/columns)
- [Column Base](/docs/column-base)
- [Column Field](/docs/column-field)
- [Column Header Name](/docs/column-header-name)
- [Column Header Renderer](/docs/column-header-renderer)
- [Column Groups](/docs/column-groups)
- [Column Pinning](/docs/column-pinning)
- [Column Visibility](/docs/column-visibility)
- [Column Moving](/docs/column-moving)
- [Column Autosizing](/docs/column-autosizing)
- [Column Spanning](/docs/column-spanning)
- [Marker Column](/docs/marker-column)
