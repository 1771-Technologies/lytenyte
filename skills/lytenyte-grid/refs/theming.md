# Theming

LyteNyte Grid is **headless by default** — no colors, fonts, or borders are applied. The CSS import is optional: skip it and provide your own styles, or import a prebuilt theme for instant results. Functional inline styles (sizing, positioning) are applied automatically and must not be overridden.

**Quick theming decision guide:**

- **No CSS import** — bring your own styles entirely via headless mode, Tailwind, CSS Modules, or Emotion
- **Prebuilt theme** — import `grid-full.css` (or selective imports) and add `ln-grid` + a theme class to a parent element
- **Token overrides** — import a prebuilt theme, then override `--ln-*` CSS variables to customize colors/spacing
- **Tailwind plugin** — import `tw.css` for custom variants and LyteNyte color tokens as Tailwind utilities
- **`styles` prop** — targeted overrides on specific grid parts without entering headless mode

## Pre-built Themes

```ts
// Import all themes + grid styles
import "@1771technologies/lytenyte-core/grid-full.css"; // Core
import "@1771technologies/lytenyte-pro/grid-full.css"; // PRO
```

Apply by adding `ln-grid` + a theme class to a parent element (e.g. `<html>` or `<body>`):

```html
<html class="ln-teal">
  <body class="ln-grid">
    ...
  </body>
</html>
```

Available themes: `ln-teal`, `ln-term`, `ln-dark`, `ln-light`, `ln-shadcn`, `ln-cotton-candy`.

### Selective CSS Imports

For smaller bundles, import only what you need:

```css
@import "@1771technologies/lytenyte-pro/design.css"; /* spacing/font/radius/shadow tokens (no colors) */
@import "@1771technologies/lytenyte-pro/grid.css"; /* base grid styles */
@import "@1771technologies/lytenyte-pro/dark.css"; /* single color theme */
@import "@1771technologies/lytenyte-pro/light.css";
@import "@1771technologies/lytenyte-pro/shadcn.css";
@import "@1771technologies/lytenyte-pro/teal.css";
@import "@1771technologies/lytenyte-pro/light-dark.css"; /* light + .dark class variant */
@import "@1771technologies/lytenyte-pro/all-colors.css"; /* all color themes */
@import "@1771technologies/lytenyte-pro/grid-full.css"; /* everything */
```

---

## Design Tokens

LyteNyte Grid uses two layers of CSS variables:

1. **Structure tokens** (`design.css`) — spacing, radius, font sizes, shadows, typeface. Set on `:root`, theme-independent.
2. **Color tokens** (theme files like `light.css`, `dark.css`) — all colors as semantic aliases. Set on a theme class like `.ln-light`.

### Structure Tokens (`design.css`)

```css
/* Spacing scale */
--ln-space-02: 2px;   --ln-space-05: 4px;   --ln-space-10: 6px;
--ln-space-20: 8px;   --ln-space-25: 10px;  --ln-space-30: 12px;
--ln-space-40: 16px;  --ln-space-50: 20px;  --ln-space-60: 24px;
--ln-space-70: 32px;  --ln-space-80: 48px;  --ln-space-90: 64px;

/* Cell/field padding */
--ln-padding-horizontal-cell: 10px;
--ln-padding-vertical-cell: 8px;
--ln-padding-vertical-thead: 4px;
--ln-padding-field-sm: 4px;  --ln-padding-field-md: 6px;
--ln-padding-field-lg: 8px;  --ln-padding-field-xl: 12px;

/* Border radius */
--ln-radius: 6px;  --ln-radius-md: 8px;  --ln-radius-lg: 12px;
--ln-radius-field-sm: 6px;  --ln-radius-field-md: 8px;  --ln-radius-field-lg: 10px;

/* Font sizes */
--ln-font-xs: 10px;  --ln-font-sm: 12px;  --ln-font-md: 14px;  --ln-font-lg: 16px;

/* Typeface */
--ln-typeface: "Inter", system-ui, ...;

/* Shadows */
--ln-shadow-100 ... --ln-shadow-700;  /* elevation scale */
```

### Color Tokens (theme files)

Color tokens are semantic aliases into the `--ln-gray-*` / `--ln-primary-*` scales:

```css
/* Gray scale (00 = lightest/white, 100 = darkest) */
--ln-gray-00 ... --ln-gray-100

/* Primary accent (05 = most transparent, 90 = darkest) */
--ln-primary-05  --ln-primary-10  --ln-primary-30
--ln-primary-50  --ln-primary-70  --ln-primary-90

/* Status colors (10 = light tint, 50 = full, 90 = dark) */
--ln-red-10 ... --ln-red-90
--ln-yellow-10 ... --ln-yellow-90
--ln-green-10 ... --ln-green-90
--ln-info-10 ... --ln-info-90     /* neutral/gray info color */

/* Border semantics */
--ln-border              /* default border (between cells/header) */
--ln-border-row          /* row bottom border */
--ln-border-strong       /* pinned column separator */
--ln-border-xstrong      /* pinned row separator */
--ln-border-icon         /* icon stroke color */
--ln-border-ui-panel     /* panel/sidebar border */

/* Background semantics */
--ln-bg                  /* default grid background */
--ln-bg-ui-panel         /* header/panel background */
--ln-bg-row-hover        /* row hover overlay */
--ln-bg-row-alternate    /* alternating row background */
--ln-bg-floating-panel   /* floating panels/dropdowns */
--ln-bg-popover          /* popover background */
--ln-bg-form-field       /* form input background */

/* Text semantics */
--ln-text                /* body text */
--ln-text-dark           /* cell text (slightly darker than body) */
--ln-text-light          /* secondary/muted text */
--ln-text-xlight         /* placeholder/disabled text */
--ln-text-hyperlink      /* link color */
--ln-text-primary-button /* text on primary-colored buttons */

/* Runtime-only (read by grid, not for overriding) */
--ln-vp-width            /* current viewport width */
--ln-vp-height           /* current viewport height */
--ln-row-height          /* current row height */
--ln-row-depth           /* group nesting depth (for indentation) */
--ln-start-offset        /* inline-start offset for sticky elements */
```

---

## Tailwind Integration

### Setup

Import `tw.css` alongside `tailwindcss` in your CSS entry file:

```css
@import "tailwindcss";
@import "@1771technologies/lytenyte-pro/tw.css"; /* adds variants + Tailwind color tokens */

/* If mixing with prebuilt themes, declare layer order to prevent conflicts: */
@layer base, ln-grid, components, utilities;
```

### Tailwind Custom Variants

`tw.css` registers custom variants for every grid element. Apply them as prefixes on the `<Grid>` component or any ancestor with `ln-grid`:

```tsx
<Grid
  className={`ln-cell:bg-white ln-cell:text-sm ln-cell:px-2 ln-cell-alt:bg-gray-50 ln-header:bg-gray-100 ln-header:font-medium ln-header:text-xs ln-selected:bg-blue-50 ln-rect:bg-ln-primary-10 ln-rect-t:border-t ln-rect-b:border-b ln-rect-s:border-l ln-rect-e:border-r ln-rect-t:border-ln-primary-50 ln-rect-b:border-ln-primary-50 ln-rect-s:border-ln-primary-50 ln-rect-e:border-ln-primary-50`}
/>
```

Full variant reference:

| Variant                 | Targets                                               |
| ----------------------- | ----------------------------------------------------- |
| `ln-vp`                 | Viewport (`[data-ln-viewport="true"]`)                |
| `ln-header-container`   | Header container (`[data-ln-header="true"]`)          |
| `ln-header-row`         | Header row (`[data-ln-header-row="true"]`)            |
| `ln-header-group`       | Column group header (`[data-ln-header-group="true"]`) |
| `ln-header`             | Header cell (`[data-ln-header-cell="true"]`)          |
| `ln-header-marker`      | Marker column header cell                             |
| `ln-header-resizer`     | Column resize handle                                  |
| `ln-row`                | Row (`[data-ln-row="true"]`)                          |
| `ln-row-hover`          | Row hover overlay (`::before` on hover)               |
| `ln-row-selected-hover` | Selected row hover overlay                            |
| `ln-row-alt`            | Alternating row (`[data-ln-alternate="true"]`)        |
| `ln-row-full`           | Full-width row content `div`                          |
| `ln-detail`             | Row detail/master-detail container                    |
| `ln-selected`           | Selected row (`[data-ln-selected="true"]`)            |
| `ln-cell`               | Cell (`[data-ln-cell="true"]`)                        |
| `ln-cell-alt`           | Cell inside an alternating row                        |
| `ln-cell-marker`        | Marker column cell                                    |
| `ln-cell-selected`      | Cell inside a selected row                            |
| `ln-rect`               | Cell selection rectangle                              |
| `ln-rect-t`             | Cell selection rect — top border edge                 |
| `ln-rect-b`             | Cell selection rect — bottom border edge              |
| `ln-rect-s`             | Cell selection rect — start border edge               |
| `ln-rect-e`             | Cell selection rect — end border edge                 |

### Tailwind Color + Spacing Tokens

All `--ln-*` tokens are available as Tailwind utilities after importing `tw.css`:

```tsx
// Colors
<div className="bg-ln-bg text-ln-text border-ln-border" />
<div className="bg-ln-primary-10 text-ln-primary-50" />
<div className="bg-ln-gray-02 text-ln-gray-80" />
<div className="text-ln-red-50 bg-ln-green-10" />

// Spacing
<div className="px-ln-space-40 py-ln-space-20" />
<div className="rounded-ln-radius-field-md" />
```

Full color palette: `ln-gray-{00|01|02|05|10|20|30|40|50|60|70|80|90|100}`, `ln-primary-{05|10|30|50|70|90}`, `ln-red-{10|30|50|70|90}`, `ln-yellow-*`, `ln-green-*`, `ln-info-*`, plus all semantic tokens (`bg-ln-bg`, `text-ln-text`, `border-ln-border`, etc.).

### Styling Headless Components with Tailwind

For full control, apply Tailwind classes to each headless component:

```tsx
function MyGrid() {
  return (
    <Grid<GridSpec>
      rowSource={ds}
      columns={columns}
      rowHeight={40}
      className="ln-vp:border ln-vp:border-gray-200 ln-vp:rounded-lg"
    >
      {({ rows, columns }) => (
        <>
          <Grid.Header>
            {(headerRow) => (
              <Grid.HeaderRow headerRow={headerRow}>
                {(c) => (
                  <Grid.HeaderCell
                    key={c.id}
                    cell={c}
                    className="flex items-center border-b border-gray-200 bg-gray-100 px-3 text-xs font-semibold uppercase tracking-wide text-gray-600"
                  />
                )}
              </Grid.HeaderRow>
            )}
          </Grid.Header>
          <Grid.RowsContainer>
            {rows.map((row) => (
              <Grid.Row key={row.id} row={row}>
                {(c) => (
                  <Grid.Cell
                    key={c.id}
                    cell={c}
                    className="flex items-center border-b border-gray-100 bg-white px-3 text-sm text-gray-800 data-[ln-alternate=true]:bg-gray-50"
                  />
                )}
              </Grid.Row>
            ))}
          </Grid.RowsContainer>
        </>
      )}
    </Grid>
  );
}
```

### CVA Pattern (Class Variance Authority)

```ts
import { cva } from "class-variance-authority";

const cellStyles = cva("flex items-center px-3 text-sm border-b", {
  variants: {
    number:    { true: "justify-end tabular-nums" },
    alternate: { true: "bg-gray-50" },
    base:      { true: "bg-white text-gray-800 border-gray-100" },
    header:    { true: "bg-gray-100 font-medium text-gray-600 uppercase text-xs tracking-wide" },
  },
});

<Grid.Cell
  key={c.id}
  cell={c}
  className={cellStyles({ number: c.type === "number", base: true })}
/>
```

### Styling Cell Selection Rectangles

Use the `ln-rect*` variants on a parent container:

```tsx
<Grid.RowsContainer
  className={cn(
    "ln-rect:bg-ln-primary-10",
    "ln-rect-t:border-t ln-rect-t:border-ln-primary-50",
    "ln-rect-b:border-b ln-rect-b:border-ln-primary-50",
    "ln-rect-s:border-l ln-rect-s:border-ln-primary-50",
    "ln-rect-e:border-r ln-rect-e:border-ln-primary-50",
  )}
/>
```

### Styling Row Detail

```tsx
<Grid.Row
  row={row}
  className='**:data-[ln-row-detail="true"]:p-6 [&_[data-ln-row-detail="true"]>div]:rounded-lg [&_[data-ln-row-detail="true"]>div]:border [&_[data-ln-row-detail="true"]>div]:border-gray-200'
/>
```

---

## Data Attribute Styling

Grid elements expose `data-ln-*` attributes. Use CSS attribute selectors to target them directly:

```css
/* Common attributes */
[data-ln-cell="true"] {
  /* grid cell */
}
[data-ln-header-cell="true"] {
  /* header cell */
}
[data-ln-header-group="true"] {
  /* column group header */
}
[data-ln-row="true"] {
  /* row */
}
[data-ln-alternate="true"] {
  /* alternating row */
}
[data-ln-type="number"] {
  justify-content: flex-end;
}
[data-ln-colpin="start"] {
  /* pinned start column */
}
[data-ln-last-start-pin] {
  /* last column in start pin area */
}
[data-ln-first-end-pin] {
  /* first column in end pin area */
}
[data-ln-row-detail="true"] {
  /* row detail/master-detail container */
}
[data-ln-selected="true"] {
  /* selected row */
}
[data-ln-cell-selection-rect] {
  /* cell selection rectangle */
}
```

Cell selection rectangle attributes: `data-ln-cell-selection-rect`, `data-ln-cell-selection-border-top/bottom/start/end`, `data-ln-cell-selection-is-deselect` (for multi-range deselect regions). Headers and rows containing selected cells also get `data-ln-cell-selected="true"`.

Scroll shadow attributes: `data-ln-y-status`, `data-ln-x-status` — values: `"none"` | `"partial"` | `"full"`.

---

## Building a Custom Theme from Scratch

To fully own your theme without importing any LyteNyte CSS, replicate what `grid.css` + a color theme provide. The pattern is: define tokens → define colors → style elements.

### Step 1 — Define structure tokens

```css
:root {
  --ln-padding-horizontal-cell: 12px;
  --ln-padding-vertical-cell: 8px;
  --ln-font-md: 14px;
  --ln-typeface: "Inter", sans-serif;
  --ln-radius-field-md: 6px;
}
```

### Step 2 — Define color tokens on your theme class

```css
.my-theme {
  /* Gray scale */
  --ln-gray-00: #ffffff;
  --ln-gray-02: #f9fafb;
  --ln-gray-20: #e5e7eb;
  --ln-gray-30: #d1d5db;
  --ln-gray-50: #9ca3af;
  --ln-gray-70: #374151;
  --ln-gray-80: #1f2937;
  --ln-gray-90: #111827;

  /* Primary accent */
  --ln-primary-10: rgba(59, 130, 246, 0.1);
  --ln-primary-30: rgba(59, 130, 246, 0.3);
  --ln-primary-50: #3b82f6;

  /* Semantic aliases — what grid.css reads */
  --ln-border: var(--ln-gray-20);
  --ln-border-row: var(--ln-gray-20);
  --ln-border-strong: var(--ln-gray-30);
  --ln-border-xstrong: var(--ln-gray-50);
  --ln-bg: var(--ln-gray-02);
  --ln-bg-ui-panel: var(--ln-gray-00);
  --ln-bg-row-hover: rgba(0, 0, 0, 0.03);
  --ln-bg-row-alternate: var(--ln-gray-02);
  --ln-text: var(--ln-gray-70);
  --ln-text-dark: var(--ln-gray-90);
}
```

### Step 3 — Style each grid element

Scope everything inside `.ln-grid` to prevent bleeding:

```css
.my-theme.ln-grid {
  /* Viewport */
  [data-ln-viewport="true"] {
    border: 1px solid var(--ln-border);
    font-family: var(--ln-typeface);
    font-size: var(--ln-font-md);
    user-select: none;
    scrollbar-width: thin;
  }

  /* Header cells */
  [data-ln-header-cell="true"] {
    display: flex;
    align-items: center;
    padding-inline: var(--ln-padding-horizontal-cell);
    background-color: var(--ln-bg-ui-panel);
    color: var(--ln-text);
    font-weight: 500;
    border-bottom: 1px solid var(--ln-border);
    &[data-ln-type="number"] {
      justify-content: flex-end;
    }
    /* Column separator */
    &::before {
      content: "";
      position: absolute;
      top: 8px;
      inset-inline-end: 0;
      height: calc(100% - 16px);
      width: 1px;
      background-color: var(--ln-border);
    }
    &[data-ln-last-start-pin]::before,
    &[data-ln-first-end-pin]::before {
      top: 0;
      height: 100%;
    }
  }

  /* Column group header */
  [data-ln-header-group="true"] {
    display: flex;
    align-items: center;
    padding-inline: var(--ln-padding-horizontal-cell);
    background-color: var(--ln-bg-ui-panel);
    font-weight: 600;
    color: var(--ln-text-dark);
    border-bottom: 1px solid var(--ln-border);
  }

  /* Row hover + selected overlays (use ::before to not affect cells) */
  [data-ln-row="true"] {
    &:hover::before {
      content: "";
      position: absolute;
      width: 100%;
      height: var(--ln-row-height);
      background: var(--ln-bg-row-hover);
      pointer-events: none;
      z-index: 9;
    }
    &[data-ln-selected="true"]::before {
      content: "";
      position: absolute;
      width: 100%;
      height: var(--ln-row-height);
      background: color-mix(in srgb, var(--ln-primary-50) 30%, transparent);
      pointer-events: none;
      z-index: 9;
    }
  }

  /* Cells */
  [data-ln-cell="true"] {
    display: flex;
    align-items: center;
    padding-inline: var(--ln-padding-horizontal-cell);
    background-color: var(--ln-bg-ui-panel);
    color: var(--ln-text-dark);
    border-bottom: 1px solid var(--ln-border-row);
    &[data-ln-type="number"] {
      justify-content: flex-end;
      font-variant-numeric: tabular-nums;
    }
    &[data-ln-last-start-pin="true"] {
      border-inline-end: 1px solid var(--ln-border-strong);
    }
    &[data-ln-first-end-pin="true"] {
      border-inline-start: 1px solid var(--ln-border-strong);
    }
    &[data-ln-last-top-pin="true"] {
      border-bottom: 1px solid var(--ln-border-xstrong);
    }
    &[data-ln-first-bottom-pin="true"] {
      border-top: 1px solid var(--ln-border-xstrong);
    }
  }

  /* Alternating rows */
  [data-ln-alternate="true"] [data-ln-cell="true"] {
    background-color: var(--ln-bg-row-alternate);
  }

  /* Focus ring */
  [data-ln-cell="true"]:focus,
  [data-ln-header-cell="true"]:focus {
    outline: none;
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border: 1px solid var(--ln-primary-50);
      pointer-events: none;
    }
  }

  /* Cell selection (PRO) */
  [data-ln-cell-selection-rect] {
    background-color: var(--ln-primary-10);
    box-sizing: border-box;
    &[data-ln-cell-selection-border-top="true"] {
      border-top: 1px solid var(--ln-primary-50);
    }
    &[data-ln-cell-selection-border-bottom="true"] {
      border-bottom: 1px solid var(--ln-primary-50);
    }
    &[data-ln-cell-selection-border-start="true"] {
      border-inline-start: 1px solid var(--ln-primary-50);
    }
    &[data-ln-cell-selection-border-end="true"] {
      border-inline-end: 1px solid var(--ln-primary-50);
    }
  }
}
```

Apply both classes to the container:

```tsx
<div className="my-theme ln-grid" style={{ height: 500 }}>
  <Grid<GridSpec> ... />
</div>
```

---

## Using Your Own Design Tokens (No `--ln-*` Required)

You are not required to use LyteNyte's `--ln-*` tokens. The grid's element selectors (`[data-ln-cell]`, `[data-ln-header-cell]`, etc.) accept any CSS — hardcoded values, your own CSS variables, Tailwind classes, or anything else.

**When to skip `--ln-*` tokens:** if your project already has a design system with its own CSS variables (e.g. `--color-surface`, `--color-border`, `--font-size-sm`), map them directly. There is no benefit to going through `--ln-*` aliases.

```css
/* Your project's own tokens — no --ln-* needed */
.my-grid-wrapper.ln-grid {
  [data-ln-header-cell="true"] {
    display: flex;
    align-items: center;
    padding-inline: var(--spacing-3); /* your spacing token */
    background-color: var(--color-surface-2); /* your surface token */
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    font-weight: 600;
    border-bottom: 1px solid var(--color-border);
  }

  [data-ln-cell="true"] {
    display: flex;
    align-items: center;
    padding-inline: var(--spacing-3);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    border-bottom: 1px solid var(--color-border-subtle);
    &[data-ln-type="number"] {
      justify-content: flex-end;
      font-variant-numeric: tabular-nums;
    }
  }

  [data-ln-alternate="true"] [data-ln-cell="true"] {
    background-color: var(--color-surface-1);
  }

  [data-ln-row="true"]:hover::before {
    content: "";
    position: absolute;
    width: 100%;
    height: var(--ln-row-height); /* --ln-row-height is always set by the grid */
    background: var(--color-row-hover, rgba(0, 0, 0, 0.03));
    pointer-events: none;
    z-index: 9;
  }

  [data-ln-cell-selection-rect] {
    background-color: var(--color-accent-subtle);
    &[data-ln-cell-selection-border-top="true"] {
      border-top: 1px solid var(--color-accent);
    }
    &[data-ln-cell-selection-border-bottom="true"] {
      border-bottom: 1px solid var(--color-accent);
    }
    &[data-ln-cell-selection-border-start="true"] {
      border-inline-start: 1px solid var(--color-accent);
    }
    &[data-ln-cell-selection-border-end="true"] {
      border-inline-end: 1px solid var(--color-accent);
    }
  }
}
```

> `--ln-row-height`, `--ln-row-depth`, `--ln-vp-width`, `--ln-vp-height`, and `--ln-start-offset` are always injected at runtime by the grid — use them freely. All other `--ln-*` tokens are only present if you import a LyteNyte CSS file.

---

## Pure Tailwind Theming (No CSS Import Required)

The grid can be fully themed using only Tailwind — zero LyteNyte CSS imports. There are two approaches:

### Approach A — Tailwind plugin variants on `<Grid className>`

Import only `tw.css` (no `grid.css`, no `grid-full.css`), then apply all styles via custom variants on the grid component:

```css
/* globals.css */
@import "tailwindcss";
@import "@1771technologies/lytenyte-pro/tw.css";
```

```tsx
<div className="ln-grid" style={{ height: 500 }}>
  <Grid<GridSpec>
    rowSource={ds}
    columns={columns}
    rowHeight={40}
    className={cn(
      // Viewport
      "ln-vp:border ln-vp:border-gray-200 ln-vp:rounded-lg ln-vp:text-sm ln-vp:font-sans",

      // Header
      "ln-header:flex ln-header:items-center ln-header:px-3",
      "ln-header:bg-gray-50 ln-header:text-gray-500 ln-header:text-xs ln-header:font-semibold ln-header:uppercase ln-header:tracking-wide",
      "ln-header:border-b ln-header:border-gray-200",

      // Cells
      "ln-cell:flex ln-cell:items-center ln-cell:px-3",
      "ln-cell:bg-white ln-cell:text-gray-900 ln-cell:text-sm",
      "ln-cell:border-b ln-cell:border-gray-100",

      // Alternate rows
      "ln-cell-alt:bg-gray-50",

      // Selected rows
      "ln-cell-selected:bg-blue-50",

      // Cell selection rectangle
      "ln-rect:bg-blue-100/50",
      "ln-rect-t:border-t ln-rect-t:border-blue-500",
      "ln-rect-b:border-b ln-rect-b:border-blue-500",
      "ln-rect-s:border-l ln-rect-s:border-blue-500",
      "ln-rect-e:border-r ln-rect-e:border-blue-500",
    )}
  />
</div>
```

Note: `ln-grid` on the wrapper is still required — it is the CSS scope that activates the custom variants. It does not inject any styles when no LyteNyte CSS is imported.

### Approach B — Headless components with Tailwind classes

No CSS import at all. Apply classes directly to each headless component with full per-element control:

```tsx
// No CSS import anywhere — 100% Tailwind

function MyGrid() {
  return (
    <div className="ln-grid overflow-hidden rounded-lg border border-gray-200" style={{ height: 500 }}>
      <Grid<GridSpec> rowSource={ds} columns={columns} rowHeight={40}>
        {({ rows, columns }) => (
          <>
            <Grid.Header>
              {(headerRow) => (
                <Grid.HeaderRow headerRow={headerRow}>
                  {(c) => (
                    <Grid.HeaderCell
                      key={c.id}
                      cell={c}
                      className={cn(
                        "flex items-center px-3 text-xs font-semibold uppercase tracking-wide",
                        "border-b border-gray-200 bg-gray-50 text-gray-500",
                        c.type === "number" && "justify-end",
                      )}
                    />
                  )}
                </Grid.HeaderRow>
              )}
            </Grid.Header>
            <Grid.RowsContainer
              className={cn(
                // Cell selection rect borders via arbitrary selectors
                "**:data-[ln-cell-selection-rect]:bg-blue-100/50",
                "**:data-[ln-cell-selection-border-top=true]:border-t **:data-[ln-cell-selection-border-top=true]:border-blue-500",
                "**:data-[ln-cell-selection-border-bottom=true]:border-b **:data-[ln-cell-selection-border-bottom=true]:border-blue-500",
                "**:data-[ln-cell-selection-border-start=true]:border-l **:data-[ln-cell-selection-border-start=true]:border-blue-500",
                "**:data-[ln-cell-selection-border-end=true]:border-r **:data-[ln-cell-selection-border-end=true]:border-blue-500",
              )}
            >
              {rows.map((row) => (
                <Grid.Row key={row.id} row={row}>
                  {(c) => (
                    <Grid.Cell
                      key={c.id}
                      cell={c}
                      className={cn(
                        "flex items-center border-b border-gray-100 px-3 text-sm",
                        "bg-white text-gray-900",
                        "group-data-[ln-alternate=true]:bg-gray-50",
                        "group-data-[ln-selected=true]:bg-blue-50",
                        c.type === "number" && "justify-end tabular-nums",
                      )}
                    />
                  )}
                </Grid.Row>
              ))}
            </Grid.RowsContainer>
          </>
        )}
      </Grid>
    </div>
  );
}
```

### Which approach to choose

|                | Approach A (variants on `<Grid>`) | Approach B (headless components)      |
| -------------- | --------------------------------- | ------------------------------------- |
| Import needed  | `tw.css` only                     | None                                  |
| Per-cell logic | Limited (no per-row data access)  | Full (access to `row.data`, `column`) |
| Code location  | Single `className` string         | JSX render functions                  |
| Good for       | Uniform styling, quick setup      | Conditional styles, custom renderers  |

Combine both: use approach A for base styles and approach B for cells that need data-aware conditional styling.

---

## Quick Token Overrides

The quickest way to customize a prebuilt theme without replacing it entirely:

```css
.ln-grid {
  --ln-bg-ui-panel: #fafafa; /* lighter header/cell background */
  --ln-border-row: transparent; /* remove row dividers */
  --ln-padding-horizontal-cell: 16px; /* wider cell padding */
  --ln-font-md: 13px; /* smaller cell font */
  --ln-primary-50: #8b5cf6; /* change accent to purple */
}
```

---

## Styling Methods Summary

### `styles` prop (targeted overrides without headless mode)

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

### CSS Modules

```css
/* styles.module.css */
.cell {
  display: flex;
  align-items: center;
  padding-inline: 8px;
  &[data-ln-type="number"] {
    justify-content: flex-end;
  }
}
[data-ln-alternate="true"] .cell {
  background-color: hsl(0, 27%, 98%);
}
```

```tsx
import styles from "./styles.module.css";
<Grid.Cell key={c.id} cell={c} className={styles.cell} />;
```

### Emotion (CSS-in-JS)

```tsx
import styled from "@emotion/styled";

const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  font-size: 14px;
`;

const RowsContainer = styled(Grid.RowsContainer)`
  & [data-ln-row-detail="true"] {
    padding: 24px;
  }
  & [data-ln-cell-selection-rect] {
    background-color: var(--ln-primary-30);
  }
`;
```

---

## Layout Constraints

**Do not override** functional inline styles: `width`, `height`, `top`, `left`, `transform`. Do not apply `margin` to grid elements — it interferes with layout calculations.

---

## Gotchas

- **Tailwind layer order** — when mixing Tailwind with LyteNyte prebuilt themes, declare: `@layer base, ln-grid, components, utilities;` in your CSS entry file. Without this, Tailwind utilities may be defeated by grid styles in the `ln-grid` layer.
- **`tw.css` variants apply to the subtree** — `ln-cell:bg-white` on `<Grid className="...">` applies to all cells inside that grid instance. Put variant classes on the nearest ancestor that contains the elements you want to target.
- **Do not override functional inline styles** — `width`, `height`, `top`, `left`, `transform` are set inline for layout/virtualization. Overriding them breaks cell positioning.
- **The `styles` prop does not need memoization** — unlike most grid props, `styles` is diffed internally. Passing a new object reference each render is safe.
- **`data-ln-row-detail` and `data-ln-cell-selection-rect` are not directly accessible** — they're rendered internally. Target them via descendant selectors on a parent element.
- **Scope custom CSS to `.ln-grid`** — styles written for grid elements (`[data-ln-cell]`, etc.) could accidentally match non-grid elements. Always nest them inside `.ln-grid` or your custom theme class.
- **`--ln-row-height`, `--ln-row-depth`, `--ln-vp-width`, `--ln-vp-height`, `--ln-start-offset` are runtime-only** — the grid sets these; do not override them. Use `rowHeight` and related grid props instead.

## Full Docs

- [Grid Theming](/docs/grid-theming)
- [Theming with Tailwind](/docs/grid-theming-tailwind)
- [Theming with CSS Modules](/docs/grid-theming-css-modules)
- [Theming with Emotion](/docs/grid-theming-emotion)
- [Installation with Shadcn](/docs/intro-installation-shadcn)
