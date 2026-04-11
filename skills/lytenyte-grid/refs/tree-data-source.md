# Tree Data Source (PRO)

Use `useTreeDataSource` for hierarchical object-based data (nested JSON, file trees, org charts). This is **not** for array-based hierarchies — use client source `group` with a function for those.

**When to use `useTreeDataSource` vs. client source `group`:**

- **`useTreeDataSource`** — your data is already a nested object/tree structure (e.g., file system, org chart, JSON tree). Each node can have children that are also data objects.
- **Client source `group`** — your data is a flat array and you want to group rows by field values (e.g., group orders by country). The grouping is derived from data, not inherent in the structure.

**Step-by-step to set up the tree data source:**

1. Provide `data` as a nested object (or use `rowRootFn` + `rowChildrenFn` for custom structures)
2. Set `rowGroupDefaultExpansion` to control initial expansion depth
3. Add a group column to display the tree hierarchy (use `RowGroupCell` from components, or a custom renderer)
4. To enable editing on group nodes, set `rowGroupColumn={false}` and provide a custom editable group column

## Basic Setup

The default behavior traverses object properties and creates a branch whenever a value is itself an object:

```ts
import { useTreeDataSource } from "@1771technologies/lytenyte-pro";

const data = {
  root: {
    "package.json": { name: "package.json", kind: "file", size: 1840 },
    src: {
      "index.ts": { name: "index.ts", kind: "file", size: 320 },
    },
  },
};

const ds = useTreeDataSource({ data, rowGroupDefaultExpansion: true });
```

## Custom Row Construction

Provide control functions for non-default structures:

```ts
const ds = useTreeDataSource({
  data,
  // Returns [key, value] pairs for the root level
  rowRootFn: (x) => x.children.map((row) => [row.name, row]),
  // Returns [key, value] pairs for children of a node
  rowChildrenFn: (x) => {
    if (!x.children) return [];
    return x.children.map((r) => [r.name, r]);
  },
  // Returns the data object stored on the row node
  rowValueFn: (x) => ({
    name: x.name,
    kind: x.kind,
    size: x.size ?? null,
    modified: x.modified,
  }),
});
```

`rowRootFn` is required when your data has a wrapper object whose top-level key should not appear as a row.

## Group Expansion

```ts
const ds = useTreeDataSource({
  data,
  rowGroupDefaultExpansion: true, // expand all
  rowGroupDefaultExpansion: false, // collapse all
  rowGroupDefaultExpansion: 1, // expand depth ≤ 1
});
```

Controlled expansions:

```ts
const [expansions, setExpansions] = useState<Record<string, boolean>>({});

const ds = useTreeDataSource({
  data,
  rowGroupExpansions: expansions,
  onRowGroupExpansionChange: (delta) => setExpansions((prev) => ({ ...prev, ...delta })),
});
```

Toggle programmatically: `api.rowGroupToggle(rowId)`

## Filtering

```ts
const ds = useTreeDataSource({
  data,
  // Predicate runs on each value object — return false to remove the node AND its children
  filter: (value) => !value.name.startsWith("."),
});
```

Dynamic filtering:

```ts
const [showHidden, setShowHidden] = useState(false);

const filter = useMemo(() => (showHidden ? null : (v) => !v.name.startsWith(".")), [showHidden]);

const ds = useTreeDataSource({ data, filter });
```

## Sorting

Same API as client source — pass a sort function or dimension array:

```ts
// Sort function
const ds = useTreeDataSource({
  data,
  sort: (a, b) => (a.data?.size ?? 0) - (b.data?.size ?? 0),
});

// Dimension sort
const ds = useTreeDataSource({
  data,
  sort: [{ dim: sizeColumn, descending: true }],
});
```

Multi-way sort: array of `DimensionSort` objects applied in order.

## Row Pinning

```ts
const ds = useTreeDataSource({
  data,
  topData: [pinnedTopRow], // RowLeaf or RowAggregated nodes
  botData: [pinnedBottomRow],
});
```

## Cell Editing

Works the same as client source editing. Handle updates via `onRowDataChange`:

```ts
const ds = useTreeDataSource({
  data,
  onRowDataChange: (params) => {
    // params.changes: [{ next, prev, parent, key, path }]
    // params.top / params.bottom: pinned row changes
    params.changes.forEach(({ parent, key, next }) => {
      parent[key] = next; // mutate in place, or produce a new data object
    });
    setData({ ...data }); // trigger re-render
  },
});
```

Enable editing on columns:

```ts
{ id: "size", editable: true, editRenderer: NumberEditor }
```

And on the grid:

```tsx
<Grid editMode="cell" rowSource={ds} ... />
```

To edit group/branch nodes, set `rowGroupColumn={false}` and provide a custom group column with `editable: true`.

## Gotchas

- **Tree filter predicate receives value objects, not `RowLeaf`** — unlike client source `filter: (row: RowLeaf<T>) => boolean`, tree source `filter` receives the raw value object (what `rowValueFn` returns). Write `filter: (value) => value.name !== "hidden"`, not `filter: (row) => row.data.name !== "hidden"`.
- **Filtering removes a node AND all its children** — returning `false` from the tree filter prunes the entire subtree. There's no way to filter out a parent while keeping its children.
- **`onRowDataChange` mutations must trigger a re-render** — mutating `parent[key] = next` in place updates the tree's internal data object, but React won't re-render unless you also update the `data` reference passed to the hook. Call `setData({ ...data })` after the mutation.
- **`rowRootFn` is needed when your top-level object is a wrapper** — if your data is `{ root: { ... } }` and you don't want `root` to appear as a row, provide `rowRootFn: (x) => Object.entries(x.root)`.

## All Rows Are Group Rows

The tree source treats all non-leaf nodes as group rows. Since recursion is possible at any level, there are no "leaf-only" constraints on which rows can have children.

## Full Docs

- [Tree Overview](/docs/tree-source-overview)
- [Tree Data](/docs/tree-source-data)
- [Tree Filtering](/docs/tree-source-filtering)
- [Tree Sorting](/docs/tree-source-sorting)
- [Tree Row Pinning](/docs/tree-source-pinning)
- [Tree Data Editing](/docs/tree-source-data-editing)
