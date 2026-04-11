# Grid Core — Component, Reactivity & API

## Basic Setup

LyteNyte Grid is a React component. Import `Grid` and a row source, then wire them together:

```tsx
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  data: MyRowType;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "name", width: 200 },
  { id: "price", type: "number", width: 100 },
];

export default function MyGrid() {
  const ds = useClientDataSource<GridSpec>({ data: myData });

  return (
    <div style={{ height: 500 }}>
      <Grid columns={columns} rowSource={ds} />
    </div>
  );
}
```

## Container Sizing

The grid fills its parent — **the parent must have a defined size**. The grid is the sole child of its container.

```tsx
// Fixed height (simplest)
<div style={{ height: 500 }}>
  <Grid ... />
</div>

// Flex layout
<div style={{ height: 500, display: "flex", flexDirection: "column" }}>
  <div style={{ flex: "1", position: "relative" }}>
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Grid ... />
    </div>
  </div>
</div>

// CSS Grid layout
<div style={{ display: "grid", gridTemplateRows: "500px" }}>
  <Grid ... />
</div>
```

## Reactivity — Props as State

LyteNyte Grid is declarative. Updating props updates the view. Memoize non-primitive props to avoid unnecessary re-renders:

```tsx
function MyGrid() {
  const columns = useMemo(() => [
    { id: "name", widthFlex: 2 },
    { id: "price", type: "number" },
  ], []);

  return <Grid columns={columns} />;
}
```

**Avoid** passing inline objects/arrays without memoization — they create new references on every render and trigger expensive re-layouts.

The [React Compiler](https://react.dev/learn/react-compiler/introduction) eliminates this concern entirely and is recommended for LyteNyte Grid projects.

## Controlled State

Certain grid properties are controllable — provide a value to control them, and an `onChange` handler to receive updates:

```tsx
const [rowDetailExpansions, setRowDetailExpansions] = useState({});

<Grid
  rowDetailExpansions={rowDetailExpansions}
  onRowDetailExpansionsChange={setRowDetailExpansions}
/>
```

Controllable properties include: `rowDetailExpansions`, `columnGroupExpansions`, `rowGroupColumn`.

`columns` is **always controlled** — you must provide `onColumnsChange` if you want the grid to update column state:

```tsx
const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([...]);

<Grid columns={columns} onColumnsChange={setColumns} />
```

## Getting the API via Ref

```tsx
const ref = useRef<Grid.API | null>(null);

<Grid ref={ref} ... />

// Later:
ref.current?.columnUpdate({ colId: { name: "New Name" } });
```

The API object reference **never changes** — it is not a reactive value.

## API Extensions

Add custom methods to the grid API via `apiExtension`. All cell/row renderers can access these via the `api` prop.

```tsx
const extension = useMemo(() => ({
  notify: (msg: string) => alert(msg),
}), []);

<Grid apiExtension={extension} ... />
```

When the extension needs to call grid API methods, use the function form:

```tsx
const apiExtension = useMemo<(api: Grid.API<GridSpec>) => GridSpec["api"]>(() => {
  return (api) => ({
    updateHeaderName: (newName: string, id: string) => {
      api.columnUpdate({ [id]: { name: newName } });
    },
  });
}, []);
```

> **Do not** call `api` methods inside the factory function itself — only capture the reference and use it in the returned methods.

### Reactive State in Extensions — `usePiece`

The API reference is stable (non-reactive). To share reactive state across renderers, use `usePiece`:

```tsx
import { usePiece, type PieceWritable } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  readonly api: { editing: PieceWritable<string | null> };
}

function MyGrid() {
  const [editing, setEditing] = useState<string | null>(null);
  const editing$ = usePiece(editing, setEditing);

  const extension = useMemo(() => ({ editing: editing$ }), [editing$]);

  return <Grid<GridSpec> apiExtension={extension} ... />;
}

// In a cell renderer:
function MyCell({ api }: Grid.T.CellParams<GridSpec>) {
  const editing = api.editing.useValue(); // reactive read
  return <div>{editing}</div>;
}
```

`usePiece(value)` — readonly piece. `usePiece(value, setter)` — read-write piece.

## Typing the Grid — GridSpec

```tsx
interface GridSpec {
  readonly data: MyRowType;           // row data type
  readonly column?: { myProp?: string }; // per-column custom props
  readonly api?: { myMethod: () => void }; // API extension type
}

<Grid<GridSpec> columns={columns} rowSource={ds} />
```

## Row Source

The grid requires a `rowSource` prop. Use one of the provided hooks:

- `useClientDataSource` — client-side data (see [client-data-source.md](./client-data-source.md))
- `useServerDataSource` — server-side/viewport loading (see [server-data-source.md](./server-data-source.md))
- `useTreeDataSource` — nested object hierarchies (see [tree-data-source.md](./tree-data-source.md))

The API also exposes all `RowSource` methods (e.g. `api.rowsSelected()`, `api.rowById()`).

## Headless Mode

By default `<Grid />` renders all parts automatically. For custom layouts, pass `children` and compose parts explicitly:

```tsx
<Grid>
  <Grid.Viewport>
    <Grid.Header />
    <Grid.RowsContainer>
      <Grid.RowsTop />
      <Grid.RowsCenter />
      <Grid.RowsBottom />
    </Grid.RowsContainer>
  </Grid.Viewport>
</Grid>
```

Full headless mode (render every cell yourself):

```tsx
<Grid>
  <Grid.Viewport>
    <Grid.Header>
      {(cells) => (
        <Grid.HeaderRow>
          {cells.map((c) =>
            c.kind === "group"
              ? <Grid.HeaderGroupCell cell={c} key={c.idOccurrence} />
              : <Grid.HeaderCell cell={c} key={c.id} />
          )}
        </Grid.HeaderRow>
      )}
    </Grid.Header>
    <Grid.RowsContainer>
      <Grid.RowsCenter>
        {(row) => {
          if (row.kind === "full-width") return <Grid.RowFullWidth row={row} />;
          return (
            <Grid.Row key={row.id} row={row}>
              {row.cells.map((cell) => <Grid.Cell cell={cell} key={cell.id} />)}
            </Grid.Row>
          );
        }}
      </Grid.RowsCenter>
    </Grid.RowsContainer>
  </Grid.Viewport>
</Grid>
```

Note: for `HeaderGroupCell`, use `c.idOccurrence` as the key (group headers can repeat across splits).

## Virtualization

Virtualization is enabled by default — only visible rows/columns are in the DOM. Configure overscan:

```tsx
<Grid
  rowOverscanTop={3}
  rowOverscanBottom={3}
  colOverscanStart={2}
  colOverscanEnd={2}
/>
```

Disable for small datasets or print scenarios:

```tsx
<Grid virtualizeRows={false} virtualizeCols={false} />
```

**Key implication:** Don't store state inside cell components — it will be lost when the row unmounts. Keep state higher in the tree or in the API extension.

## Gotchas

- **The API ref is stable, not reactive** — `ref.current` always points to the same object. Do not call API methods during render (e.g., `const x = api.columnView()` inside a component body) — call them in event handlers or effects.
- **Do not call grid API methods inside the `apiExtension` factory** — the factory runs during render. Only capture the `api` reference; use it inside the returned methods.
- **`columns` is always controlled** — omitting `onColumnsChange` means column reorders, resizes, and visibility changes are silently discarded.
- **Memoize the `apiExtension` object** — a new object reference on every render triggers re-computation inside the grid. Wrap in `useMemo`.

## Full Docs

- [Grid Reactivity](/docs/grid-reactivity)
- [Grid Container](/docs/grid-container)
- [Headless Parts](/docs/grid-headless-parts)
- [API Extensions](/docs/grid-api-extensions)
- [Virtualization](/docs/grid-virtualization)
- [React Compiler](/docs/grid-react-compiler)
