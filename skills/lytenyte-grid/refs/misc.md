# Misc — Keyboard, RTL, Accessibility, React Compiler, Bundling, Security, Versioning

## Keyboard Shortcuts

LyteNyte Grid follows the [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

### Navigation

| Key                 | Action                     |
| ------------------- | -------------------------- |
| `↑ ↓ ← →`           | Move between cells/headers |
| `Ctrl →`            | Jump to last cell in row   |
| `Ctrl ←`            | Jump to first cell in row  |
| `Ctrl ↑`            | Jump to first row          |
| `Ctrl ↓`            | Jump to last row           |
| `PageDown / PageUp` | Move by visible row count  |
| `Home`              | First cell in row          |
| `End`               | Last cell in row           |
| `Ctrl Home`         | First cell, first row      |
| `Ctrl End`          | Last cell, last row        |

On macOS: use `Cmd` instead of `Ctrl`.

### Cell Selection (`cellSelectionMode="range"`)

| Key               | Action                  |
| ----------------- | ----------------------- |
| `Shift ↑↓←→`      | Expand/shrink selection |
| `Ctrl Shift ↑↓←→` | Expand to bounds        |
| `Ctrl A`          | Select all cells        |

### Editing

- `Enter` — enter edit mode
- `Enter` again — commit edit
- `Esc` — cancel edit
- Any printable character — enter edit mode with that character as initial value

### Custom Key Bindings

```tsx
<Grid
  events={useMemo<Grid.Events<GridSpec>>(
    () => ({
      row: {
        keyDown: ({ event, row, api }) => {
          if (event.key === " ") {
            event.preventDefault();
            api.rowSelect({ selected: row.id, deselect: api.rowIsSelected(row.id) });
          }
        },
      },
    }),
    [],
  )}
/>
```

Override all default bindings (caution — reduces accessibility):

```tsx
events={{ viewport: { keyDown: (p) => p.event.preventDefault() } }}
```

---

## RTL Support

```tsx
<Grid rtl ... />
```

The `rtl` prop must be set explicitly — LyteNyte Grid does not detect RTL from CSS `direction`. Uses logical CSS properties throughout, so no extra styling is required.

---

## Accessibility

- WCAG 2.0 A, AA, AAA compliant
- ARIA roles: `grid`, `row`, `rowgroup`, `columnheader`, `gridcell`
- Screen reader compatible: JAWS, VoiceOver
- ARIA attributes: `aria-rowcount`, `aria-colcount`, `aria-rowindex`, `aria-selected`, `aria-colindex`, `aria-expanded`, `aria-multiselectable`
- DOM order matches visual order even with virtualization

---

## React Compiler

Non-primitive props passed inline cause re-renders:

```tsx
// ❌ Creates new object every render
<Grid columnBase={{ width: 100 }} />

// ✓ Without compiler — memoize manually
<Grid columnBase={useMemo(() => ({ width: 100 }), [])} />

// ✓ With React compiler — no memoization needed
<Grid columnBase={{ width: 100 }} />
```

LyteNyte Grid requires no special configuration for the React Compiler. Install and configure the compiler per [React docs](https://react.dev/learn/react-compiler/introduction), and it works automatically.

---

## Bundling & Tree Shaking

LyteNyte Grid ships as ESM. Unused imports are automatically tree-shaken by Vite, Rollup, Rspack, Next.js, etc.:

```ts
// useServerDataSource is imported but unused — bundler removes it
import { useServerDataSource, useClientDataSource, Grid } from "@1771technologies/lytenyte-pro";
```

Best practices:

- Use ES module imports (not CommonJS `require`)
- Avoid `import * as All from "..."` — prevents tree shaking
- No special plugin needed — LyteNyte Grid is designed for static analysis

---

## Security

- **CSP**: Requires `style-src 'unsafe-inline'` (needed for virtualization layout). Popular frameworks (Vite, Next.js, React Router) include this by default.
- **No external dependencies** — nothing extra downloaded at install
- **No `eval`** — never used, not in any future version
- **No prototype mutation**
- **No telemetry** — works fully offline, no firewall configuration needed
- **No remote validation** — works in sandboxed environments
- Your app is responsible for securing data before passing it to the grid

Report security issues: support@1771technologies.com

---

## Versioning

LyteNyte Grid uses semver (major.minor.patch). All packages release under the same version (monorepo).

- **Patch** — bug fixes
- **Minor** — new features, backward compatible
- **Major** — breaking changes (always documented in changelog)

PRO license: 12 months of version access + support. Any version released during active license period can be used indefinitely.

---

## Gotchas

- **RTL is NOT auto-detected** — even setting CSS `direction: rtl` on the grid's parent has no effect. You must explicitly pass `<Grid rtl />`.
- **Overriding default key bindings reduces accessibility** — LyteNyte Grid's default keybindings implement the ARIA Grid Pattern required for screen reader compatibility. Use `preventDefault` on specific keys only, not on all `keyDown` events.
- **The React Compiler requires no special grid config** — if your project uses the React Compiler, LyteNyte Grid works with it automatically. No `"use no memo"` directives or special wrapping needed.
- **CSP `unsafe-inline` is required for layout** — LyteNyte Grid uses inline styles for cell sizing. Without it the grid renders completely unstyled with broken layout. This is a hard requirement, not configurable.

## Full Docs

- [Keyboard](/docs/keyboard)
- [RTL Support](/docs/rtl-support)
- [Accessibility](/docs/accessibility)
- [React Compiler](/docs/grid-react-compiler)
- [Bundling](/docs/prodready-bundling)
- [Security](/docs/prodready-security)
- [Versioning](/docs/prodready-grid-versioning)
- [Supported Browsers](/docs/prodready-supported-browsers)
