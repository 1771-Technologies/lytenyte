import type { Side } from "./types.js";
import { getAxis } from "./utils.js";

/**
 * Calculates positioning offsets for a floating element based on its placement side
 * and offset value.
 *
 * The offset is calculated along two axes:
 * - Vertical axis (y): Used for top/bottom placements
 * - Horizontal axis (x): Used for left/right placements
 *
 * The function applies the offset in the appropriate direction based on the placement side:
 * - For "top"/"left": Negative offset (moving opposite to the side)
 * - For "bottom"/"right": Positive offset (moving with the side)
 *
 * @param side - The placement side ("top", "right", "bottom", or "left")
 * @param offsetValue - The distance to offset from the reference element
 * @returns An object containing x/y coordinates for the offset
 *
 * @example
 * ```typescript
 * const offset = getOffset("top", 10);
 * // { x: 0, y: -10 }
 *
 * const offset = getOffset("right", 5);
 * // { x: 5, y: 0 }
 * ```
 */
export function getOffset(side: Side, offsetValue: number) {
  const isVertical = getAxis(side) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;

  return isVertical
    ? { x: 0, y: offsetValue * mainAxisMulti }
    : { x: offsetValue * mainAxisMulti, y: 0 };
}
