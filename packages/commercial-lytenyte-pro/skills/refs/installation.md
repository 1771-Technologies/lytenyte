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

| Message | Cause | Fix |
|---|---|---|
| "used for evaluation" | No key set | Call `activateLicense` |
| "Invalid license key" | Typo / wrong key | Check key in client portal |
| "License key expired" | Key covers an older version | Renew license |

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
import "@1771technologies/lytenyte-pro/design.css";   // spacing/font tokens
import "@1771technologies/lytenyte-pro/grid.css";      // base grid styles
import "@1771technologies/lytenyte-pro/light.css";     // light color theme (pick one)
import "@1771technologies/lytenyte-pro/dark.css";      // dark color theme

// For UI components (SmartSelect, Menu, PillManager, etc.):
import "@1771technologies/lytenyte-pro/components.css";
```

Apply a theme by adding `ln-grid` + a theme class to a parent element:

```html
<html class="ln-light ln-grid">...</html>
```

## Gotchas

- **Missing CSS = silent broken layout** — the grid renders but columns have no styling, borders, or sizing. There's no console error. Always import the CSS.
- **`activateLicense` must run before the first grid render** — calling it lazily (e.g. in an effect) may show the watermark on the first frame. Call it at app entry point.
- **License key is version-encoded** — if you upgrade to a LyteNyte version released after your license expiry, you get "License key expired". Renew or pin the version.

## Full Docs

- [Installation](/docs/intro-installation)
- [License Activation](/docs/intro-license-activation)
- [Getting Support](/docs/intro-getting-support)
