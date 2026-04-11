# Installation & Licensing

LyteNyte Grid ships in two editions:

- **Core** (`@1771technologies/lytenyte-core`) — Apache 2.0, free, open-source. Essential grid features.
- **PRO** (`@1771technologies/lytenyte-pro`) — Commercial license. Everything in Core plus server-side data, pivoting, tree data, expressions, and more.

## Installation

```bash
# Core
npm install @1771technologies/lytenyte-core

# PRO
npm install @1771technologies/lytenyte-pro
```

## Upgrading Core → PRO

Only the import path changes:

```ts
// Before
import { Grid } from "@1771technologies/lytenyte-core";

// After
import { Grid } from "@1771technologies/lytenyte-pro";
```

## License Activation (PRO only)

Call `activateLicense` once before the grid renders — at your app's entry point. It is safe to call multiple times.

```ts
import { activateLicense } from "@1771technologies/lytenyte-pro";

activateLicense("<your-license-key-here>");
```

Validation is **offline** — no network request is made. The key is encoded with version and date information.

### Watermark / Validation Errors

| Message               | Cause                       | Fix                        |
| --------------------- | --------------------------- | -------------------------- |
| "used for evaluation" | No key set                  | Call `activateLicense`     |
| "Invalid license key" | Typo / wrong key            | Check key in client portal |
| "License key expired" | Key covers an older version | Renew license              |

## CDN Usage

All dist files are available via:

- unpkg: `https://unpkg.com/@1771technologies/lytenyte-pro/dist/`
- jsDelivr: `https://cdn.jsdelivr.net/npm/@1771technologies/lytenyte-pro/dist/`

## CSS Import

The grid requires its own stylesheet. Import it before the grid renders — a missing import produces broken layout with no error:

```ts
// Import everything (all themes + grid styles)
import "@1771technologies/lytenyte-pro/grid-full.css";

// Or selectively (smaller bundle):
import "@1771technologies/lytenyte-pro/design.css"; // spacing/font tokens
import "@1771technologies/lytenyte-pro/grid.css"; // base grid styles
import "@1771technologies/lytenyte-pro/light.css"; // light color theme (pick one)
import "@1771technologies/lytenyte-pro/dark.css"; // dark color theme

// For UI components (SmartSelect, Menu, PillManager, etc.):
import "@1771technologies/lytenyte-pro/components.css";
```

Apply a theme by adding `ln-grid` + a theme class to a parent element:

```html
<html class="ln-light ln-grid">
  ...
</html>
```

## Recommended Minimal Setup

```tsx
// 1. Import CSS (must come before the grid renders)
import "@1771technologies/lytenyte-pro/light-dark.css"; // includes light + dark theme + grid styles

// 2. Activate license (PRO only) — do this once at app entry
import { activateLicense } from "@1771technologies/lytenyte-pro";
activateLicense("<your-license-key>");

// 3. Build the grid
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";

interface GridSpec {
  readonly data: { name: string; price: number };
}

function MyGrid() {
  const ds = useClientDataSource<GridSpec>({ data: myData });
  return (
    <div className="ln-grid" style={{ height: 500 }}>
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

Apply a theme by adding `ln-grid` + a theme class to a parent:

- `ln-light` — light mode
- `ln-dark` — dark mode
- `ln-teal`, `ln-shadcn`, `ln-cotton-candy` — colored themes
- `ln-grid` alone — no color, just structure (headless)

Or use `light-dark.css` + the `ln-grid` class and rely on the OS `prefers-color-scheme` media query.

## Gotchas

- **CSS import is only required for prebuilt themes** — LyteNyte Grid is headless by design. Skipping the CSS import means you must provide your own styles (via headless mode, Tailwind, CSS Modules, or Emotion). The grid is still fully functional without the import — it just has no built-in visual styling.
- **`activateLicense` must run before the first grid render** — calling it lazily (e.g. in an effect) may show the watermark on the first frame. Call it at app entry point.
- **License key is version-encoded** — if you upgrade to a LyteNyte version released after your license expiry, you get "License key expired". Renew or pin the version.
- **The `ln-grid` class must be on an ancestor of `<Grid />`** — the grid uses CSS custom properties (CSS variables) defined by the `ln-grid` class. If you put the class on the grid's container but the theme class on `<html>`, the grid will be unstyled. Ensure both `ln-grid` and the theme class are on the same ancestor (or both on `<html>`).
- **`light-dark.css` vs `grid-full.css`** — `light-dark.css` is the documentation demos' import: it includes both the light and a `.dark`-class dark variant. `grid-full.css` includes all themes. For production, use the selective imports approach to minimize bundle size.

## Full Docs

- [Installation](/docs/intro-installation)
- [License Activation](/docs/intro-license-activation)
- [Getting Support](/docs/intro-getting-support)
