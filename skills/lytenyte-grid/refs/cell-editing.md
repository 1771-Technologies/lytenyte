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

An edit renderer is a React component receiving `Grid.T.EditParams<GridSpec>`:

```tsx
// Text editor
function TextEditor({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      value={`${editValue}`}
      onChange={(e) => changeValue(e.target.value)}
      className="h-full w-full px-2"
    />
  );
}

// Date editor (uncontrolled — avoid controlled date inputs to prevent invalid states)
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

## Handling Data Updates After Editing

When a cell is committed, the grid fires `onRowDataChange` on the row source. For the client source, implement it to write back the updated row data:

```ts
const [data, setData] = useState(initialData);

const ds = useClientDataSource({
  data,
  onRowDataChange: ({ changes }) => {
    // `changes` is an array of { row, next } pairs.
    // `row` is the RowLeaf node, `next` is the updated data object.
    setData((prev) =>
      prev.map((item) => {
        const change = changes.find((c) => c.row.data === item);
        return change ? change.next : item;
      })
    );
  },
});
```

**Step-by-step flow:**
1. User double-clicks a cell (or presses Enter) → grid enters edit mode, calls `editRenderer`
2. User modifies the value → `changeValue` / `changeData` update internal `editData`
3. User presses Enter or blurs the cell → grid runs `editMutateCommit` on all columns, then `editRowValidatorFn`
4. If valid → grid fires `onEditEnd`, then fires `onRowDataChange` on the row source with the changed rows
5. Your `onRowDataChange` callback updates `data` state → grid re-renders with new values

If validation fails (step 4) → grid fires `onEditFail` and keeps the cell in edit mode.

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
