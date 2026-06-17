# Virtualization Layer — Performance Analysis

Analysis of `packages/lytenyte-core` and `packages/lytenyte-shared`, focused on the rendering and virtualization pipeline.

---

## Quick Reference

| #   | Finding                                                         | File                                                    | Impact                  | Effort  |
| --- | --------------------------------------------------------------- | ------------------------------------------------------- | ----------------------- | ------- |
| 1   | Scroll listener never unregistered — memory leak                | `bounds.tsx`                                            | Bug                     | Trivial |
| 2   | All-column Cell instantiation per row (wide grids)              | `row-children-default.tsx`                              | High                    | Medium  |
| 3   | Fixed-height rows: O(log n) binary search is avoidable          | `get-bound-start/end.ts`                                | High                    | Medium  |
| 4   | Pinned row arrays recreated on every scroll                     | `row-layout-context.tsx`                                | Medium                  | Low     |
| 5   | Unbounded layout cache                                          | `create-row-layout.ts`                                  | Medium (large datasets) | Medium  |
| 6   | Overscan defaults 2.5–5× higher in React layer than constants   | `bounds.tsx`                                            | Medium                  | Trivial |
| 7   | `rangedBinarySearch` compound branch per iteration              | `ranged-binary-search.ts`                               | Low                     | Trivial |
| 8   | `Row` cell-selection selector recreated per render              | `row.tsx`                                               | Medium                  | Trivial |
| 9   | `getSpanFn` double column iteration                             | `get-span-fn.ts`                                        | Low                     | Trivial |
| 10  | `useMappedEvents` rebuilds handlers on row data change          | `use-mapped-events.ts`                                  | Medium                  | Medium  |
| 11  | `useRowContextValue` triggers for all rows on any detail toggle | `use-row-context-value.tsx`                             | Medium                  | Low     |
| 12  | Viewport inline style object unguarded                          | `viewport.tsx`                                          | Low                     | Trivial |
| 13  | Duplicate ResizeObserver implementations                        | `dimensions-context.tsx` / `use-viewport-dimensions.ts` | Low                     | Low     |
| 14  | `createColumnLayout` slice+map per header group cell            | `create-col-layout.ts`                                  | Low                     | Low     |
| 15  | `columnWidthMeta` intermediate `number[]` allocation            | `column-width-meta.ts`                                  | Low                     | Low     |

---

## Finding 1 — Scroll listener never unregistered (memory leak)

**File:** `packages/lytenyte-core/src/root/contexts/bounds.tsx:76-92`  
**Impact:** Bug | **Effort:** Trivial

```ts
useIsoEffect(() => {
  if (!viewport) return;
  const controller = new AbortController();

  let frame: number | null = null;
  viewport.addEventListener("scroll", () => {
    // ← no { signal } passed
    if (frame) return;
    frame = requestAnimationFrame(() => {
      setScrollTop(viewport.scrollTop);
      setScrollLeft(Math.abs(viewport.scrollLeft));
      frame = null;
    });
  });

  return () => controller.abort(); // ← abort has no effect; listener is never removed
}, [viewport]);
```

`controller.abort()` only removes listeners that were registered with `{ signal: controller.signal }`. Since the `addEventListener` call here has no `signal`, the scroll handler is never removed on unmount. The handler continues firing, scheduling RAF callbacks, and calling React state setters on an unmounted component.

**Fix:** Pass `{ signal: controller.signal }` to `addEventListener`.

```ts
viewport.addEventListener("scroll", () => { ... }, { signal: controller.signal });
```

---

## Finding 2 — All-column Cell instantiation per visible row

**File:** `packages/lytenyte-core/src/components/rows/row-children-default.tsx:16`  
**Impact:** High (wide grids) | **Effort:** Medium

```tsx
const RowWithCellRenderer = memo(({ row }: { row: LayoutRowWithCells }) => {
  return (
    <Row key={row.id} row={row}>
      {row.cells.map((cell) => (
        <Cell cell={cell} key={cell.id} />
      ))}
    </Row>
  );
});
```

`row.cells` contains **every column** — including columns outside the visible horizontal range. Each `Cell` component then runs two hooks (`useStartBoundsContext`, `useFocusNonReactive`) before doing the bounds check and returning `null`:

```tsx
// Inside Cell:
const [start, end] = useStartBoundsContext();
const focus = useFocusNonReactive().get();

if (
  !isFocused &&
  props.cell.colPin == null &&
  (props.cell.colIndex >= end || props.cell.colIndex + props.cell.colSpan - 1 < start)
) {
  return null;
}
```

For a grid with 200 columns where 20 are visible, every new visible row instantiates ~200 `Cell` components per row, of which ~180 return `null` after running their hooks. The visible column range is already computed as `[colCenterStart, colCenterEnd]` from `SpanLayout` — this information exists before cells are rendered.

**Fix:** Filter `row.cells` to the visible range before calling `map`, rather than inside each `Cell`. Only cells where `colPin != null || (colIndex >= colCenterStart && colIndex < colCenterEnd)` need to be rendered. The `startBoundsContext` already exposes exactly this range.

---

## Finding 3 — Fixed-height rows: O(log n) binary search is avoidable

**Files:** `packages/lytenyte-shared/src/virtual-bounds/get-bound-start.ts`, `get-bound-end.ts`  
**Impact:** High (fixed-height grids) | **Effort:** Medium

When `rowHeight` is a plain number and no detail rows are expanded, the positions array is fully linear: `yPositions[i] = i * rowHeight`. The current code runs a binary search over this array on every scroll event regardless:

```ts
// get-bound-start.ts
return clamp(minStart, rangedBinarySearch(positions, offset) - overscan, maxStart);

// get-bound-end.ts
return Math.min(maxCount, rangedBinarySearch(positions, offset + space) + overscan + 1);
```

For the very common fixed-height case with no expanded detail rows, bounds are O(1):

```ts
const rowStart = Math.max(topCount, Math.floor(scrollTop / rowHeight) - overscan);
const rowEnd = Math.min(maxCenter, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan + 1);
```

`computeBounds` has all the information needed to detect this case: `rowHeight` is a number and `detailExpansions` is empty. The `BoundsProvider` could inject a `fixedRowHeight` shortcut, or `computeBounds` could accept an optional `fixedRowHeight` parameter that bypasses the typed array lookup entirely.

Same optimization applies to columns when no flex or `sizeToFit` is active and all column widths are fixed — though column count is typically small enough that it matters less.

---

## Finding 4 — Pinned row arrays recreated on every scroll

**File:** `packages/lytenyte-core/src/root/contexts/row-layout/row-layout-context.tsx:106-131`  
**Impact:** Medium | **Effort:** Low

```ts
const rowView = useMemo<RowView>(() => {
  // ...
  const top = Array.from({ length: n.rowTopEnd }, (_, i) => rowLayout.layoutByIndex(i)!);
  const center = Array.from(
    { length: n.rowCenterEnd - n.rowCenterStart },
    (_, i) => rowLayout.layoutByIndex(i + n.rowCenterStart)!,
  );
  const bottom = Array.from(
    { length: n.rowBotEnd - n.rowBotStart },
    (_, i) => rowLayout.layoutByIndex(i + n.rowBotStart)!,
  );
  return { top, center, bottom, ... };
}, [bounds, virtualizeCols, virtualizeRows, rowLayout, vp]);
```

`bounds` changes on every scroll event. This causes `top` and `bottom` (pinned rows) to be reallocated on every scroll frame, even though their content only changes when `topCount` / `bottomCount` changes, not when the scroll position changes. Splitting into two `useMemo` calls would eliminate this:

```ts
// Only changes when pinned row count or rowLayout changes
const pinnedRows = useMemo(
  () => ({
    top: Array.from({ length: n.rowTopEnd }, (_, i) => rowLayout.layoutByIndex(i)!),
    bottom: Array.from(
      { length: n.rowBotEnd - n.rowBotStart },
      (_, i) => rowLayout.layoutByIndex(i + n.rowBotStart)!,
    ),
  }),
  [topCount, bottomCount, rowLayout],
);

// Changes on every scroll
const centerRows = useMemo(
  () =>
    Array.from(
      { length: n.rowCenterEnd - n.rowCenterStart },
      (_, i) => rowLayout.layoutByIndex(i + n.rowCenterStart)!,
    ),
  [bounds, rowLayout],
);
```

---

## Finding 5 — Unbounded layout cache in `createRowLayout`

**File:** `packages/lytenyte-shared/src/layout/create-row-layout.ts:116-119`  
**Impact:** Medium (large datasets) | **Effort:** Medium

```ts
const indexToLayout = new Map<number, LayoutRow>();
const idToLayout = new Map<string, LayoutRow>();
const occupiedFlags = new Map<number, Uint8Array>();
const occupiedRoots = new Map<number, LayoutCell[]>();
```

These Maps grow without bound as the user scrolls. For a 1M-row dataset scrolled end-to-end, every visited row is retained in memory forever (until `createRowLayout` is recreated by its upstream `useMemo`). The `clearCache()` method exists but is never called automatically.

**Fix:** Apply an LRU eviction strategy with a capacity of approximately `4 × visibleRowCount`. This bounds memory while preserving the cache benefit for overscan rows and previously-visited rows that are still within one viewport of the current position.

---

## Finding 6 — Overscan defaults mismatch between shared constants and React layer

**File:** `packages/lytenyte-shared/src/+constants.ts:7-9` vs `packages/lytenyte-core/src/root/contexts/bounds.tsx:49-52`  
**Impact:** Medium | **Effort:** Trivial

The shared package defines tuned defaults:

```ts
// +constants.ts
ROW_OVERSCAN_START = 2;
ROW_OVERSCAN_END = 4;
COL_OVERSCAN = 1;
```

The React `BoundsProvider` overrides these without explanation:

```ts
// bounds.tsx
colOverscanStart: props.colOverscanStart ?? 3,   // 3× the shared default
colOverscanEnd: props.colOverscanEnd ?? 3,        // 3× the shared default
rowOverscanTop: props.rowOverscanTop ?? 10,       // 5× the shared default
rowOverscanBottom: props.rowOverscanBottom ?? 10, // 2.5× the shared default
```

Row overscan of 10 means 20 extra rows are rendered beyond the viewport at all times. Whether these are intentional overrides or unconsidered defaults is unclear. Benchmarking the effect of lowering to the shared-library values (or at least documenting why higher values were chosen) is worth doing.

---

## Finding 7 — `rangedBinarySearch` compound branch per iteration

**File:** `packages/lytenyte-shared/src/virtual-bounds/ranged-binary-search.ts:18-23`  
**Impact:** Low | **Effort:** Trivial

```ts
while (start <= end) {
  const mid = start + ((end - start) >> 1);

  if (range[mid] <= target && (mid === range.length - 1 || range[mid + 1] > target)) return mid;

  if (target < range[mid]) end = mid - 1;
  else start = mid + 1;
}
```

The early-exit condition reads two adjacent array elements and evaluates two comparisons per iteration, including a bounds guard (`mid === range.length - 1`). A standard `upper_bound` implementation uses one comparison per iteration and avoids the guard entirely:

```ts
export function rangedBinarySearch(range: Uint32Array, target: number): number {
  let lo = 0;
  let hi = range.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (range[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return Math.max(0, lo - 1);
}
```

`rangedBinarySearch` is called 4 times per `computeBounds` call (row start, row end, col start, col end), which fires on every scroll event. A tighter inner loop reduces branch mispredictions in the hot path.

---

## Finding 8 — `Row` cell-selection selector recreated per render, defeating `usePiece` memoization

**File:** `packages/lytenyte-core/src/components/rows/row/row.tsx:31-33`  
**Impact:** Medium | **Effort:** Trivial

```ts
const cellSelected = cellSelections$.useValue((x) =>
  x.some((r) => row.rowIndex >= r.rowStart && row.rowIndex < r.rowEnd),
);
```

Inside `usePiece.useValue`, the selector is a `useMemo` dependency:

```ts
// use-piece.ts
useValue: (selector?) => {
  const snapshot = useMemo(() => {
    if (selector) return () => selector(source.current!.value);
    return () => source.current.value;
  }, [selector, source]);   // ← selector identity checked here

  return useSyncExternalStore(source.current.notifier.on, snapshot, snapshot);
},
```

Since `(x) => x.some(...)` is a new arrow function on every `Row` render, `selector` identity always changes → `snapshot` is recreated every render → `useSyncExternalStore` receives a new `getSnapshot` reference and calls it to verify the value. With 30+ rows in view, this is 30+ redundant snapshot recreations per render cycle.

**Fix:** Wrap the selector in `useCallback`:

```ts
const selector = useCallback(
  (x: DataRect[]) => x.some((r) => row.rowIndex >= r.rowStart && row.rowIndex < r.rowEnd),
  [row.rowIndex],
);
const cellSelected = cellSelections$.useValue(selector);
```

---

## Finding 9 — `getSpanFn` iterates all columns twice per layout rebuild

**File:** `packages/lytenyte-core/src/root/contexts/row-layout/get-span-fn.ts:10`  
**Impact:** Low | **Effort:** Trivial

```ts
export function getSpanFn(rowByIndex, visibleColumns, span: "row" | "col", api) {
  if (visibleColumns.every((c) => !(span === "col" ? (c as any).colSpan : (c as any).rowSpan))) return null;
  // ...
}
```

Called twice in `RowLayoutProvider`'s `useMemo` — once with `"col"`, once with `"row"`. Both calls iterate the full column list independently, performing two separate O(n) passes. A single pass checking both conditions simultaneously would halve this work:

```ts
const hasColSpan = visibleColumns.some((c) => !!(c as any).colSpan);
const hasRowSpan = visibleColumns.some((c) => !!(c as any).rowSpan);
```

---

## Finding 10 — `useMappedEvents` rebuilds event handlers when row data changes

**File:** `packages/lytenyte-core/src/hooks/use-mapped-events.ts:4-16`  
**Impact:** Medium | **Effort:** Medium

```ts
export function useMappedEvents(events, params) {
  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(events ?? {}).map(([key, ev]) => {
        const evName = `on${key[0].toUpperCase()}${key.slice(1)}`;
        return [evName, (e: any) => ev({ event: e, ...params })];
      }),
    );
  }, [...Object.values(params), events]);
}
```

For `Cell`, `params` is `{ column, row, api, layout: cell }`. The `row` object from `useRowContextValue` carries reactive fields (`__selected`, `__globalSnapshot`, etc.) and gets a new reference on any data update. Every row data change therefore rebuilds handler objects for all visible cells, even those that don't need re-rendering.

Since the actual event data is passed at call time (the handler receives the synthetic event), the handlers don't need to close over the latest `row` at definition time. Using a stable ref to `params` would make handlers truly stable across data updates:

```ts
export function useMappedEvents(events, params) {
  const paramsRef = useRef(params);
  paramsRef.current = params;

  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(events ?? {}).map(([key, ev]) => {
        const evName = `on${key[0].toUpperCase()}${key.slice(1)}`;
        return [evName, (e: any) => ev({ event: e, ...paramsRef.current })];
      }),
    );
  }, [events]); // events is the only true structural dependency
}
```

---

## Finding 11 — `useRowContextValue` re-runs for all rows on any detail expansion toggle

**File:** `packages/lytenyte-core/src/components/rows/row/use-row-context-value.tsx:56`  
**Impact:** Medium | **Effort:** Low

```ts
export function useRowContextValue(row: LayoutRowWithCells) {
  // ...
  const { detailExpansions } = useRowDetailContext();

  const detailExpanded = row && detailExpansions.has(row.id);
  const detailHeight = row ? detailHeightFn(row.id) : 0;

  const value = useMemo<RowMeta>(() => {
    return { ... };
  }, [
    // ...
    detailExpansions,  // ← entire Set<string>
    detailExpanded,
    detailHeight,
    // ...
  ]);
}
```

`detailExpansions` is a `Set<string>` that gets a new reference whenever any row's detail is toggled. When any detail row opens or closes, a new `Set` is created, the reference changes, and the `useMemo` re-runs for **every** mounted `Row` component — not just the row whose detail changed.

The actual dependency is the boolean `detailExpanded` (derived from `.has(row.id)`), which is already computed and listed as a dep. Removing `detailExpansions` from the dep array would make each row's memo stable when other rows' detail states change:

```ts
}, [
  // Remove detailExpansions — detailExpanded and detailHeight already capture what we need
  detailExpanded,
  detailHeight,
  // ...other deps...
]);
```

---

## Finding 12 — Viewport inline style object created on every render

**File:** `packages/lytenyte-core/src/components/viewport/viewport.tsx:284-307`  
**Impact:** Low | **Effort:** Trivial

```tsx
style={{
  position: "relative",
  display: "flex",
  // ...
  "--ln-full-width": `${xPositions.at(-1)!}px`,
  "--ln-full-height": `${yPositions.at(-1)!}px`,
  "--ln-vp-height": `${dimensions.innerHeight}px`,
  // ... 9+ computed properties
  ...(props.style ?? styles?.viewport?.style),
} as CSSProperties}
```

An inline object literal is allocated on every `Viewport` render. `Viewport` reads `xPositions`, `yPositions`, `offsets`, and `dimensions` from context, meaning it re-renders on any of those changes (column width changes, row height changes, resize). A `useMemo` guarded on the actual scalar values would reduce allocations:

```ts
const vpStyle = useMemo(() => ({
  position: "relative",
  // ...
  "--ln-full-width": `${xPositions.at(-1)!}px`,
  // ...
}), [xPositions, yPositions, dimensions.innerHeight, dimensions.innerWidth, offsets, ...]);
```

---

## Finding 13 — Duplicate ResizeObserver + RAF implementations

**Files:** `packages/lytenyte-core/src/root/contexts/viewport/dimensions-context.tsx:44-59` and `packages/lytenyte-core/src/root/hooks/use-viewport-dimensions.ts:24-39`  
**Impact:** Low | **Effort:** Low

Both implement identical logic — observe the viewport element with a `ResizeObserver`, coalesce callbacks through `requestAnimationFrame`, and read `offsetHeight/clientHeight/offsetWidth/clientWidth`:

```ts
// dimensions-context.tsx
const obs = new ResizeObserver(() => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    setViewportDimensions({ outerHeight: vp.offsetHeight, innerHeight: vp.clientHeight, ... });
    frame = null;
  });
});

// use-viewport-dimensions.ts — identical pattern
const obs = new ResizeObserver(() => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    Object.assign(viewportDimensions.current, { outerHeight: vp.offsetHeight, ... });
    frame = null;
    force();
  });
});
```

If both are active on the same viewport element, the element has two observers and two independent RAF queues firing on resize. The standalone hook `useViewportDimensions` appears unused in the current component tree (only `DimensionsContext` is in the provider hierarchy), but its existence is a maintenance risk.

---

## Finding 14 — `createColumnLayout` slices and maps columns per header group cell

**File:** `packages/lytenyte-shared/src/layout/create-col-layout.ts:57`  
**Impact:** Low | **Effort:** Low

```ts
columnIds: view.visibleColumns.slice(c.colStart, c.colStart + c.colSpan).map((x) => x.id),
```

For each group cell in the header, a new slice of `visibleColumns` is created and mapped to IDs. This runs on every `createColumnLayout` call (triggered by any column definition or visibility change). For a grid with many header group cells, this produces multiple allocations per call.

Since `columnIds` depends only on `visibleColumns` and the group's `colStart`/`colSpan` — data that's already present in `makeColumnView` when the groups are built — the ID lists could be pre-computed there and stored in the group metadata, making `createColumnLayout` allocation-free for this step.

---

## Finding 15 — `columnWidthMeta` allocates an intermediate `number[]`

**File:** `packages/lytenyte-shared/src/coordinates/column-width-meta/column-width-meta.ts:19`  
**Impact:** Low | **Effort:** Low

```ts
export function columnWidthMeta(columns, base) {
  const widths: number[] = []; // ← plain JS array allocated here
  // ... populated ...
  return { widths, totalWidth, flexTotal };
}
```

`widths` is a plain `number[]` that is then mutated inside `columnPositions` for flex/sizeToFit adjustments before being passed to `makePositionArray`. The intermediate array is unnecessary — `columnPositions` could compute the final widths inline and pass a callback to `makePositionArray` directly, matching the same pattern used by `rowPositions`:

```ts
// rowPositions does this correctly — no intermediate array:
return makePositionArray((i) => Math.max(getH(i) + getDetailHeight(i), 0), n);
```

Applying the same pattern to column positions would eliminate the `number[]` allocation and the subsequent GC cycle on every column layout rebuild.
