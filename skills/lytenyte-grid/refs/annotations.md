# Annotations (PRO)

Annotations overlay custom React content on top of the grid. Pass an array of annotation objects
to the `annotations` prop. Each annotation requires:

- `id` — unique string identifier
- `anchor` — where to position the annotation
- `render` — function returning the React content to display

```tsx
import { Grid } from "@1771technologies/lytenyte-pro";

const annotations: Grid.Annotation<GridSpec>[] = [
  {
    id: "highlight",
    anchor: { kind: "range", rowStart: 0, rowEnd: 5, colStart: "revenue", colEnd: "profit" },
    render: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "2px solid #3b82f6",
          background: "rgba(59, 130, 246, 0.08)",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />
    ),
  },
];

<Grid annotations={annotations} />;
```

The annotation container is sized and positioned to match the anchor. Use `position: "absolute"` with
`inset: 0` to fill it, or use any CSS approach to place content within it.

Annotation elements (`[data-ln-annotation-id]`) are **always in the DOM** — they are not virtualized —
making them reliable anchors for Popovers or tooltips even when the underlying cell scrolls out of view.

## Anchor Types

### Range

Covers a rectangular cell area. Row and column values accept either a numeric index or an ID string.

```tsx
anchor: {
  kind: "range",
  rowStart: 0,          // row index or row ID
  rowEnd: 5,            // row index or row ID (exclusive)
  colStart: "revenue",  // column index or column ID
  colEnd: "profit",     // column index or column ID (exclusive)
}
```

The grid automatically splits range annotations across pinned and scrollable sections.

### Header

Spans one or more columns in the column header area.

```tsx
anchor: {
  kind: "header",
  colStart: "revenue",
  colEnd: "profit",
}
```

### Point

Places content at an absolute pixel coordinate in the scrollable data area.

```tsx
anchor: {
  kind: "point",
  x: 400,  // px from left of scrollable area
  y: 300,  // px from top of scrollable area
}
```

## Z-Index

Control stacking order with the optional `zIndex` property (default `1`; pinned areas default to `3` or `6`):

```tsx
{ id: "ants", zIndex: 10, anchor: { ... }, render: () => <MarchingAnts /> }
```

## Pointer Events

The annotation container has `pointer-events: none` by default. Enable events on specific children:

```tsx
render: () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <button style={{ pointerEvents: "auto" }}>Click me</button>
  </div>
)
```

## Dynamic Annotations

Annotations are driven by React state — update the array to add, remove, or change annotations:

```tsx
const [annotations, setAnnotations] = useState<Grid.Annotation<GridSpec>[]>([]);

<Grid
  annotations={annotations}
  events={useMemo(() => ({
    cell: {
      mouseEnter: ({ layout }) => {
        setAnnotations([{
          id: "hover",
          anchor: { kind: "range", rowStart: layout.rowIndex, rowEnd: layout.rowIndex + 1,
                    colStart: layout.colIndex, colEnd: layout.colIndex + 1 },
          render: () => <div style={{ position: "absolute", inset: 0, background: "rgba(59,130,246,0.15)" }} />,
        }]);
      },
      mouseLeave: () => setAnnotations([]),
    },
  }), [])}
/>;
```

## Cell Notes Pattern

A common annotation use case is cell notes — user-editable text attached to specific cells.
The typical implementation:

1. Store notes in a `Map<string, { text, rowIndex, colIndex }>` keyed by `"rowId|colId"`.
2. For each note, push an annotation with a `range` anchor covering that single cell.
3. The `render` function displays a marker triangle and, when hovered or pinned, a tooltip Popover.
4. Use a right-click context menu (`cell.contextMenu` event) for Add / Edit / Delete / Show Note actions.
5. Use `Shift+F2` (`viewport.keyDown`) to open the edit popover from keyboard.
6. Anchor Popovers to the annotation element (`[data-ln-annotation-id="<id>"]`) — it is always in the DOM,
   unlike the cell element which virtualizes away on scroll.

## Marching Ants Pattern

Marching ants visualize a copy/cut selection, like Excel or Google Sheets:

```tsx
function MarchingAnts() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
      <rect x="0" y="0" width="100%" height="100%"
        fill="none" stroke="var(--ln-primary-50)" strokeWidth="2"
        strokeDasharray="8 5" className="ln-marching-ants" />
    </svg>
  );
}

// The CSS animation (in your stylesheet):
// @keyframes marching-ants { to { stroke-dashoffset: -26; } }
// .ln-marching-ants { animation: marching-ants 0.6s linear infinite; }

const annotations = copiedRect ? [{
  id: "marching-ants",
  zIndex: 10,
  anchor: { kind: "range", rowStart: copiedRect.rowStart, rowEnd: copiedRect.rowEnd,
            colStart: copiedRect.columnStart, colEnd: copiedRect.columnEnd },
  render: () => <MarchingAnts />,
}] : [];
```

On Windows, `navigator.clipboard.readText()` returns `\r\n` line endings even when `\n` was written.
Normalize before comparing or splitting: `content.replace(/\r\n/g, "\n")`.

## Gotchas

- **Annotation elements are never virtualized** — `[data-ln-annotation-id]` elements stay in the DOM regardless of scroll position. This makes them reliable Popover anchors.
- **`pointerEvents: "none"` on the container** — set `pointerEvents: "auto"` on individual children that need mouse interaction.
- **Memoize `render` functions at module level** — if `render` is defined inline in the annotation array, it creates a new function reference every render, causing unnecessary React reconciliation.
- **`zIndex` for layering above grid content** — use a higher `zIndex` (e.g. `10`) to ensure the annotation renders above frozen columns and row overlays.

## Full Docs

- [Grid Annotations](https://www.1771technologies.com/docs/grid-annotations)
