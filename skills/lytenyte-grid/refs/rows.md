# Rows

## Row Node Types

Every row in LyteNyte Grid is a `RowNode`, a union of three kinds:

```ts
row.kind === "leaf"       // RowLeaf — no children, has data
row.kind === "branch"     // RowGroup — container with child rows
row.kind === "aggregated" // RowAggregated — aggregate data, not expandable
```

Type-narrowing helpers (TypeScript-aware):

```ts
api.rowIsLeaf(row)
api.rowIsGroup(row)
api.rowIsAggregated(row)
```

Row index is not stored on `RowNode` — it is passed to renderers/callbacks as `rowIndex`. Row indices are 0-based.

## Row Height

```tsx
// Fixed height (all rows same)
<Grid rowHeight={40} />

// Variable height (function per row — keep this fast!)
<Grid rowHeight={(index) => [30, 50, 80, 120][index % 4]} />

// Fill viewport — rows expand to fill available space (min 24px each)
<Grid rowHeight="fill:24" />
```

## Row Pinning

Row pinning is configured on the **data source**, not the grid directly. See the data source guides:
- Client: [client-data-source.md](./client-data-source.md) — `topRows` / `bottomRows`
- Server: [server-data-source.md](./server-data-source.md)
- Tree: [tree-data-source.md](./tree-data-source.md)

**Index behavior:** Top-pinned rows occupy the first N indices. Scrollable rows start after them. Bottom-pinned rows take the last indices. Account for this when accessing rows by index.

## Row Detail (Master-Detail)

**Step-by-step to add master-detail:**
1. Define a `rowDetailRenderer` component on the grid
2. Add a toggle button in a cell renderer (typically the marker column) that calls `api.rowDetailToggle(row.id)`
3. Optionally set `rowDetailHeight` — use `"auto"` for content-sized height (causes two-phase render) or a fixed pixel value for smoother scrolling
4. For controlled expansion state, provide `rowDetailExpansions` + `onRowDetailExpansionsChange`

Define a `rowDetailRenderer` on the grid to enable expandable detail sections:

```tsx
function RowDetailRenderer({ row, api }: Grid.T.RowDetailRendererParams<GridSpec>) {
  return <div>Detail for row: {row.id}</div>;
}

<Grid rowDetailRenderer={RowDetailRenderer} ... />
```

Toggle detail open/closed from a cell renderer:

```tsx
function MarkerCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <button onClick={() => api.rowDetailToggle(row.id)}>
      Toggle
    </button>
  );
}
```

### Row Detail Height

```tsx
<Grid rowDetailHeight={200} />     // fixed pixels
<Grid rowDetailHeight="auto" />    // sizes to content
```

### Controlled Detail Expansions

By default, expansion state is uncontrolled. Provide both props to control it:

```tsx
const [rowDetailExpansions, setRowDetailExpansions] = useState(new Set<string>());

<Grid
  rowDetailExpansions={rowDetailExpansions}
  onRowDetailExpansionsChange={(newSet) => {
    // Example: only one row open at a time
    setRowDetailExpansions((prev) => newSet.difference(prev));
  }}
  rowDetailRenderer={RowDetailRenderer}
/>
```

### Nested Grids

The detail renderer can return any React content, including another `<Grid />` instance:

```tsx
function RowDetailRenderer({ row }: Grid.T.RowDetailRendererParams<GridSpec>) {
  const childDs = useClientDataSource({ data: row.data.children });
  return <Grid columns={childColumns} rowSource={childDs} />;
}
```

## Full Width Rows

A full width row spans the entire viewport and replaces normal cells in that row. Use for section headers, separators, or summary rows:

```tsx
// Predicate determines which rows render full-width
<Grid
  rowFullWidthPredicate={(row) => row.kind === "leaf" && row.data?.isHeader}
  rowFullWidthRenderer={FullWidthCell}
/>

function FullWidthCell({ row, api }: Grid.T.RowFullWidthRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;
  return (
    <div className="section-header">
      {row.data.sectionName}
    </div>
  );
}
```

## Row Spanning

`rowSpan` on a column definition makes cells span multiple rows downward:

```ts
// Fixed span — every cell in this column spans 2 rows
{ id: "symbol", rowSpan: 2 }

// Dynamic span — varies per row
{ id: "exchange", rowSpan: (p) => exchangeCounts[p.row.data?.exchange] ?? 1 }
```

Cells span **downward** only. The grid skips rendering covered cells.

Configure how far back LyteNyte scans to determine spans (default 50):

```tsx
<Grid rowScanDistance={100} />
```

> `rowSpan` return value must not exceed `rowScanDistance`.

## Row Column Spanning

See [columns.md](./columns.md) for `colSpan` — spanning horizontally across columns.

## Row Dragging

Enable drag handles in a cell renderer using `api.useRowDrag`:

```tsx
function DragCell({ api, rowIndex }: Grid.T.CellRendererParams<GridSpec>) {
  const { props } = api.useRowDrag({ rowIndex });

  return (
    <div {...props} style={{ cursor: "grab" }}>
      ⠿
    </div>
  );
}
```

Handle drag events on the grid:

```tsx
<Grid
  onRowDragEnter={(p) => { /* highlight target row */ }}
  onRowDragLeave={(p) => { /* remove highlight */ }}
  onRowDrop={(p) => {
    if (p.over.kind === "viewport") return;
    setData(prev => reorder(prev, p.source.rowIndex, p.over.rowIndex));
  }}
/>
```

### Multi-row Dragging

Combine with row selection — use `p.source.api.rowsSelected()` in the drop handler to get all selected rows and move them together.

### Between Grids

```tsx
// Assign IDs to participating grids
<Grid gridId="primary" rowDropAccept={["secondary"]} ... />
<Grid gridId="secondary" rowDropAccept={["primary"]} ... />

// In onRowDrop — detect same vs different grid
onRowDrop={(p) => {
  if (p.over.id === p.source.id) {
    // same grid reorder
  } else {
    // cross-grid move
    const sourceApi = p.source.api as Grid.API<MySpec>;
  }
}}
```

### External Drop Zones

Use `getRowDragData()` (call only during an active drag) in a native `onDrop` handler on any element.

### Drag to External Apps

```tsx
api.useRowDrag({
  rowIndex,
  data: {
    "row-content": {
      kind: "dt",
      type: "text/plain",
      data: JSON.stringify(row.data),
    },
  },
})
```

### Custom Drag Placeholder

```tsx
const { props, placeholder } = api.useRowDrag({
  rowIndex,
  placeholder: MyPlaceholderComponent,
});

// Render placeholder inside the drag handle cell (use a portal in the component)
return <div {...props}>{placeholder}</div>;
```

## Gotchas

- **Row detail height `"auto"` can cause layout jank** — auto-sizing measures the content after render, then adjusts height. This causes a two-phase render that can visibly shift other rows. Use a fixed pixel height when possible.
- **`rowSpan` return value must not exceed `rowScanDistance`** — if a span is larger than the scan distance (default 50), cells at the boundary render incorrectly. Increase `rowScanDistance` when using large spans.
- **`onRowDrop`: `p.over.kind === "viewport"` means dropped on empty space** — always guard against this. If the user drops a row below the last row, `p.over` is `{ kind: "viewport" }`, not a row node. Accessing `p.over.rowIndex` in this case crashes.
- **Variable `rowHeight` functions must be fast** — the function is called for every row during layout. Avoid expensive computations; use a lookup map if height depends on data.

## Full Docs

- [Rows Overview](/docs/row-overview)
- [Row Height](/docs/row-height)
- [Row Pinning](/docs/row-pinning)
- [Row Detail](/docs/row-detail)
- [Row Full Width](/docs/row-full-width)
- [Row Spanning](/docs/row-spanning)
- [Row Dragging](/docs/row-dragging)
