---
name: lytenyte-grid
description: >
  Use this skill when the user is working with LyteNyte Grid (@1771technologies/lytenyte-pro
  or @1771technologies/lytenyte-core), a headless React data grid. Activate for tasks like:
  installing or licensing the grid, configuring columns or rows, building cell renderers or
  editors, adding filters or sort controls, grouping or aggregating rows, pivoting, exporting
  to CSV/Excel/Parquet/Arrow, row selection, cell range selection, theming or styling,
  TypeScript GridSpec patterns, server-side or tree data, and any PRO component (SmartSelect,
  PillManager, Menu, Dialog, TreeView, RowGroupCell). Also activate when the user describes
  grid problems without naming the package — e.g. "my rows won't group", "cells aren't
  editable", "add a loading overlay", "pin this column", "the filter isn't working",
  "how do I export this table", "select a range of cells", "copy cells to clipboard".
compatibility: React 18+. Designed for Claude Code and similar AI coding agents.
metadata:
  author: 1771 Technologies
  docs: https://www.1771technologies.com/docs
---

LyteNyte Grid is a headless React data grid with two editions:

- **Core** — `@1771technologies/lytenyte-core` (Apache 2.0, free)
- **PRO** — `@1771technologies/lytenyte-pro` (commercial, superset of Core)

## Quick Start

```tsx
// or @1771technologies/lytenyte-core if already installed
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid-full.css";

interface GridSpec {
  readonly data: { name: string; price: number };
}

function MyGrid() {
  const ds = useClientDataSource({ data: myData });
  const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([
    { id: "name", name: "Name" },
    { id: "price", name: "Price", type: "number" },
  ]);

  return (
    <div className="ln-light ln-grid" style={{ height: 500 }}>
      <Grid<GridSpec> rowSource={ds} columns={columns} onColumnsChange={setColumns} rowHeight={40} />
    </div>
  );
}
```

## Gotchas

- **`useState` and other locally created state are cleared when the user scrolls and rows are removed by virtualization**: Lift state into a React context or provide an `apiExtension`.
- **Memoize all non-primitive props**: `columns`, `columnBase`, `events`, `apiExtension`, etc. must be stable references (use `useMemo`/`useCallback`) or use the React Compiler. Inline objects cause full grid re-renders.
- **Pivoting requires `ds.usePivotProps()`** — calling `useClientDataSource` with `pivotMode: true` is not enough. You must also spread `ds.usePivotProps()` onto `<Grid />` or the grid will not render pivot columns.
- **Server source: `queryKey` change = full reset** — putting a sort/filter model in `queryKey` causes the grid to discard all loaded data and restart from row 0. This is intentional; use it to trigger refetches.
- **`rtl` prop required for RTL** — the grid does NOT detect RTL from the CSS `direction` property. Set `<Grid rtl />` explicitly.
- **CSP requires `style-src 'unsafe-inline'`** — LyteNyte Grid uses inline styles for layout/virtualization. Most modern frameworks (Vite, Next.js) already include this.
- **Column `id` is immutable** — never change a column's `id` after creation. It is used as a stable key throughout the grid.
- **`usePiece` for reactive extension state** — to expose reactive state through `apiExtension` (e.g., a filter model), wrap it in `usePiece(value, setter)`. Plain values in the extension object are not reactive.
- **Context menu: suppress browser default** — always call `event.preventDefault()` and `event.stopPropagation()` in `contextmenu` handlers, or the browser menu appears over yours.
- **Popover editors: disable `editOnPrintable`** — if your edit renderer uses character keys (e.g., a SmartSelect), set `editOnPrintable: false` on the column to prevent the grid from entering edit mode on every keypress.
- **The grid container must have a defined size** — the `<Grid />` component fills its parent 100%. If the parent has no explicit height, the grid renders with zero height and appears blank. Always set a fixed pixel height, or use a flex/grid layout with `flex: 1`.
- **CSS import is optional but required for the prebuilt themes** — LyteNyte Grid is headless by design. If you don't import the CSS, the grid renders functionally but with no built-in styles; you must supply your own via headless mode, Tailwind, CSS Modules, or Emotion. Only import the CSS if you want a prebuilt theme or the default styling.
- **`columns` always needs `onColumnsChange`** — omitting it means column resizes, reorders, and sort-state changes made by the user are silently discarded. The grid needs to call `setColumns` to persist any column mutation.

## Key Patterns

- **`GridSpec`** — define once per grid: `interface GridSpec { readonly data: MyType }`. Drives all types.
- **All filters are custom predicates** — `(row: RowLeaf<T>) => boolean`. No built-in filter UI.
- **`apiExtension`** — adds custom methods/state to the grid API. Use function form `(api) => ({...})` when the extension needs to call grid API methods.

## Load References On Demand

Read a reference file only when the task requires it. Do not load all files upfront.

| When the task involves…                                                                                                                               | Load this file                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Installing, licensing, CSS imports, CDN, watermark errors                                                                                             | [refs/installation.md](refs/installation.md)                           |
| Grid setup, container sizing, reactivity, API ref, `apiExtension`, `usePiece`, headless mode, events system (`cell`/`row`/`viewport` events)          | [refs/grid-core.md](refs/grid-core.md)                                 |
| TypeScript, `GridSpec`, renderer types, `RowNode` type guards                                                                                         | [refs/typescript.md](refs/typescript.md)                               |
| Columns — `id`/`name`/`field`, sizing, pinning, groups, header renderers, spanning                                                                    | [refs/columns.md](refs/columns.md)                                     |
| Rows — height, master-detail (row detail), full-width rows, row spanning, row drag                                                                    | [refs/rows.md](refs/rows.md)                                           |
| Row selection — checkboxes, `SelectAll`, linked vs isolated, controlled state                                                                         | [refs/row-selection.md](refs/row-selection.md)                         |
| Client-side data — `useClientDataSource`, sort, filter, group, aggregation, pivot, add/delete rows                                                    | [refs/client-data-source.md](refs/client-data-source.md)               |
| Server-side data — `useServerDataSource`, `DataRequest`/`DataResponse`, loading state, refresh                                                        | [refs/server-data-source.md](refs/server-data-source.md)               |
| Tree data — `useTreeDataSource`, nested objects, `rowRootFn`/`rowChildrenFn`                                                                          | [refs/tree-data-source.md](refs/tree-data-source.md)                   |
| Infinite scroll or pagination on server data                                                                                                          | [refs/infinite-paginated-source.md](refs/infinite-paginated-source.md) |
| Cell renderers, tooltips, diff flashing, virtualization warning, cell range selection (`cellSelectionMode`, `cellSelections`, multi-range, clipboard) | [refs/cells.md](refs/cells.md)                                         |
| Cell editing — edit mode, validators, edit renderers, bulk edit                                                                                       | [refs/cell-editing.md](refs/cell-editing.md)                           |
| Filtering — text, number, date, set, quick search filter patterns                                                                                     | [refs/filtering.md](refs/filtering.md)                                 |
| Expression DSL — `Evaluator`, `ExpressionEditor`, expression filters                                                                                  | [refs/expressions.md](refs/expressions.md)                             |
| Pivoting — `pivotMode`, `PivotModel`, measures, grand totals                                                                                          | [refs/pivoting.md](refs/pivoting.md)                                   |
| Exporting data — CSV, Excel, Parquet, Arrow, clipboard                                                                                                | [refs/export.md](refs/export.md)                                       |
| UI components — `SmartSelect`, `Menu`, `Popover`, `Dialog`, `PillManager`, `ColumnManager`, `TreeView`, `RowGroupCell`, overlays, `ViewportShadows`   | [refs/components.md](refs/components.md)                               |
| Theming — pre-built themes, `data-ln-*` attributes, CSS tokens, Tailwind, CSS Modules, Emotion                                                        | [refs/theming.md](refs/theming.md)                                     |
| Keyboard shortcuts, RTL, accessibility, React Compiler, bundling, security, versioning                                                                | [refs/misc.md](refs/misc.md)                                           |
