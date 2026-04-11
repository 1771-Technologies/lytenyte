# LyteNyte Grid + shadcn/ui

LyteNyte Grid has first-class shadcn/ui support: a CLI-installable registry entry, a dedicated `ln-shadcn` theme that reads shadcn CSS tokens, and full compatibility with Tailwind and shadcn components as cell renderers, editors, and filter inputs.

**Step-by-step to get started in a shadcn project:**

1. Run the shadcn CLI command to add LyteNyte (installs the component + hook files)
2. Import `Grid` from the generated component file instead of directly from the package
3. Use `<Grid>` — the wrapper already applies `ln-grid ln-shadcn` and sizing

---

## CLI Installation (Recommended)

```bash
# Core edition (Apache 2.0, free)
npx shadcn@latest add @lytenyte/lytenyte-core

# PRO edition (commercial)
npx shadcn@latest add @lytenyte/lytenyte-pro
```

The shadcn CLI automatically locates the 1771 Technologies public registry under the `@lytenyte` namespace. Running the command adds two files to your project:

- `components/lytenyte-core.tsx` (or `lytenyte-pro.tsx`) — the pre-configured `<Grid>` wrapper
- `hooks/use-lytenyte-core.tsx` (or `use-lytenyte-pro.tsx`) — a convenience hook

Import from the generated component file:

```ts
import { Grid } from "@/components/lytenyte-core";
// or
import { Grid } from "@/components/lytenyte-pro";
```

## Manual Installation

If you prefer not to use the CLI:

```bash
npm install @1771technologies/lytenyte-core
# or
npm install @1771technologies/lytenyte-pro
```

Copy this wrapper component into your project:

```tsx
// components/lytenyte-pro.tsx  (or lytenyte-core.tsx)
import "@1771technologies/lytenyte-pro/design.css";
import "@1771technologies/lytenyte-pro/shadcn.css";
import "@1771technologies/lytenyte-pro/grid.css";
import { Grid } from "@1771technologies/lytenyte-pro";

export function LyteNyte<Spec extends Grid.GridSpec>(
  props: Grid.Props<Spec> &
    (undefined extends Spec["api"]
      ? unknown
      : {
          apiExtension: ((incomplete: Grid.API<Spec>) => Spec["api"] | null) | Spec["api"];
        }),
) {
  return (
    <div className="ln-grid ln-shadcn h-full w-full">
      <Grid {...props} />
    </div>
  );
}
```

> Import `design.css`, `shadcn.css`, and `grid.css` — **not** `grid-full.css`. The shadcn theme uses its own color layer; `grid-full.css` would bundle all prebuilt color themes unnecessarily.

---

## The `ln-shadcn` Theme

The `ln-shadcn` CSS class maps LyteNyte's design tokens to shadcn's standard CSS variables:

| LyteNyte token           | shadcn source                           |
| ------------------------ | --------------------------------------- |
| `--ln-bg`                | `--background`                          |
| `--ln-text`              | `--foreground`                          |
| `--ln-border`            | `--border`                              |
| `--ln-primary-50`        | `--primary`                             |
| `--ln-bg-floating-panel` | `--popover`                             |
| `--ln-bg-row-hover`      | `--accent-foreground` (10% mix)         |
| `--ln-gray-*`            | `color-mix(--background, --foreground)` |

**Light/dark mode works automatically.** Because `ln-shadcn` reads shadcn's tokens (not hardcoded colors), the grid updates whenever your shadcn theme changes — including when you add the `dark` class to `<html>`. No extra grid-specific dark-mode setup needed.

---

## Basic Usage

```tsx
import { Grid } from "@/components/lytenyte-pro";
import { useClientDataSource } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  readonly data: { name: string; price: number };
}

const data = [
  { name: "Widget A", price: 9.99 },
  { name: "Widget B", price: 24.99 },
];

function MyGrid() {
  const ds = useClientDataSource<GridSpec>({ data });
  return (
    <div style={{ height: 400 }}>
      <Grid<GridSpec>
        columns={[
          { id: "name", name: "Name" },
          { id: "price", name: "Price", type: "number" },
        ]}
        rowSource={ds}
        rowHeight={40}
      />
    </div>
  );
}
```

The wrapper div handles `ln-grid ln-shadcn h-full w-full` — the parent container just needs a defined height.

---

## Using shadcn Components Inside the Grid

### shadcn `Input` as a filter input

```tsx
import { Input } from "@/components/ui/input";

const columns = [
  {
    id: "name",
    floatingCellRenderer: ({ column, api }) => (
      <Input
        className="h-full rounded-none border-0 border-b text-xs"
        placeholder={`Filter ${column.name ?? column.id}...`}
        onChange={(e) => {
          // update your filter state
        }}
      />
    ),
  },
];
```

### shadcn `Button` in a header or cell

```tsx
import { Button } from "@/components/ui/button";

function ActionCell({ row, api }: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <Button variant="ghost" size="sm" onClick={() => api.rowDelete([row])}>
      Delete
    </Button>
  );
}
```

### shadcn `Select` as an edit renderer

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function StatusEditor({ editValue, changeValue, commit }: Grid.T.EditParams<GridSpec>) {
  return (
    <Select
      value={typeof editValue === "string" ? editValue : ""}
      onValueChange={(val) => {
        changeValue(val);
        commit(); // commit immediately on selection
      }}
    >
      <SelectTrigger className="h-full w-full rounded-none border-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

For popover-style edit renderers (like `Select`), set `editOnPrintable: false` on the column so the grid doesn't enter edit mode on every keypress:

```ts
{ id: "status", editRenderer: StatusEditor, editable: true, editOnPrintable: false }
```

### shadcn `Dialog` for row actions

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function EditRowDialog({ row, onClose }: { row: MyData; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {row.name}</DialogTitle>
        </DialogHeader>
        {/* form content */}
      </DialogContent>
    </Dialog>
  );
}
```

---

## Using `cn` with Grid Classes

shadcn projects already include a `cn` utility (from `@/lib/utils`). Use it for conditional grid cell styling:

```tsx
import { cn } from "@/lib/utils";

function MyCell({ row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const value = row.data.price;
  return (
    <div
      className={cn(
        "flex h-full items-center px-3 text-sm",
        column.type === "number" && "justify-end tabular-nums",
        value < 0 && "text-destructive",
        value > 1000 && "text-primary font-semibold",
      )}
    >
      {value}
    </div>
  );
}
```

---

## Context Menu with shadcn `DropdownMenu`

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { virtualFromXY } from "@1771technologies/lytenyte-pro";

const [anchor, setAnchor] = useState<Grid.T.VirtualTarget | null>(null);
const [menuData, setMenuData] = useState<{ row: Grid.T.RowNode<GridSpec>; column: Grid.T.Column<GridSpec> } | null>(null);

// In the grid:
events={useMemo(() => ({
  cell: {
    contextMenu: ({ event, row, column }) => {
      event.preventDefault();
      event.stopPropagation();
      setAnchor(virtualFromXY(event.clientX, event.clientY));
      setMenuData({ row, column });
    },
  },
}), [])}

// shadcn's DropdownMenu works with a virtual anchor via its open/onOpenChange pattern:
<DropdownMenu open={!!menuData} onOpenChange={(open) => { if (!open) { setMenuData(null); setAnchor(null); } }}>
  <DropdownMenuContent
    style={anchor ? { position: "fixed", left: anchor.getBoundingClientRect().x, top: anchor.getBoundingClientRect().y } : {}}
  >
    <DropdownMenuItem onClick={() => { /* copy */ }}>Copy</DropdownMenuItem>
    <DropdownMenuItem onClick={() => api.rowDelete([menuData!.row])}>Delete Row</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Alternatively, use LyteNyte's `Menu` component (from `@1771technologies/lytenyte-pro/components`) which natively supports `virtualFromXY` as an anchor — it's simpler for context menus.

---

## Customizing the Theme

Override any `ln-*` token in your global CSS (after the `ln-shadcn` import):

```css
/* Override LyteNyte tokens to match your shadcn customization */
.ln-shadcn {
  --ln-border-row: transparent; /* remove row divider lines */
  --ln-bg-row-alternate: var(--muted); /* use shadcn muted for alternating rows */
  --ln-radius-field-md: var(--radius); /* use shadcn's border radius */
}
```

Because `ln-shadcn` is just a CSS class, these overrides apply only within the scope of the grid wrapper — they don't leak into the rest of the page.

---

## Gotchas

- **Import `shadcn.css` + `design.css` + `grid.css`, not `grid-full.css`** — `grid-full.css` bundles all color themes (light, dark, teal, etc.). For shadcn projects, only `shadcn.css` is needed for colors, which keeps the bundle smaller.
- **Use the generated wrapper component** — import `Grid` from `@/components/lytenyte-pro` (the generated file), not directly from `@1771technologies/lytenyte-pro`. The wrapper applies `ln-grid ln-shadcn` — without these classes the grid has no styles.
- **Parent needs a defined height** — the wrapper uses `h-full w-full`, so the parent must have an explicit height. A flex container with `flex: 1` or a fixed pixel height both work.
- **`editOnPrintable: false` for popover/select editors** — shadcn `Select`, `Combobox`, and similar components rely on keyboard input. Without `editOnPrintable: false`, the grid intercepts keystrokes and activates edit mode on every character key.
- **`cn` already exists — don't recreate it** — shadcn projects ship `@/lib/utils` with a `cn` function. Use it instead of rolling your own `clsx`/`twMerge` combo.
- **Dark mode is automatic if you use shadcn's dark mode setup** — the `ln-shadcn` theme reads `--background`, `--foreground`, etc. which shadcn's dark mode already updates. No additional grid configuration is needed for dark mode.
- **PRO license only required for production** — evaluation and development are free; the grid works without a key and shows a small watermark. The shadcn CLI installation does not activate a PRO license. Before deploying to production, call `activateLicense("<key>")` at your app entry point (before the grid renders) to remove the watermark.

## Full Docs

- [Installation with Shadcn](/docs/intro-installation-shadcn)
- [Grid Theming](/docs/grid-theming)
- [Theming with Tailwind](/docs/grid-theming-tailwind)
