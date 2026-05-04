const ZONE = 50;

/**
 * Computes the autoscroll direction (-1, 0, or 1) for each axis based on the
 * current mouse position within a viewport.
 *
 * A non-zero direction is returned when the mouse is within ZONE pixels of a
 * viewport edge. The origin flags suppress scrolling toward the edge where the
 * drag started, preventing the selection from immediately auto-scrolling back
 * over the anchor cell:
 *
 * - `originTop` / `originBottom` — drag began in a top/bottom pinned row;
 *   suppress autoscroll toward that side.
 * - `originInStart` / `originInEnd` — drag began in a start/end pinned column;
 *   suppress autoscroll toward that side.
 *
 * The `startOffset` / `endOffset` / `topOffset` / `bottomOffset` values shift
 * the trigger zone inward to account for any pixel offsets at the edges of the
 * scrollable area (e.g. pinned-section borders).
 */
export function computeScrollDirection(
  x: number,
  y: number,
  w: number,
  h: number,
  topOffset: number,
  bottomOffset: number,
  startOffset: number,
  endOffset: number,
  rtl: boolean,
  originTop: boolean,
  originBottom: boolean,
  originInStart: boolean,
  originInEnd: boolean,
): { dirX: number; dirY: number } {
  // scrollBy(startScrollDir, 0) scrolls toward the start-pin side
  const startScrollDir = rtl ? 1 : -1;

  let dirX = 0;
  let dirY = 0;

  // Y axis
  // Top-pin origin scrolls toward the bottom boundary; bottom-pin origin scrolls
  // toward the top boundary; center origin scrolls toward whichever boundary the
  // mouse is near. All trigger zones are ZONE px inside the center area.
  if (originTop) {
    if (y > h - bottomOffset - ZONE) dirY = 1;
  } else if (originBottom) {
    if (y < topOffset + ZONE) dirY = -1;
  } else {
    if (y < topOffset + ZONE) dirY = -1;
    else if (y > h - bottomOffset - ZONE) dirY = 1;
  }

  // X axis — same pattern, mirrored for RTL
  const nearStartBoundary = rtl ? x > w - startOffset - ZONE : x < startOffset + ZONE;
  const nearEndBoundary = rtl ? x < endOffset + ZONE : x > w - endOffset - ZONE;

  if (originInStart) {
    if (nearEndBoundary) dirX = -startScrollDir;
  } else if (originInEnd) {
    if (nearStartBoundary) dirX = startScrollDir;
  } else {
    if (nearStartBoundary) dirX = startScrollDir;
    else if (nearEndBoundary) dirX = -startScrollDir;
  }

  return { dirX, dirY };
}
