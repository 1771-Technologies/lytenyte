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

| Prop | Description |
|---|---|
| `row` | `RowNode` — the row data (`row.data` on leaf rows) |
| `column` | Column definition |
| `api` | Grid API + row source methods |
| `rowIndex` | Current rendered row index (0-based) |
| `selected` | `boolean` — whether the row is selected |
| `colIndex` | Column index in the current view |

### Reading Cell Values

Use `api.columnField(column, row)` to read the cell value for any row type (handles leaf, group, aggregated uniformly):

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
        <Tooltip.Content>
          Network: {row.data.network}
        </Tooltip.Content>
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

  return (
    <div ref={ref}>
      {typeof field === "number" ? formatter.format(field) : "—"}
    </div>
  );
}
```

CSS for the flash animation:

```css
@keyframes flash {
  0%   { background-color: rgba(255, 255, 0, 0.5); }
  100% { background-color: transparent; }
}
```

### Enhanced: Show Delta

Display the direction and magnitude of the change alongside the value:

```tsx
{diff !== 0 && (
  <div
    ref={deltaRef}
    className={diff < 0 ? "text-red-500" : "text-green-500"}
    style={{ animation: "fadeOut 3s ease-out forwards" }}
  >
    {diff < 0 ? "▼" : "▲"} {Math.abs(diff).toFixed(2)}
  </div>
)}
```

## Gotchas

- **`api.columnField(column, row)` is the safe way to read values** — it handles all row types (leaf, group, aggregated) uniformly. Direct `row.data[column.id]` fails for group rows (no `data`) and ignores custom `field` definitions.
- **Popover/tooltip libraries need portals to escape grid clipping** — the grid clips its cells. A tooltip anchored to a cell element will be clipped by the cell's overflow boundary unless it renders in a portal (e.g. `Tooltip.Portal` in Radix UI).
- **Cell renderers receive new props on every render** — do not use deep equality checks or memoize based on props inside renderers. The grid controls when renderers re-render; hook into that rather than trying to suppress it.
- **`useRef` for diff tracking, not `useState`** — for diff flashing, tracking the previous value with `useRef` works across virtualization remounts. `useState` would reset on unmount and produce false "new value" flashes for rows that just scrolled back into view.

## Full Docs

- [Cell Renderers](/docs/cell-renderers)
- [Cell Tooltips & Popovers](/docs/cell-tooltips)
- [Cell Diff Flashing](/docs/cell-diff-flashing)
