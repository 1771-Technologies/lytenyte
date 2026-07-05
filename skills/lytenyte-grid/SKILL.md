---
name: lytenyte-grid
description: >
  Use this skill when the user is working with LyteNyte Grid (@1771technologies/lytenyte-pro
  or @1771technologies/lytenyte-core), a headless React data grid. Activate for tasks like:
  installing or licensing LyteNyte Grid, configuring columns or rows, building cell renderers or
  editors, adding filters or sort controls, grouping or aggregating rows, pivoting, exporting
  to CSV/Excel/Parquet/Arrow, row selection, cell range selection, theming or styling,
  TypeScript GridSpec patterns, server-side or tree data, annotations, cell notes, marching ants,
  row/column animations, row banding, scroll flash suppression, and any PRO component (SmartSelect,
  PillManager, Menu, Dialog, TreeView, RowGroupCell). Also activate when the user describes
  grid problems without naming the package — e.g. "my rows won't group", "cells aren't
  editable", "add a loading overlay", "pin this column", "the filter isn't working",
  "how do I export this table", "select a range of cells", "copy cells to clipboard",
  "build me a grid", "animate rows", "highlight cells", "add a note to a cell".
compatibility: React 18+. Designed for Claude Code and similar AI coding agents.
metadata:
  author: 1771 Technologies
  docs: https://www.1771technologies.com/docs
---

A React Data Grid with advanced features like sorting, filtering, column pinning, cell selection,
row selection, server data loading, infinite data loading, row grouping and aggregations, pivoting,
and many more features.

LyteNyte Grid is a headless or pre-styled React data grid with two editions:

- **Core** — `@1771technologies/lytenyte-core` (Apache 2.0, free, no license required)
- **PRO** — `@1771technologies/lytenyte-pro` (commercial, superset of Core)

**PRO licensing:** PRO can be installed and used freely for evaluation — no license key is needed to try it. A watermark ("used for evaluation") appears when no key is set.

## Operating Rules

- First determine whether the user is using Core or PRO. If unclear, default examples to PRO only when the requested feature requires PRO; otherwise use Core-compatible APIs.
- Load only the relevant reference files from the table below. Do not load every reference upfront.
- Prefer LyteNyte APIs and terminology. Do not substitute AG Grid, TanStack Table, MUI DataGrid, or generic grid APIs unless explicitly comparing.
- For React examples, provide complete TypeScript snippets with imports, `GridSpec`, data source setup, columns state, CSS import, and a sized grid container.
- Always include the relevant CSS import and a wrapper with an explicit height.
- When debugging, check these first: package edition, CSS import, container height, column IDs, controlled state handlers, data source type, and whether the feature is Core or PRO.

A license key is required to remove the watermark for **production deployments**. License validation is offline;
no network request is made. If the user is building/prototyping and hasn't set up a license yet,
that is fine — they can add it before shipping.

## Quick Start

1. Start by importing LyteNyte Grid and its associated CSS file.

   ```tsx
   import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
   import "@1771technologies/lytenyte-pro/grid-full.css";
   ```

   If you are using LyteNyte Grid Core:

   ```tsx
   import { Grid, useClientDataSource } from "@1771technologies/lytenyte-core";
   import "@1771technologies/lytenyte-core/grid-full.css";
   ```

2. Create a Grid Spec type to provide the grid with types for the data that will be displayed in
   LyteNyte Grid.

   ```ts
   interface GridSpec {
     readonly data: { name: string; price: number };
   }
   ```

3. Create a component that renders LyteNyte Grid using the `Grid` component exported from the
   LyteNyte package.

   ```tsx
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

   Here we define the columns in the component as well. LyteNyte Grid columns require at a minimum an `id` property,
   which must be unique among all the columns. See the [Columns Ref](refs/columns.md) for more details.

## Load References On Demand

Read a reference file only when the task requires it. Do not load all files upfront.

| When the task involves…                                                                                                                               | Load this file                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Installing, licensing, CSS imports, CDN, watermark errors                                                                                             | [refs/installation.md](refs/installation.md)                           |
| Grid setup, container sizing, reactivity, API ref, `apiExtension`, `usePiece`, headless mode, events system (`cell`/`row`/`viewport` events), row/column animations, `suppressScrollFlash`, `viewportInitialWidth`/`viewportInitialHeight` | [refs/grid-core.md](refs/grid-core.md) |
| TypeScript, `GridSpec`, renderer types, `RowNode` type guards                                                                                         | [refs/typescript.md](refs/typescript.md)                               |
| Columns — `id`/`name`/`field`, sizing, pinning, groups, header renderers, spanning                                                                    | [refs/columns.md](refs/columns.md)                                     |
| Rows — height, master-detail (row detail), full-width rows, row spanning, row drag, row banding, zebra striping, `rowAlternateAttr`                   | [refs/rows.md](refs/rows.md)                                           |
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
| Annotations — highlighting cells, cell notes, marching ants, custom overlays, `annotations` prop                                                      | [refs/annotations.md](refs/annotations.md)                             |
| UI components — `SmartSelect`, `Menu`, `Popover`, `Dialog`, `PillManager`, `ColumnManager`, `TreeView`, `RowGroupCell`, overlays, `ViewportShadows`   | [refs/components.md](refs/components.md)                               |
| Theming — pre-built themes, `data-ln-*` attributes, CSS tokens, Tailwind, CSS Modules, Emotion                                                        | [refs/theming.md](refs/theming.md)                                     |
| shadcn/ui — CLI install, `ln-shadcn` theme, using shadcn components as renderers/editors/filters, dark mode, `cn` utility                             | [refs/shadcn.md](refs/shadcn.md)                                       |
| Keyboard shortcuts, RTL, accessibility, React Compiler, bundling, security, versioning                                                                | [refs/misc.md](refs/misc.md)                                           |

# Feature Availability & Reference Routing

Use this file first when deciding:

1. whether the user needs Core or PRO
2. which reference file to load next

## Rules

- Use PRO when any requested feature is PRO-only.
- After deciding edition, load the most specific reference file listed below.
- Do not load every reference file.

## PRO-Only Features

| User asks for                                                                            | Edition | Load                                |
| ---------------------------------------------------------------------------------------- | ------: | ----------------------------------- |
| server-side data, server sorting/filtering/grouping, `useServerDataSource`               |     PRO | `refs/server-data-source.md`        |
| infinite scroll, paginated server rows                                                   |     PRO | `refs/infinite-paginated-source.md` |
| tree data, nested object rows, `useTreeDataSource`                                       |     PRO | `refs/tree-data-source.md`          |
| pivot tables, pivot mode, measures, grand totals                                         |     PRO | `refs/pivoting.md`                  |
| expressions, expression filters, expression editor                                       |     PRO | `refs/expressions.md`               |
| label filters, having filters                                                            |     PRO | `refs/filtering.md`                 |
| SmartSelect, PillManager, Menu, Dialog, TreeView, ColumnManager, RowGroupCell, SelectAll |     PRO | `refs/components.md`                |
| annotations, cell notes, marching ants, custom overlays, `annotations` prop              |     PRO | `refs/annotations.md`               |

## Core-Compatible Features

| User asks for                                                            |  Edition | Load                         |
| ------------------------------------------------------------------------ | -------: | ---------------------------- |
| install, license, watermark, package manager, CDN                        | Core/PRO | `refs/installation.md`       |
| grid setup, reactivity, events, API extensions, headless mode, animations, scroll flash, initial viewport | Core/PRO | `refs/grid-core.md` |
| TypeScript, `GridSpec`, row node types                                   | Core/PRO | `refs/typescript.md`         |
| columns, sizing, pinning, visibility, groups, headers                    | Core/PRO | `refs/columns.md`            |
| row height, row pinning, row drag, full-width rows, master-detail, row banding, zebra striping | Core/PRO | `refs/rows.md`      |
| row selection, checkbox selection, linked/isolated selection             | Core/PRO | `refs/row-selection.md`      |
| client data, sorting, filtering, grouping, aggregation                   | Core/PRO | `refs/client-data-source.md` |
| cell renderers, tooltips, diff flashing, cell/range selection, clipboard | Core/PRO | `refs/cells.md`              |
| cell editing, validation, editors, bulk edit                             | Core/PRO | `refs/cell-editing.md`       |
| text/number/date/set/tree-set filters, quick search                      | Core/PRO | `refs/filtering.md`          |
| CSV, Excel, Parquet, Arrow, clipboard export                             | Core/PRO | `refs/export.md`             |
| themes, CSS tokens, Tailwind, CSS Modules, Emotion                       | Core/PRO | `refs/theming.md`            |
| shadcn/ui setup or `ln-shadcn`                                           | Core/PRO | `refs/shadcn.md`             |
| keyboard, accessibility, RTL, React Compiler, bundling, security         | Core/PRO | `refs/misc.md`               |

## Ambiguous User Requests

| User says                 | Interpret as                                                                | Load                                               |
| ------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| “advanced filter”         | check whether they mean set/tree-set filter or PRO expression/having filter | `refs/filtering.md`, maybe `refs/expressions.md`   |
| “tree”                    | could mean TreeView component or tree data                                  | `refs/components.md` or `refs/tree-data-source.md` |
| “grouping”                | usually client row grouping unless server-side data is mentioned            | `refs/client-data-source.md`                       |
| “pagination”              | usually server paginated rows                                               | `refs/infinite-paginated-source.md`                |
| “context menu”            | prebuilt Menu component                                                     | `refs/components.md`                               |
| “custom visibility panel” | custom Core implementation or PRO ColumnManager                             | `refs/columns.md`, maybe `refs/components.md`      |
