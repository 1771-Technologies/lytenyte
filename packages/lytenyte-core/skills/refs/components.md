# UI Components (PRO)

All components are in `@1771technologies/lytenyte-pro/components`. Most are PRO-only.

```ts
import { PillManager, SmartSelect, ColumnManager, Menu, Popover, Dialog, SelectAll, Checkbox, TreeView, RowGroupCell, ViewportShadows } from "@1771technologies/lytenyte-pro/components";
```

Prebuilt styles (optional — or style yourself):

```ts
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/pill-manager.css";
```

All components are **unstyled by default**. They expose `data-*` attributes for styling. Components accept standard HTML props plus the extras documented below.

**SlotComponent** — a render prop type. Accepts a React element or a function receiving state:

```tsx
<SelectAll slot={<div>Custom</div>} />
<SelectAll slot={(p) => <div onClick={p.toggle}>Custom</div>} />
```

---

## SelectAll

Use in a column header or anywhere with API access. Handles both linked and isolated selection modes.

```tsx
import { SelectAll, Checkbox } from "@1771technologies/lytenyte-pro/components";

<SelectAll
  api={params.api}
  slot={({ indeterminate, selected, toggle }) => (
    <Checkbox
      checked={selected}
      indeterminate={indeterminate}
      onClick={(ev) => { ev.preventDefault(); toggle(); }}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") toggle(); }}
    />
  )}
/>
```

Props: `api` (required), `slot` (SlotComponent — receives `{ indeterminate, selected, toggle }`).

---

## SmartSelect

Headless combobox/select. Four modes — must match `kind` with the correct `trigger`:

| `kind` | `trigger` | `value` type |
|---|---|---|
| `"basic"` | `SmartSelect.BasicTrigger` | `T \| null` |
| `"combo"` | `SmartSelect.ComboTrigger` | `T \| null` |
| `"multi"` | `SmartSelect.MultiTrigger` | `T[]` |
| `"multi-combo"` | `SmartSelect.MultiComboTrigger` | `T[]` |

Each option must have a unique `id`.

```tsx
// Basic single select
<SmartSelect
  kind="basic"
  value={value}
  options={options}
  onOptionChange={(v) => v && setValue(v)}
  container={<SmartSelect.Container className="max-h-75 overflow-auto" />}
  trigger={
    <SmartSelect.BasicTrigger className="flex min-w-48 justify-between gap-2">
      {value.label}
      <ChevronDownIcon />
    </SmartSelect.BasicTrigger>
  }
>
  {(p) => (
    <SmartSelect.Option {...p} className="flex items-center justify-between">
      <div>{p.option.label}</div>
      {p.selected && <CheckIcon />}
    </SmartSelect.Option>
  )}
</SmartSelect>
```

For multi select, render chips inside the trigger:

```tsx
<SmartSelect kind="multi" value={selected} options={options} onOptionChange={setSelected}
  trigger={
    <SmartSelect.MultiTrigger>
      {selected.map(o => <SmartSelect.Chip key={o.id} option={o} />)}
    </SmartSelect.MultiTrigger>
  }
>
  {(p) => <SmartSelect.Option {...p}>{p.option.label}</SmartSelect.Option>}
</SmartSelect>
```

Async options (combo/multi-combo — return a Promise):

```tsx
<SmartSelect
  kind="multi-combo"
  options={async (query) => fetchOptions(query)}
  clearOnQuery  // clear stale results while loading
  searchDebounceMs={200}
  ...
/>
```

Key props: `open`/`onOpenChange`, `closeOnSelect` (default true), `clearOnSelect`, `clearOnQuery`, `searchDebounceMs`.

---

## Menu

Headless dropdown menu with nested submenus, radio groups, and checkboxes.

```tsx
<Menu anchor={anchor} open={isOpen} onOpenChange={setOpen}>
  <Menu.Trigger />       {/* or use anchor prop for virtual anchors */}
  <Menu.Popover>
    <Menu.Container>
      <Menu.Title className="sr-only">Actions</Menu.Title>
      <Menu.Item onAction={() => doCopy()}>Copy</Menu.Item>
      <Menu.Item onAction={() => doDelete()} disabled={!canDelete}>Delete</Menu.Item>
      <Menu.Divider />
      <Menu.RadioGroup value={sort} onChange={setSort}>
        <Menu.RadioItem value="asc">Ascending</Menu.RadioItem>
        <Menu.RadioItem value="desc">Descending</Menu.RadioItem>
      </Menu.RadioGroup>
      <Menu.CheckboxItem checked={pinned} onCheckChange={setPinned}>Pin Column</Menu.CheckboxItem>
      <Menu.Submenu>
        <Menu.SubmenuTrigger>More options</Menu.SubmenuTrigger>
        <Menu.SubmenuContainer>
          <Menu.Item onAction={() => {}}>Option A</Menu.Item>
        </Menu.SubmenuContainer>
      </Menu.Submenu>
    </Menu.Container>
  </Menu.Popover>
</Menu>
```

Key props on `Menu`: `open`, `onOpenChange`, `anchor` (HTMLElement, VirtualElement, or selector string), `placement`, `sideOffset`, `modal` (default true), `lockScroll`, `focusTrap`.

---

## Context Menu

Use `virtualFromXY` to create an anchor at the cursor, then pass it to `Menu`:

```tsx
import { virtualFromXY } from "@1771technologies/lytenyte-pro";

const [anchor, setAnchor] = useState<Grid.T.VirtualTarget | null>(null);
const [menuData, setMenuData] = useState<{ row, column } | null>(null);

<Grid
  events={useMemo(() => ({
    cell: {
      contextMenu: ({ event, row, column }) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchor(virtualFromXY(event.clientX, event.clientY));
        setMenuData({ row, column });
      },
    },
    headerCell: {
      contextMenu: ({ event, column }) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchor(virtualFromXY(event.clientX, event.clientY));
        setMenuData({ row: null, column });
      },
    },
  }), [])}
/>

<Menu anchor={anchor} open={!!menuData} modal={false} lockScroll
  onOpenChange={(b) => { if (!b) { setMenuData(null); setAnchor(null); } }}
>
  <Menu.Popover>
    <Menu.Container>
      <Menu.Item onAction={() => { /* ... */ }}>Copy Cell</Menu.Item>
    </Menu.Container>
  </Menu.Popover>
</Menu>
```

---

## Popover

Anchored overlay. Headless — assemble parts manually.

```tsx
<Popover open={open} onOpenChange={setOpen} placement="bottom-start">
  <Popover.Trigger />
  <Popover.Container>
    <Popover.Arrow />
    <Popover.Title>Filter</Popover.Title>
    <Popover.Description>Apply column filter</Popover.Description>
    {/* content */}
    <Popover.Close />
  </Popover.Container>
</Popover>
```

Key props: `open`, `onOpenChange`, `anchor`, `placement`, `sideOffset`, `modal`, `focusTrap`, `lightDismiss`, `lockScroll`.

---

## Dialog

Same API shape as Popover but semantically a dialog (modal by default).

```tsx
<Dialog open={open} onOpenChange={setOpen} modal>
  <Dialog.Trigger />
  <Dialog.Container>
    <Dialog.Title>Confirm Delete</Dialog.Title>
    <Dialog.Description>This cannot be undone.</Dialog.Description>
    <button onClick={doDelete}>Delete</button>
    <Dialog.Close />
  </Dialog.Container>
</Dialog>
```

Key props: same as Popover. `modal` defaults to true for Dialog. Use `lightDismiss` to close on outside click.

---

## PillManager (PRO)

Headless drag-and-drop pill UI for managing column visibility, grouping, pivoting, etc.

```tsx
import { PillManager } from "@1771technologies/lytenyte-pro/components";

<PillManager
  rows={pillRows}
  onPillItemActiveChange={({ index, item, row }) => {
    // item.active toggled — update your row state
  }}
  onPillRowChange={({ changed, full }) => {
    // pills reordered or moved between rows
  }}
/>
```

Default rendering (no children prop) uses built-in layout. Headless rendering:

```tsx
<PillManager rows={pillRows} onPillItemActiveChange={...} onPillRowChange={...}>
  {(row) => (
    <PillManager.Row row={row}>
      <PillManager.Label row={row} />
      <PillManager.Container>
        {row.pills.map((pill) => (
          <PillManager.Pill key={pill.id} item={pill} />
        ))}
      </PillManager.Container>
      <PillManager.Expander />
    </PillManager.Row>
  )}
</PillManager>
```

`PillItemSpec`:

```ts
interface PillItemSpec {
  id: string;
  active: boolean;
  name?: string;
  movable?: boolean;      // enable drag
  tags?: string[];        // tags this pill can be moved to other rows with
  removable?: boolean;
}
```

`PillRowSpec`:

```ts
interface PillRowSpec {
  id: string;
  pills: PillItemSpec[];
  accepts?: string[];     // tags from other rows that this row accepts
  label?: string;
  type?: "columns" | "row-groups" | "row-pivots" | "column-pivots" | "measures" | string;
}
```

`onPillItemThrown` — fires when a pill is dragged outside the PillManager entirely.

---

## ColumnManager (PRO)

Opinionated column visibility/order UI — wraps PillManager complexity.

```tsx
<ColumnManager
  columns={columns}
  onColumnsChange={setColumns}
  endElement={({ columns, row }) => <MyColumnMenu />}
/>
```

For more control, use PillManager or TreeView directly.

---

## TreeView (PRO)

Specialized single-column grid for hierarchical lists (set filters, file trees, etc.).

```tsx
interface TreeViewItem {
  id: string;
  path: string[];   // determines tree structure
  name?: string;
}

<TreeView items={flatItems} defaultExpansion={1} />
```

`defaultExpansion`: `true` (all), `false` (none), or `number` (expand depth ≤ N).

Controlled selection:

```tsx
const ref = useRef<TreeViewAPI | null>(null);
// ref.current.rowsSelected() — get selected items

<TreeView
  items={items}
  rowSelection={rowsSelected}
  onRowSelectionChange={setSelection}
/>
```

Selection is `RowSelectionLinked` — traverse the tree to find selected leaf items.

Custom rendering:

```tsx
<TreeView items={items}>
  {({ row, toggle, selected, indeterminate, select }) => (
    <div>
      <Checkbox checked={selected} indeterminate={indeterminate} onChange={select} />
      <span onClick={toggle}>{row.kind === "branch" ? row.id : row.data.name}</span>
    </div>
  )}
</TreeView>
```

---

## RowGroupCell (PRO)

Cell renderer for group expansion. Drop-in for the group column:

```ts
const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};
```

Customize labels by wrapping:

```tsx
function MyGroupCell(props: Grid.T.CellRendererParams) {
  return (
    <RowGroupCell
      {...props}
      leafLabel={(row, api) => <span>{row.data.name}</span>}
      groupLabel={(row, api) => <strong>{row.id}</strong>}
    />
  );
}
```

Handles: expand/collapse, loading indicators, error indicators, non-expandable node padding.

---

## Grid Overlays

### Viewport Overlay

Renders above entire grid (use for loading screens):

```tsx
<Grid
  slotViewportOverlay={
    isLoading ? (
      <div className="z-12 sticky left-0 top-0 flex h-0 w-0">
        <div className="w-(--ln-vp-width) h-(--ln-vp-height) absolute left-0 top-0 flex items-center justify-center bg-white/80">
          Loading...
        </div>
      </div>
    ) : null
  }
/>
```

`z-index` must be ≥ 12 (grid header/rows max z-index is 11).

### Rows Overlay

Renders inside rows container (use for "No Rows" indicator):

```tsx
<Grid
  slotRowsOverlay={
    rowCount === 0 ? (
      <div className="z-12 sticky left-0 top-0 flex h-0 w-0">
        <div className="w-(--ln-vp-width) absolute left-0 top-0 flex items-center justify-center pt-12">
          No Rows
        </div>
      </div>
    ) : null
  }
/>
```

Use `--ln-vp-width` / `--ln-vp-height` CSS variables to match viewport size.

---

## ViewportShadows

Shows scroll-position-aware shadows for pinned columns/rows:

```tsx
<Grid slotShadows={ViewportShadows} />

// slotShadows requires a component function (not an element)
// To configure, wrap it:
function MyShadows() {
  return <ViewportShadows start={false} end top bottom />;
}
<Grid slotShadows={MyShadows} />
```

Props: `start`, `end`, `top`, `bottom` (all boolean, default true). Requires CSS styles — prebuilt themes include them, or style via `data-ln-y-status` / `data-ln-x-status` attributes (`"none"` | `"partial"` | `"full"`).

---

## Gotchas

- **`SmartSelect` `kind` must match `trigger`** — using `kind="multi"` with `SmartSelect.BasicTrigger` (instead of `SmartSelect.MultiTrigger`) causes broken UI with no error. Each `kind` has a corresponding trigger component.
- **Multi-select chips must use `SmartSelect.Chip`** — using a plain `<span>` for selected chips breaks keyboard navigation (the component can't locate chip elements to handle backspace-delete). Always render chips inside `SmartSelect.Chip`.
- **`slotShadows` requires a component, not an element** — `<Grid slotShadows={<ViewportShadows />} />` fails. It must be `<Grid slotShadows={ViewportShadows} />`. To pass props, wrap: `const MyShadows = () => <ViewportShadows start={false} />`.
- **Viewport overlay z-index must be ≥ 12** — the grid's header and rows use z-index up to 11. An overlay with `z-index: 10` will appear behind the grid content.
- **Context menu: always call both `preventDefault` and `stopPropagation`** — `preventDefault` suppresses the browser native menu; `stopPropagation` prevents the event from reaching a parent that might trigger another menu.
- **`Menu` without `anchor` defaults to `Menu.Trigger`** — for context menus where there's no trigger element, always set `anchor` explicitly (e.g. `virtualFromXY(x, y)`).

## Full Docs

- [Components Overview](/docs/component-overview)
- [SelectAll](/docs/component-select-all)
- [SmartSelect](/docs/component-smart-select)
- [Menu Button](/docs/component-menu-button)
- [Context Menu](/docs/component-context-menu)
- [Popover](/docs/component-popover)
- [Dialog](/docs/component-dialog)
- [PillManager](/docs/component-pill-manager)
- [ColumnManager](/docs/component-column-manager)
- [TreeView](/docs/component-tree-view)
- [RowGroupCell](/docs/component-row-group-cell)
- [Grid Overlays](/docs/component-grid-overlays)
- [ViewportShadows](/docs/component-viewport-shadows)
