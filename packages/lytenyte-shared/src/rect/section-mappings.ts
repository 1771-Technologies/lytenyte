/** Lookup set for sections that sit on the start (left in LTR) edge of the grid. */
export const startSection: Record<string, boolean> = {
  "top-start": true,
  "center-start": true,
  "bottom-start": true,
};
/** Lookup set for sections that sit on the end (right in LTR) edge of the grid. */
export const endSection: Record<string, boolean> = {
  "top-end": true,
  "center-end": true,
  "bottom-end": true,
};

/** Lookup set for sections that sit on the bottom edge of the grid. */
export const bottomSection: Record<string, boolean> = {
  "bottom-start": true,
  "bottom-center": true,
  "bottom-end": true,
};
/** Lookup set for sections that sit on the top edge of the grid. */
export const topSection: Record<string, boolean> = {
  "top-start": true,
  "top-center": true,
  "top-end": true,
};

/** Lookup set for sections that sit in the center (non-pinned) band of the grid. */
export const centerSection: Record<string, boolean> = {
  "center-start": true,
  "center-center": true,
  "center-end": true,
};
