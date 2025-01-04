/**
 * Adjusts frame position and dimensions to ensure it stays within window bounds.
 * If the frame would overflow the window, this function attempts to preserve the frame's
 * size by repositioning it first, then reduces dimensions if necessary.
 *
 * @internal
 * @param x - Current horizontal position of the frame
 * @param y - Current vertical position of the frame
 * @param w - Current width of the frame
 * @param h - Current height of the frame
 *
 * @returns An object containing adjusted coordinates and dimensions
 * @property {number} x - Adjusted horizontal position
 * @property {number} y - Adjusted vertical position
 * @property {number} w - Adjusted width
 * @property {number} h - Adjusted height
 *
 * @remarks
 * The adjustment process follows these steps:
 * 1. Clamps x/y to prevent negative positions
 * 2. If frame overflows right edge:
 *    - Attempts to shift frame left while preserving width
 *    - Reduces width if shifting alone isn't sufficient
 * 3. Applies same logic for vertical overflow
 *
 * @example
 * ```typescript
 * const adjusted = handleSizeBounds(
 *   -50,        // x: off screen left
 *   800,        // y: partially off screen bottom
 *   400,        // width
 *   300         // height
 * );
 * // Returns: { x: 0, y: 724, w: 400, h: 300 }
 * // Frame is moved to left edge and shifted up to fit
 * ```
 */
export function handleSizeBounds(x: number, y: number, w: number, h: number) {
  if (x < 0) x = 0;
  if (x + w > window.innerWidth) {
    let diff = x + w - window.innerWidth;
    if (x > diff) {
      x -= diff;
      diff = 0;
    } else {
      diff -= x;
      x = 0;
    }
    if (diff > 0) w -= diff;
  }
  if (y < 0) y = 0;
  if (y + h > window.innerHeight) {
    let diff = y + h - window.innerHeight;
    if (y > diff) {
      y -= diff;
      diff = 0;
    } else {
      diff -= y;
      y = 0;
    }
    if (diff > 0) h -= diff;
  }

  return { x, y, w, h };
}
