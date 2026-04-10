# Theming

LyteNyte Grid is **headless by default** — no colors, fonts, or borders applied. Functional inline styles (sizing, positioning) are applied automatically and must not be overridden.

## Pre-built Themes

```ts
// Import all themes + grid styles
import "@1771technologies/lytenyte-core/grid-full.css";  // Core
import "@1771technologies/lytenyte-pro/grid-full.css";   // PRO
```

Apply by adding `ln-grid` + a theme class to a parent element (e.g. `<html>` or `<body>`):

```html
<html class="ln-teal">
  <body class="ln-grid">...</body>
</html>
```

Available themes: `ln-teal`, `ln-term`, `ln-dark`, `ln-light`, `ln-shadcn`, `ln-cotton-candy`.

### Selective CSS Imports

```css
@import "@1771technologies/lytenyte-pro/design.css";      /* spacing/font tokens (no colors) */
@import "@1771technologies/lytenyte-pro/grid.css";        /* base grid styles */
@import "@1771technologies/lytenyte-pro/dark.css";        /* single color theme */
@import "@1771technologies/lytenyte-pro/light.css";
@import "@1771technologies/lytenyte-pro/shadcn.css";
@import "@1771technologies/lytenyte-pro/teal.css";
@import "@1771technologies/lytenyte-pro/light-dark.css";  /* light + .dark class variant */
@import "@1771technologies/lytenyte-pro/all-colors.css";  /* all color themes */
@import "@1771technologies/lytenyte-pro/grid-full.css";   /* everything */
```

---

## Data Attribute Styling

Grid elements expose `data-ln-*` attributes. Use CSS attribute selectors to target them:

```css
/* Common attributes */
[data-ln-cell="true"]         { /* grid cell */ }
[data-ln-header-cell="true"]  { /* header cell */ }
[data-ln-header-group="true"] { /* column group header */ }
[data-ln-row="true"]          { /* row */ }
[data-ln-alternate="true"]    { /* alternating row */ }
[data-ln-type="number"]       { justify-content: flex-end; }
[data-ln-colpin="start"]      { /* pinned start column */ }
[data-ln-last-start-pin]      { /* last column in start pin area */ }
[data-ln-first-end-pin]       { /* first column in end pin area */ }
[data-ln-row-detail="true"]   { /* row detail/master-detail container */ }
[data-ln-cell-selection-rect] { /* cell selection rectangle (PRO) */ }
```

Cell selection rectangle attributes: `data-ln-cell-selection-border-top/bottom/start/end`.

Scroll shadow attributes: `data-ln-y-status`, `data-ln-x-status` — values: `"none"` | `"partial"` | `"full"`.

Example custom theme:

```css
.my-grid {
  [data-ln-cell="true"] {
    display: flex;
    align-items: center;
    padding-inline: 8px;
    background-color: light-dark(white, hsl(190, 32%, 6%));
    color: light-dark(hsl(175, 6%, 38%), hsl(175, 10%, 86%));
    font-size: 14px;
    border-bottom: 1px solid light-dark(hsl(175, 20%, 95%), hsl(177, 19%, 17%));
  }
  [data-ln-alternate="true"] [data-ln-cell="true"] {
    background-color: light-dark(hsl(0, 27%, 98%), hsl(184, 33%, 8%));
  }
  [data-ln-header-cell="true"] {
    display: flex;
    align-items: center;
    padding-inline: 8px;
    background-color: light-dark(hsl(175, 12%, 92%), hsl(177, 19%, 17%));
    font-size: 14px;
  }
}
```

---

## CSS Variable Tokens

The prebuilt themes define CSS variables you can override. Key ones:

- `--ln-bg`, `--ln-bg-alt` — cell backgrounds
- `--ln-border`, `--ln-border-strong` — borders
- `--ln-primary-30`, `--ln-primary-50` — primary accent colors
- `--ln-space-40`, `--ln-space-60` — spacing
- `--ln-radius-field-md` — border radius
- `--ln-vp-width`, `--ln-vp-height` — viewport dimensions (read-only, set by grid)
- `--ln-row-depth` — current row depth for group indentation
- `--ln-start-offset` — inline-start offset for sticky positioning

See [design.css](https://github.com/1771-Technologies/lytenyte/blob/main/packages/lytenyte-design/src/design.css) and [ln-dark.css](https://github.com/1771-Technologies/lytenyte/blob/main/packages/lytenyte-design/src/themes/ln-dark.css) for the full token list.

---

## Styling Methods

### className on headless components

```tsx
<Grid.Cell key={c.id} cell={c} className="flex items-center px-2 bg-white text-sm" />
<Grid.HeaderCell cell={c} key={c.id} className="flex items-center bg-gray-100 px-2 font-medium" />
```

### Inline styles

```tsx
<Grid.Cell key={c.id} cell={c} style={{ display: "flex", background: cellBg, color: cellFg }} />
```

Avoid for every element — use selectively for dynamic values.

### `styles` prop (style overrides without headless mode)

```tsx
<Grid
  styles={{
    headerGroup: {
      style: {
        position: "sticky",
        insetInlineStart: "var(--ln-start-offset)",
        overflow: "unset",
      },
    },
    // Targets: cell, headerCell, headerGroup, row, rowsContainer, viewport, header
  }}
/>
```

No memoization needed — the grid diffs styles and re-notifies cells on change.

---

## Tailwind

```css
/* In your CSS entry file: */
@import "tailwindcss";
@import "@1771technologies/lytenyte-pro/tw.css";  /* LyteNyte Tailwind variants */

/* Layer order when mixing with prebuilt themes: */
@layer base, ln-grid, components, utilities;
```

Apply classes directly:

```tsx
<Grid.Cell key={c.id} cell={c} className="flex items-center bg-gray-50 px-2 text-sm text-gray-800" />
```

LyteNyte Tailwind variants (after importing `tw.css`):

```tsx
<Grid className="ln-cell:bg-ln-bg" />
```

CVA pattern for conditional variants:

```ts
import { cva } from "class-variance-authority";

const cellStyles = cva("flex items-center px-2", {
  variants: {
    number: { true: "justify-end tabular-nums" },
    rowBase: { true: "border-b bg-white text-sm group-data-[ln-alternate=true]:bg-neutral-100" },
    header: { true: "bg-neutral-200 text-sm capitalize" },
  },
});

// Usage:
<Grid.Cell key={c.id} cell={c} className={cellStyles({ number: c.type === "number", rowBase: true })} />
```

Style row detail with Tailwind arbitrary selectors:

```tsx
<Grid.Row row={row} className='**:data-[ln-row-detail="true"]:p-7 [&_[data-ln-row-detail="true"]>div]:rounded-lg' />
```

---

## CSS Modules

```css
/* styles.module.css */
.cell {
  display: flex;
  align-items: center;
  padding-inline: 8px;
  &[data-ln-type="number"] { justify-content: flex-end; }
}
[data-ln-alternate="true"] .cell { background-color: hsl(0, 27%, 98%); }

.rowDetail {
  & [data-ln-row-detail="true"] { padding: 24px; }
  & [data-ln-row-detail="true"] > div { border: 1px solid gray; border-radius: 8px; }
}
```

```tsx
import styles from "./styles.module.css";
<Grid.Cell key={c.id} cell={c} className={styles.cell} />
<Grid.Row row={row} className={styles.rowDetail} />
```

---

## Emotion (CSS-in-JS)

```tsx
import styled from "@emotion/styled";

const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  font-size: 14px;
`;

const RowsContainer = styled(Grid.RowsContainer)`
  & [data-ln-row-detail="true"] { padding: 24px; }
  & [data-ln-cell-selection-rect] { background-color: var(--ln-primary-30); }
`;
```

---

## Layout Constraints

**Do not override** functional inline styles: `width`, `height`, `top`, `left`, `transform`. Do not apply `margin` to grid elements — it interferes with layout calculations.

---

## Gotchas

- **Tailwind layer order** — when mixing Tailwind with LyteNyte prebuilt themes, Tailwind styles may override grid styles. Fix with: `@layer base, ln-grid, components, utilities;` in your CSS entry file.
- **Do not override functional inline styles** — `width`, `height`, `top`, `left`, `transform` are set inline for layout/virtualization. Overriding them with CSS breaks cell positioning. These have high specificity and will resist normal class selectors, but `!important` can accidentally override them.
- **The `styles` prop does not need memoization** — unlike most grid props, `styles` is diffed internally. Passing a new object reference each render is safe.
- **`data-ln-row-detail` and `data-ln-cell-selection-rect` are not directly accessible** — they're rendered by the grid internally. Target them via descendant CSS selectors on a parent element, not by applying classes directly.

## Full Docs

- [Grid Theming](/docs/grid-theming)
- [Theming with Tailwind](/docs/grid-theming-tailwind)
- [Theming with CSS Modules](/docs/grid-theming-css-modules)
- [Theming with Emotion](/docs/grid-theming-emotion)
