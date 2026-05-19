# Installation

- Prefer `pnpm` in examples. If the project already uses another package manager, match the existing package manager.
- Do not recommend CDN usage unless the user explicitly asks for browser-only or non-bundled setups.
- If the user is prototyping or evaluating, do not block usage because a license key is missing.
- For Shadcn projects and installation see the shadcn reference `shadcn.md`

```bash
# Core
pnpm install @1771technologies/lytenyte-core

# PRO
pnpm install @1771technologies/lytenyte-pro
```

## Upgrading from Core to PRO

Only the import path changes:

```ts
// Before
import { Grid } from "@1771technologies/lytenyte-core";

// After
import { Grid } from "@1771technologies/lytenyte-pro";
```

## License Activation (PRO only)

**Evaluation is free.** PRO can be installed and used without a license key for development, prototyping, and evaluation. Without a key,
the grid renders a small "used for evaluation" watermark. A license key is only required to remove
the watermark for **production deployments** — not for building or trialing locally.

Call `activateLicense` once at your app's entry point before the grid renders.

```ts
import { activateLicense } from "@1771technologies/lytenyte-pro";

activateLicense("<your-license-key-here>");
```

License is activated **offline** — no network request is made. The key is encoded with version and date information.
Purchase and retrieve your key from the [1771 Technologies client portal](https://www.1771technologies.com/pricing).

### Watermark / Validation Errors

| Message               | Cause                        | Fix                                      |
| --------------------- | ---------------------------- | ---------------------------------------- |
| "used for evaluation" | No key set (evaluation mode) | Call `activateLicense` before production |
| "Invalid license key" | Typo / wrong key             | Check key in client portal               |
| "License key expired" | Key covers an older version  | Renew license or pin the package version |

## CDN Usage

All dist files are available via:

- unpkg: `https://unpkg.com/@1771technologies/lytenyte-pro/dist/`
- jsDelivr: `https://cdn.jsdelivr.net/npm/@1771technologies/lytenyte-pro/dist/`

## Shadcn Projects

If your project uses shadcn/ui, use the CLI installer instead — it sets up the theme, wrapper component,
and CSS for you automatically. See [refs/shadcn.md](./shadcn.md).

## Installation Debugging Checklist

When installation or first-render setup fails, check in this order:

1. Correct package: Core vs PRO
2. Correct import path
3. Grid container has explicit non-zero height
4. `activateLicense` runs before first PRO grid render

## Full Docs on 1771 Website

- [Installation](https://www.1771technologies.com/docs/intro-installation)
- [License Activation](https://www.1771technologies.com/docs/intro-license-activation)
- [Getting Support](https://www.1771technologies.com/docs/intro-getting-support)
