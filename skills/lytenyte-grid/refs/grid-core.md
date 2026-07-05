# Grid Core — Component, Reactivity & API

## Basic Setup

Import the `Grid` component:

```tsx
import { Grid } from "@1771technologies/lytenyte-pro";
// Or if using Core
import { Grid } from "@1771technologies/lytenyte-core";
```

Then decide on the row data source to use:

- `useClientDataSource` when the row data is available in its entirety on the client.
  See `client-data-source.md` reference.
- `useServerDataSource` when the row data exists on the server and will be loaded in slices,
  or for paginated and infinite data sources. See `server-data-source.md` reference.

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

The grid fills its parent - **the parent must have a defined size**. The grid is the sole child of its container.

Recommend using `flex` sizing, or prefer it, if the user has not specified an approach.

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

## Prop Driven

LyteNyte Grid is fully prop driven. Memoize any non-primitive value, example functions, objects and arrays.

```tsx
function MyGrid() {
  const columns = useMemo(
    () => [
      { id: "name", widthFlex: 2 },
      { id: "price", type: "number" },
    ],
    [],
  );

  return <Grid columns={columns} />;
}
```

## Controlled State

Grid properties can be controlled or uncontrolled. Leverage `useState` if the property needs to be
shared among components. For example, sharing row selection state.

```tsx
const [rowDetailExpansions, setRowDetailExpansions] = useState({});

<Grid rowDetailExpansions={rowDetailExpansions} onRowDetailExpansionsChange={setRowDetailExpansions} />;
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

Remember to type the API extension in the `GridSpec`

```tsx
interface GridSpec {
  readonly data: MyDataType;
  readonly api: {
    updateHeaderName: (newName: string, id: string) => void;
  };
}

// Then where we define our extension.
const apiExtension = useMemo<(api: Grid.API<GridSpec>) => GridSpec["api"]>(() => {
  return (api) => ({
    updateHeaderName: (newName: string, id: string) => {
      api.columnUpdate({ [id]: { name: newName } });
    },
  });
}, []);
```

> **Do not** call `api` methods inside the factory function itself — only capture the reference and use it in the returned methods.

### Reactive State in Extensions `usePiece`

To expose state that is external to the grid, but should be reactive (i.e. cause re-renders),
LyteNyte Grid exports the `usePiece` hook.

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
  readonly data: MyRowType; // row data type
  readonly column?: { myProp?: string }; // per-column custom props
  readonly api?: { myMethod: () => void }; // API extension type
}

<Grid<GridSpec> columns={columns} rowSource={ds} />;
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
            c.kind === "group" ? (
              <Grid.HeaderGroupCell cell={c} key={c.idOccurrence} />
            ) : (
              <Grid.HeaderCell cell={c} key={c.id} />
            ),
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
              {row.cells.map((cell) => (
                <Grid.Cell cell={cell} key={cell.id} />
              ))}
            </Grid.Row>
          );
        }}
      </Grid.RowsCenter>
    </Grid.RowsContainer>
  </Grid.Viewport>
</Grid>
```

Note: for `HeaderGroupCell`, use `c.idOccurrence` as the key (group headers can repeat across splits).

## Events System

LyteNyte Grid fires events for user interactions. Pass a memoized `events` object to the `events` prop:

```tsx
<Grid
  events={useMemo<Grid.Events<GridSpec>>(
    () => ({
      cell: {
        click: ({ row, column, event, api }) => {
          /* ... */
        },
        dblClick: ({ row, column, event, api }) => {
          /* ... */
        },
        contextMenu: ({ row, column, event, api }) => {
          event.preventDefault(); // suppress browser menu
          event.stopPropagation(); // prevent bubbling
        },
        focus: ({ row, column, event, api }) => {
          /* ... */
        },
        blur: ({ row, column, api }) => {
          /* ... */
        },
        mouseEnter: ({ row, column, layout, api }) => {
          /* ... */
        },
        mouseLeave: ({ row, column, api }) => {
          /* ... */
        },
      },
      headerCell: {
        click: ({ column, event, api }) => {
          /* ... */
        },
        contextMenu: ({ column, event, api }) => {
          /* ... */
        },
      },
      row: {
        click: ({ row, event, api }) => {
          /* ... */
        },
        keyDown: ({ event, row, api }) => {
          /* ... */
        },
      },
      viewport: {
        keyDown: ({ event }) => {
          /* catch-all keyboard handler */
        },
        scroll: ({ viewport }) => {
          /* viewport scroll position */
        },
        scrollEnd: ({ viewport }) => {
          /* fires when scrolling stops */
        },
      },
    }),
    [],
  )}
/>
```

**Key rules:**

- **Always memoize `events`** — a new object reference on every render triggers re-subscriptions inside the grid. Wrap in `useMemo` (or use the React Compiler).
- viewport.scrollEnd` is the correct place to implement infinite-scroll triggers (check distance from bottom, push more data).
- `row.keyDown` is preferable to `viewport.keyDown` for row-specific keyboard behavior (e.g., spacebar to select, Enter to open detail).

### Using Event Data

Cell events provide the full context: `row` (RowNode), `column`, `api`, `event` (native DOM event), and `layout` (position info). Use type guards before accessing `row.data`:

```tsx
cell: {
  click: ({ row, column, api }) => {
    if (!api.rowIsLeaf(row)) return; // guard — group rows have no row.data
    console.log(row.data.price);
  },
}
```

## Virtualization

Virtualization is enabled by default — only visible rows/columns are in the DOM. Configure overscan:

```tsx
<Grid rowOverscanTop={3} rowOverscanBottom={3} colOverscanStart={2} colOverscanEnd={2} />
```

Disable for small datasets or print scenarios:

```tsx
<Grid virtualizeRows={false} virtualizeCols={false} />
```

### Suppress Scroll Flash

Fast scrolling (e.g. dragging the scrollbar) can briefly show blank areas before new content paints.
Enable `suppressScrollFlash` to prevent this by using a synchronous scroll strategy:

```tsx
<Grid suppressScrollFlash />
```

> **Note:** This has a performance cost on lower-powered devices — users may notice dropped frames during very fast scrolling.

### Initial Viewport Dimensions

Before the viewport is measured, the grid renders nothing. Provide estimated dimensions to pre-render
content on the first paint, which is useful for SSR (Next.js, Remix):

```tsx
<Grid viewportInitialWidth={1200} viewportInitialHeight={600} />
```

## Animations

LyteNyte Grid can animate rows and columns when they are added, removed, or reordered. Animations
use the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
and run outside the React render cycle.

### Enable with Defaults

```tsx
<Grid rowAnimate columnAnimate />
```

This enables enter, exit, and move phases with a default fade/translate animation.

### Custom Animation Config

Pass a config object to control each phase independently:

```tsx
const rowAnimate = {
  move: {
    duration: 500,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  enter: {
    duration: 300,
    easing: "ease-out",
    type: () => [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
  },
  exit: {
    duration: 200,
    easing: "ease-in",
    type: () => [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-20px)" },
    ],
  },
};

const columnAnimate = {
  move: { duration: 400, easing: "ease-in-out" },
  enter: {
    duration: 250,
    easing: "ease-out",
    type: () => [
      { opacity: 0, transform: "translateX(-12px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
  },
  exit: {
    duration: 200,
    easing: "ease-in",
    type: () => [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: "translateX(12px)" },
    ],
  },
};

<Grid rowAnimate={rowAnimate} columnAnimate={columnAnimate} />;
```

The `type` field on `enter` and `exit` is a function returning `Keyframe[]` (Web Animations API format).
The `move` phase always uses a `translate` transform and does not accept a `type`.

## Gotchas

- **The API ref is stable, not reactive** — `ref.current` always points to the same object.
- **Do not call API methods during render** (e.g., `const x = api.columnView()` inside a component body) — call them in event handlers or effects.
- **Do not call grid API methods inside the `apiExtension` factory** — the factory runs during render. Only capture the `api` reference; use it inside the returned methods.
- **Memoize the `apiExtension` object** — a new object reference on every render triggers re-computation inside the grid. Wrap in `useMemo`.

## Full Docs

- [Grid Reactivity](https://www.1771technologies.com/docs/grid-reactivity)
- [Grid Container](https://www.1771technologies.com/docs/grid-container)
- [Headless Parts](https://www.1771technologies.com/docs/grid-headless-parts)
- [API Extensions](https://www.1771technologies.com/docs/grid-api-extensions)
- [Virtualization](https://www.1771technologies.com/docs/grid-virtualization)
- [Animations](https://www.1771technologies.com/docs/grid-animations)
- [React Compiler](https://www.1771technologies.com/docs/grid-react-compiler)
