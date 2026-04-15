# Cell Editing

## Enabling Editing

Set `editMode` on the grid:

```tsx
<Grid editMode="cell"     ... />  // single-cell editing (default is "readonly")
<Grid editMode="row"      ... />  // full-row editing
<Grid editMode="readonly" ... />  // disabled
```

Make individual columns editable with `editable` and `editRenderer`:

```ts
{
  id: "price",
  editable: true,                          // all rows editable
  editable: (row) => row.data.status !== "locked", // conditional
  editRenderer: PriceEditor,
}
```

## Edit Renderers

An edit renderer is a **standard React component** — LyteNyte Grid provides the editing state and wiring props (`editValue`, `changeValue`, `commit`, `cancel`), and you bring whatever input or UI element you need. This means you can use:

- Native HTML elements: `<input type="text">`, `<input type="number">`, `<input type="date">`, `<select>`, `<textarea>`
- Existing form components already in the project (e.g. a `NumberInput` or `DatePicker` the user already has)
- Third-party libraries: React Select, Radix UI, shadcn/ui inputs, etc.
- Custom components built from scratch

**The pattern is always the same:** read `editValue` for the initial value, call `changeValue(newVal)` when the value changes. LyteNyte Grid handles the rest.

```tsx
// Text editor — native input
function TextEditor({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      value={`${editValue}`}
      onChange={(e) => changeValue(e.target.value)}
      className="h-full w-full px-2"
    />
  );
}

// Number editor — native input, parse on change
function NumberEditor({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      type="number"
      defaultValue={typeof editValue === "number" ? editValue : ""}
      onChange={(e) => changeValue(e.target.valueAsNumber)}
      className="h-full w-full px-2 text-right"
    />
  );
}

// Select editor — native select (or drop in a SmartSelect, React Select, etc.)
function StatusEditor({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <select
      value={`${editValue}`}
      onChange={(e) => changeValue(e.target.value)}
      className="h-full w-full px-2"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="pending">Pending</option>
    </select>
  );
}

// Date editor — use uncontrolled (defaultValue) to avoid jumping on intermediate input states
function DateEditor({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) {
  const formatted = typeof editValue === "string" ? format(editValue, "yyyy-MM-dd") : "";
  return (
    <input
      type="date"
      defaultValue={formatted}
      onChange={(e) => {
        try {
          changeValue(format(new Date(e.target.value), "yyyy-MM-dd"));
        } catch {}
      }}
    />
  );
}

// Using an existing project component — just wire editValue/changeValue to its props
function PriceEditor({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <MyCurrencyInput
      value={typeof editValue === "number" ? editValue : 0}
      onValueChange={(val) => changeValue(val)}
    />
  );
}
```

### Edit Params — Key Properties

| Property          | Description                                |
| ----------------- | ------------------------------------------ |
| `editValue`       | Current value being edited (from `field`)  |
| `editData`        | Full copy of the row's data during editing |
| `changeValue(v)`  | Update `editValue` for this cell           |
| `changeData(obj)` | Update the entire `editData` object        |
| `commit()`        | Commit and end editing                     |
| `cancel()`        | Discard and end editing                    |

### Popover Editors

Use a React portal to avoid grid cell clipping. Disable `editOnPrintable` if your component uses character keys:

```ts
{ id: "product", editable: true, editRenderer: SmartSelectEditor, editOnPrintable: false }
```

## Click Activator

```tsx
<Grid editClickActivator="double-click" ... />  // default
<Grid editClickActivator="single-click"  ... />
<Grid editClickActivator="none"          ... />  // keyboard/API only
```

## Edit Value & Edit Data

When editing begins:

```ts
// Grid creates a clone of the row's data:
const editData = structuredClone(rowData);
// Then derives editValue using the column's field:
const editValue = editData[column.field ?? column.id];
```

`changeValue(v)` is equivalent to:

```ts
changeData({ ...editData, [column.field ?? column.id]: v });
```

### Custom Edit Setter

When `field` is a function or path, define `editSetter` to control how `changeValue` updates `editData`:

```ts
{
  id: "customer",
  editSetter: ({ editValue, editData }) => ({
    ...editData,
    customer: typeof editValue === "string" ? titleCase(editValue) : "-",
  }),
}
```

`editSetter` must return the **full** `editData` object.

### Edit Mutate Commit

Final chance to mutate `editData` before the grid fires edit events:

```ts
{
  id: "price",
  editMutateCommit: (p) => {
    const data = p.editData as any;
    const num = Number.parseFloat(String(data.price));
    data.price = Number.isNaN(num) ? null : num;
  },
}
```

Called for every column whenever **any** column is edited in that row.

## Linked Cell Edits

Use `changeData` to update multiple cells at once when one cell changes:

```tsx
function ProductEditor({ editValue, changeValue, changeData, editData }: Grid.T.EditParams<GridSpec>) {
  const handleSelect = (product: Product) => {
    changeData({
      ...editData,
      product: product.name,
      price: product.defaultPrice, // linked update
    });
  };
  // ...
}
```

Linked cells don't need to be editable themselves — `changeData` can update any field.

## Full Row Editing

```tsx
<Grid editMode="row" ... />
```

Double-clicking any editable cell starts editing for **all** editable cells in that row. Tab cycles between them.

## Edit Events

```tsx
<Grid
  onEditBegin={(p) => {
    /* p.preventDefault() to block */
  }}
  onEditEnd={(p) => {
    /* p.preventDefault() to block commit */
  }}
  onEditCancel={(p) => {
    /* editing was discarded */
  }}
  onEditFail={(p) => {
    /* validation failed */
  }}
/>
```

## Validation

Set `editRowValidatorFn` on the grid — runs at row level (even for single-cell edits):

```tsx
<Grid
  editMode="cell"
  editRowValidatorFn={useCallback((p) => {
    const data = p.editData as MyData;

    if (data.price <= 0) {
      return { price: "Price must be greater than 0." };
    }

    return true; // valid
    // return false; // invalid, no details
    // return { fieldId: "error message" }; // invalid, with details
  }, [])}
/>
```

The error map is keyed by a code you define. LyteNyte Grid passes it to `onEditFail`. You can display errors in the edit renderer or via a tooltip.

Recommended: use [Zod](https://zod.dev/) for schema-based validation inside `editRowValidatorFn`.

## Bulk Editing

Update many rows at once through the editing pipeline (runs validation):

```ts
// By row index (number key) or row ID (string key)
const updates = new Map(data.map((row, i) => [i, { ...row, price: row.price + 10 }]));

apiRef.current?.editUpdate(updates);
// Returns validation result — check it to provide feedback on failure
```

Update specific cells only:

```ts
api.editUpdateCells(cellUpdateMap);
```

## Programmatic API

```ts
api.editBegin({ rowIndex, columnId });
api.editEnd({ cancel: false }); // commit
api.editEnd({ cancel: true }); // cancel
api.rowIsLeaf(row); // type guard before accessing row.data
```

## Row Source Must Handle Edit Updates

**The grid never mutates row data directly.** When a cell edit is committed, LyteNyte Grid calls `onRowDataChange` on the row source. Your callback is responsible for persisting the change — updating React state, calling a server API, mutating the tree object, etc. Until the row source receives and applies the update, the grid displays the old value.

The shape of `onRowDataChange` differs by row source type:

---

### Client Source

`onRowDataChange` receives `{ center, top, bottom }`:

- `center` — `Map<number, T>` mapping **row index → new data object** for scrollable rows
- `top` / `bottom` — `Map<number, T>` for pinned rows

The map key is the **source index** (position in the original `data` array), stable across filtering/sorting.

```ts
const [data, setData] = useState(initialData);

const ds = useClientDataSource({
  data,
  onRowDataChange: ({ center }) => {
    setData((prev) => prev.map((row, i) => (center.has(i) ? center.get(i)! : row)));
  },
});
```

---

### Server Source

`onRowDataChange` receives `{ rows }`:

- `rows` — `Map<RowLeaf, T>` mapping the row node → new data object

Send the update to the server, then call `ds.refresh()` to reload the affected rows. The callback may be `async`:

```ts
const ds = useServerDataSource({
  queryFn: (params) => Server(params.requests, params.queryKey),
  queryKey: [],
  onRowDataChange: async ({ rows }) => {
    const updates = new Map([...rows.entries()].map(([rowNode, newData]) => [rowNode.id, newData]));
    await sendUpdatesToServer(updates);
    ds.refresh(); // reload from server after update
  },
});
```

#### Optimistic Updates (Server Source)

Set `rowUpdateOptimistically: true` to apply the change on the client immediately, before the server responds. The updated value shows instantly. If the server fails, you must handle rollback manually.
It's recommended to set this property to true unless there is a good reason not to.

```ts
const ds = useServerDataSource({
  queryFn: ...,
  queryKey: [],
  rowUpdateOptimistically: true,
  onRowDataChange: async ({ rows }) => {
    const updates = new Map([...rows.entries()].map(([node, data]) => [node.id, data]));
    await sendUpdatesToServer(updates);
    // skip ds.refresh() if optimistic value matches expected server result
  },
});
```

---

### Tree Source

`onRowDataChange` receives `{ changes, top, bottom }`:

- `changes` — array of `{ next, prev, parent, key, path }` objects
  - `parent` — the parent object in the tree that contains this node
  - `key` — the property name on `parent` where this node lives
  - `next` — the new data object to write

Mutate the parent in place, then update the data reference to trigger a re-render:

```ts
const [data, setData] = useState(() => structuredClone(initialData));

const ds = useTreeDataSource({
  data,
  onRowDataChange: ({ changes }) => {
    for (const { parent, key, next } of changes) {
      parent[key] = next; // mutate in place
    }
    setData({ ...data }); // new reference triggers re-render
  },
});
```

---

### Edit Lifecycle (All Sources)

1. User double-clicks (or presses Enter / a printable key) → grid enters edit mode, mounts `editRenderer`
2. User types → `changeValue` / `changeData` update internal `editData`
3. User presses Enter or focus leaves the cell → grid runs `editMutateCommit` on every column, then `editRowValidatorFn`
4. **Valid** → grid fires `onEditEnd`, then fires `onRowDataChange` on the row source
5. Row source callback updates data → grid re-renders with the new value
6. **Invalid** → grid fires `onEditFail`, cell stays in edit mode

## Gotchas

- **`editMutateCommit` fires for every column when any cell is committed** — a common mistake is writing `editMutateCommit` on a column that converts strings to numbers, but forgetting it fires even when a _different_ column is edited. The hook receives the full `editData`, so each column's `editMutateCommit` should only transform its own field and leave others untouched.
- **`editSetter` must return the full `editData` object** — returning only the changed field (e.g. `{ price: newValue }`) replaces the entire row data with a partial object. Always spread: `{ ...editData, price: newValue }`.
- **Controlled date inputs cause "jumping" bugs** — for date inputs, use `defaultValue` (uncontrolled) rather than `value` (controlled). A controlled date input can enter invalid intermediate states as the user types (e.g. `"2024-"` mid-entry), causing the input to jump. See the date editor example above.
- **Popover editors: set `editOnPrintable: false`** — if your editor component responds to keyboard input (e.g. opens a dropdown on keypress), the grid would otherwise open editing on every printable key typed while the cell is focused.
- **`editUpdate` runs through the full validation pipeline** — if validation fails, the update is rejected and the map is not partially applied. Check the return value.

## Full Docs

- [Cell Editing](/docs/cell-editing)
- [Cell Edit Renderers](/docs/cell-editing-renderers)
- [Cell Editing Validation](/docs/cell-editing-validation)
- [Full Row Editing](/docs/cell-editing-full-row)
- [Linked Cell Edits](/docs/cell-editing-linked-cell-edits)
- [Bulk Cell Editing](/docs/cell-editing-bulk-editing)
- [Server Data Editing](/docs/server-data-loading-cell-editing)
- [Tree Data Editing](/docs/tree-source-data-editing)
