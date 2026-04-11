# Row Selection

## Enabling Row Selection

Two grid props control row selection:

- `rowSelectionMode` — `"none"` (default) | `"single"` | `"multiple"`
- `rowSelectionActivator` — `"none"` | `"single-click"` | `"double-click"`

```tsx
// Single-click to select one row at a time
<Grid rowSelectionMode="single" rowSelectionActivator="single-click" ... />

// Multi-select with click (shift+click for range)
<Grid rowSelectionMode="multiple" rowSelectionActivator="single-click" ... />

// Checkbox-only selection (no click-to-select)
<Grid rowSelectionMode="multiple" rowSelectionActivator="none" ... />
```

## Checkbox Selection

Use `api.rowHandleSelect` in a cell renderer for checkbox-based selection. It handles shift+click range selection automatically:

```tsx
import { Checkbox, SelectAll } from "@1771technologies/lytenyte-pro/components";

function MarkerCell({ api, selected }: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <Checkbox
      checked={selected}
      onClick={(ev) => {
        ev.stopPropagation();
        api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ")
          api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
      }}
    />
  );
}
```

Header select-all using the `SelectAll` component:

```tsx
function MarkerHeader(params: Grid.T.HeaderParams<GridSpec>) {
  return (
    <SelectAll
      {...params}
      slot={({ indeterminate, selected, toggle }) => (
        <Checkbox
          checked={selected}
          indeterminate={indeterminate}
          onClick={(ev) => { ev.preventDefault(); toggle(); }}
          onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") toggle(); }}
        />
      )}
    />
  );
}

const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: MarkerCell,
  headerRenderer: MarkerHeader,
};
```

## Select / Deselect All Programmatically

```ts
api.rowSelect({ selected: "all" });                  // select all
api.rowSelect({ selected: "all", deselect: true });  // deselect all
```

Requires `rowSelectionMode="multiple"`.

## Getting Selected Rows

```ts
const { rows, state } = ds.rowsSelected();
// or equivalently:
const { rows, state } = api.rowsSelected();

rows.forEach(row => console.log(row.data));
```

For server-side sources, only loaded rows are returned.

## Preventing Selection

Use the `onRowSelect` callback and call `preventDefault()` to block a selection:

```tsx
<Grid
  rowSelectionMode="multiple"
  rowSelectionActivator="single-click"
  onRowSelect={({ preventDefault, rows, deselect, api }) => {
    if (rows === "all" || deselect) return;

    const current = api.rowsSelected().rows;
    const finalSet = new Set([...rows, ...current.map(x => x.id)]);
    if (finalSet.size > 3) {
      alert("Maximum 3 rows");
      preventDefault();
    }
  }}
/>
```

## Row Selection State Types

The row data source manages selection state. Two modes exist:

### Isolated Selection

Each row is individually selectable — selecting a group row does NOT select children:

```ts
const ds = useClientDataSource({
  data,
  rowsIsolatedSelection: true,  // isolated mode
});
```

State shape:

```ts
interface RowSelectionIsolated {
  readonly kind: "isolated";
  readonly selected: boolean;   // default selection state
  readonly exceptions: Set<string>; // rows that invert the default
}
```

### Linked Selection (default for `"multiple"` mode)

Selecting a group row selects all its children. Selecting all children of a group selects the group:

```ts
const ds = useClientDataSource({
  data,
  rowsIsolatedSelection: false, // default
});
```

## Controlled Selection State

```ts
const [selection, setSelection] = useState<Grid.T.RowSelectionLinked>({
  kind: "linked",
  selected: false,
  children: new Map(),
});

const ds = useClientDataSource({
  data,
  rowSelection: selection,
  onRowSelectionChange: setSelection,
});
```

> Ensure the selection `kind` matches the `rowsIsolatedSelection` setting.

## Row Selection Reset Key

Selection resets automatically when the view changes significantly (grouping, filtering, sorting). Override with `rowSelectKey`:

```ts
const ds = useClientDataSource({
  data,
  rowSelectKey: [groupModel, filterFn], // shallow-compared; changes trigger reset
});
```

## ID Universe

LyteNyte Grid validates selected row IDs against the "ID universe" (all known row IDs). To preselect rows not yet loaded:

```ts
const ds = useClientDataSource({
  rowSelectionIdUniverseAdditions: [
    { id: "not-yet-loaded-row", root: true },
  ],
  rowSelectionIdUniverseSubtractions: new Set(["unselectable-row"]),
});
```

## Gotchas

- **Linked vs isolated mode must match the `kind` in controlled state** — if you use `rowsIsolatedSelection: true` but initialize state with `kind: "linked"`, selection behavior is undefined. Always match the kind.
- **`rowsSelected()` on server source returns only loaded rows** — rows not yet fetched by the viewport are absent from the result even if selected. For exhaustive selection, use isolated mode with `selected: true` (all selected) and check `exceptions`.
- **`rowHandleSelect` needs `target: ev.target`** — omitting `target` breaks shift+click range selection because the grid uses the target element to compute the anchor row.
- **`SelectAll` handles linked/isolated mode differences internally** — do not replicate its logic manually. Linked mode "select all" operates differently from isolated mode. Always use the `SelectAll` component rather than calling `api.rowSelect({ selected: "all" })` directly in a header renderer.

## Full Docs

- [Row Selection](/docs/row-selection)
