# Cells — Renderers, Tooltips & Diff Flashing

## Cell Renderers

A cell renderer is a standard React component assigned to a column's `cellRenderer` property. It receives `Grid.T.CellRendererParams<GridSpec>` as props:

```tsx
function ProductCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  // Guard against group/aggregated rows when you only care about leaf data
  if (!api.rowIsLeaf(row) || !row.data) return null;

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img src={row.data.thumbnail} alt={row.data.name} />
      <span>{row.data.name}</span>
    </div>
  );
}

// Assign to column:
{ id: "product", cellRenderer: ProductCell }

// Or as a default for all columns via columnBase:
const base: Grid.ColumnBase<GridSpec> = { cellRenderer: DefaultCell };
```

### Key Props on `CellRendererParams`

| Prop       | Description                                        |
| ---------- | -------------------------------------------------- |
| `row`      | `RowNode` — the row data (`row.data` on leaf rows) |
| `column`   | Column definition                                  |
| `api`      | Grid API + row source methods                      |
| `rowIndex` | Current rendered row index (0-based)               |
| `selected` | `boolean` — whether the row is selected            |
| `colIndex` | Column index in the current view                   |

### Reading Cell Values

Use `api.columnField(column, row)` to read the cell value for any row type (handles leaf, group, aggregated uniformly).
If the use case requires it, the data for a cell can be directly read off the `row`, e.g. `row.data.x`.

```tsx
function PriceCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  const value = api.columnField(column, row);
  if (typeof value !== "number") return <span>—</span>;
  return <span>${value.toFixed(2)}</span>;
}
```

### Cell Renderers Are Standard React

- They live in your application's React tree — they can read context, use hooks, access state
- No proprietary grid component patterns needed
- Keep renderers lightweight — the grid renders thousands of cells per update

### State & Virtualization Warning

LyteNyte Grid virtualizes rows — cells unmount/remount as they scroll in/out of view. **Do not use `useState` inside cell renderers for persistent state** — it resets on unmount.

Instead, lift state above the grid:

```tsx
// ✓ Correct — state lives in a context above the grid
function MyGrid() {
  return (
    <MyCellStateProvider>
      <Grid ... />
    </MyCellStateProvider>
  );
}

// Or store state in the API extension (see grid-core.md)
```

## Tooltips & Popovers

LyteNyte Grid is unopinionated — use any tooltip library directly inside a cell renderer:

```tsx
import * as Tooltip from "@radix-ui/react-tooltip";

function SymbolCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  return (
    <Tooltip.Root delayDuration={100}>
      <Tooltip.Trigger asChild>
        <div>{row.data.symbol}</div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Network: {row.data.network}</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
```

### Popover on Cell Focus (Alternative Pattern)

Instead of embedding a popover in every cell renderer, listen to cell focus events and render a single shared popover as a grid sibling:

```tsx
const [anchor, setAnchor] = useState<HTMLElement | null>(null);
const [detail, setDetail] = useState<string | null>(null);

<Grid
  events={useMemo(() => ({
    cell: {
      focus: ({ column, event, row, api }) => {
        if (column.id !== "symbol" || !api.rowIsLeaf(row)) return;
        setDetail(row.data.network);
        setAnchor(event.target);
      },
      blur: () => { setDetail(null); setAnchor(null); },
    },
  }), [])}
/>
<MyPopover anchor={anchor} open={!!detail}>
  {detail}
</MyPopover>
```

## Cell Diff Flashing

Flash a cell on value change using `useRef` to track the previous value and triggering a CSS animation:

```tsx
function NumberCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as number;
  const prevRef = useRef(field);
  const prev = prevRef.current;
  const diff = field - (prev ?? field);

  if (prev !== field) prevRef.current = field;

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.animation = "none";
    requestAnimationFrame(() => {
      ref.current!.style.animation = "flash 1s ease-out forwards";
    });
  }, [diff]);

  return <div ref={ref}>{typeof field === "number" ? formatter.format(field) : "—"}</div>;
}
```

CSS for the flash animation:

```css
@keyframes flash {
  0% {
    background-color: rgba(255, 255, 0, 0.5);
  }
  100% {
    background-color: transparent;
  }
}
```

### Enhanced: Show Delta

Display the direction and magnitude of the change alongside the value:

```tsx
{
  diff !== 0 && (
    <div
      ref={deltaRef}
      className={diff < 0 ? "text-red-500" : "text-green-500"}
      style={{ animation: "fadeOut 3s ease-out forwards" }}
    >
      {diff < 0 ? "▼" : "▲"} {Math.abs(diff).toFixed(2)}
    </div>
  );
}
```

## Gotchas

- **`api.columnField(column, row)` is the safe way to read values** — it handles all row types (leaf, group, aggregated) uniformly. Direct `row.data[column.id]` fails for group rows (no `data`) and ignores custom `field` definitions.
- **Popover/tooltip libraries need portals to escape grid clipping** — the grid clips its cells. A tooltip anchored to a cell element will be clipped by the cell's overflow boundary unless it renders in a portal (e.g. `Tooltip.Portal` in Radix UI).
- **Cell renderers receive new props on every render** — do not use deep equality checks or memoize based on props inside renderers. The grid controls when renderers re-render; hook into that rather than trying to suppress it.
- **`useRef` for diff tracking, not `useState`** — for diff flashing, tracking the previous value with `useRef` works across virtualization remounts. `useState` would reset on unmount and produce false "new value" flashes for rows that just scrolled back into view.

## Cell Range Selection

### Enabling Cell Selection

Set `cellSelectionMode` on the grid:

```tsx
<Grid cellSelectionMode="range"       ... />  // single contiguous range
<Grid cellSelectionMode="multi-range" ... />  // multiple ranges (Ctrl/Cmd + drag to add)
<Grid cellSelectionMode="none"        ... />  // disabled (default)
```

Users click and drag to select. In `"multi-range"` mode, hold **Ctrl** or **Cmd** to add or deselect ranges.

### Reading the Selection (Uncontrolled)

When uncontrolled, call `api.cellSelections()` to get the current selection rectangles at any time:

```ts
const rects = api.cellSelections(); // DataRect[] | null
```

`DataRect` uses **exclusive** `rowEnd` and `columnEnd` (like `Array.slice`):

```ts
interface DataRect {
  readonly rowStart: number;    // inclusive
  readonly rowEnd: number;      // exclusive
  readonly columnStart: number; // inclusive
  readonly columnEnd: number;   // exclusive
}
```

### Copy to Clipboard (Ctrl+C / Cmd+C)

Listen for the keyboard shortcut in the `viewport.keyDown` event, read the selection rect, export the data, and write to the clipboard. The `viewport` parameter is the grid's DOM element — add/remove a CSS class on it for copy-flash visual feedback.

```tsx
<Grid
  cellSelectionMode="range"
  events={useMemo<Grid.Events<GridSpec>>(
    () => ({
      viewport: {
        keyDown: async ({ event: ev, viewport: vp, api }) => {
          if (ev.key === "c" && (ev.metaKey || ev.ctrlKey)) {
            const rect = api.cellSelections()?.[0];
            if (!rect) return;

            const exported = await api.exportData({ rect });

            // Tab-separated rows for spreadsheet paste (Excel, Google Sheets)
            const text = exported.data
              .map((row) => row.map((cell) => `${cell ?? ""}`).join("\t"))
              .join("\n");

            await navigator.clipboard.writeText(text);

            // Optional: flash the selection overlay for visual feedback
            vp.classList.add("copy-flash");
            setTimeout(() => vp.classList.remove("copy-flash"), 500);
          }
        },
      },
    }),
    [],
  )}
/>
```

Add the CSS animation targeting the selection overlay element:

```css
@keyframes copy-flash {
  0%   { background-color: var(--ln-primary-10); }
  50%  { background-color: var(--ln-primary-30); }
  100% { background-color: var(--ln-primary-10); }
}

.copy-flash [data-ln-cell-selection-rect] {
  animation: copy-flash 0.5s ease-out forwards;
}
```

**Key points:**
- `api.exportData({ rect })` is `async` — always `await` it before writing to clipboard
- `exported.data` is a 2D array (row-major): `data[rowIndex][colIndex]`
- Use `\t` between cells and `\n` between rows for Excel/Google Sheets paste compatibility
- For `"multi-range"` mode, `api.cellSelections()` returns multiple rects — use `[0]` for the primary selection or implement merge logic
- `navigator.clipboard.writeText` requires HTTPS or localhost
```

### Controlled Cell Selection

Manage selection state in React when you need to react to changes (e.g., show a status bar with aggregate values):

```tsx
const [cellSelections, setCellSelections] = useState<Grid.T.DataRect[]>([]);

<Grid cellSelectionMode="range" cellSelections={cellSelections} onCellSelectionChange={setCellSelections} />;
```

> **Warning:** `cellSelections` is both a grid **prop** (controlled state) and an **API method** (`api.cellSelections()`). In controlled mode, the API method returns the same value you passed in. In uncontrolled mode, the API method reads internal state.

### Programmatic Selection

Set any rectangle directly by passing it as the `cellSelections` prop or calling the API setter:

```tsx
// Select column 0–2, rows 0–9 (rows 0 through 8 inclusive)
setCellSelections([{ rowStart: 0, rowEnd: 10, columnStart: 0, columnEnd: 3 }]);
```

### Selecting an Entire Column or Row

Column and row selection work by setting a `cellSelections` rectangle that spans the full extent:

```tsx
// Column selection — click on header to select entire column
function HeaderCell({ column, colIndex, api }: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div
      onClick={() => {
        const { rowStart, rowEnd } = api.rowBounds(); // get full row range
        setCellSelections([{ rowStart, rowEnd, columnStart: colIndex, columnEnd: colIndex + 1 }]);
      }}
    >
      {column.name ?? column.id}
    </div>
  );
}
```

Set `cellSelectionMaintainOnNonCellPosition` to prevent the selection clearing when headers receive focus.

### Styling Selection Rectangles

LyteNyte Grid renders inert `div` overlays to visualize selections. They are unstyled by default. Target their data attributes:

```css
[data-ln-cell-selection-rect] {
  background-color: var(--ln-primary-10);
  box-sizing: border-box;
}
[data-ln-cell-selection-rect][data-ln-cell-selection-border-top="true"] {
  border-top: 1px solid var(--ln-primary-50);
}
[data-ln-cell-selection-rect][data-ln-cell-selection-border-bottom="true"] {
  border-bottom: 1px solid var(--ln-primary-50);
}
[data-ln-cell-selection-rect][data-ln-cell-selection-border-start="true"] {
  border-inline-start: 1px solid var(--ln-primary-50);
}
[data-ln-cell-selection-rect][data-ln-cell-selection-border-end="true"] {
  border-inline-end: 1px solid var(--ln-primary-50);
}
/* Deselect range in multi-range mode */
[data-ln-cell-selection-rect][data-ln-cell-selection-is-deselect="true"] {
  background-color: var(--ln-red-30);
}
```

Header cells of columns containing selected cells get `data-ln-cell-selected="true"`. Rows containing selected cells also get this attribute:

```css
[data-ln-header-cell="true"][data-ln-cell-selected="true"] {
  background-color: var(--ln-primary-05);
}
```

### Excluding the Marker Column

By default, selection can include the marker column. Prevent this:

```tsx
<Grid cellSelectionExcludeMarker ... />
```

Even with this enabled, the marker column still occupies column index 0 — so the first visible data column is index 1.

### Spanning Cells and Pinned Areas

- **Spanning cells:** When a selection includes a spanning cell, LyteNyte Grid expands the selection rectangle to cover the full span automatically.
- **Pinned areas:** Dragging from a scrollable area into pinned rows/columns requires the viewport to be scrolled to the pinned edge first. Once at the edge, selection expands into the pinned region. The `cellSelections` state always contains a single continuous rectangle even when visually split.

### Cell Selection Keyboard Shortcuts

| Key               | Action                  |
| ----------------- | ----------------------- |
| `Shift ↑↓←→`      | Expand/shrink selection |
| `Ctrl Shift ↑↓←→` | Expand to bounds        |
| `Ctrl A`          | Select all cells        |

### Gotchas for Cell Selection

- **`cellSelections` name collision** — `api.cellSelections()` is a method, `cellSelections` is a prop. Controlled mode returns your prop value from the method. Don't confuse the two.
- **`rowEnd`/`columnEnd` are exclusive** — `{ rowStart: 0, rowEnd: 5 }` selects rows 0–4. Passing `rowEnd: 4` would select rows 0–3. This matches `Array.slice` semantics.
- **Multi-range and clipboard complexity** — with `"multi-range"` mode, `api.cellSelections()` returns multiple rectangles. Copy operations must decide which rectangle to use (typically the last one, or merge them).
- **Marker column index offset** — with `cellSelectionExcludeMarker` active, the marker column still uses index 0, so your first data column is index 1. Account for this when constructing `DataRect` values programmatically.

## Full Docs

- [Cell Renderers](/docs/cell-renderers)
- [Cell Tooltips & Popovers](/docs/cell-tooltips)
- [Cell Diff Flashing](/docs/cell-diff-flashing)
- [Cell Range Selection](/docs/cell-selection)
