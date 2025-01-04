import type { Side } from "./types.js";
import { getAxis } from "./utils.js";

/**
 * Calculates positioning offsets for a floating element based on its placement,
 * alignment, and provided offset values.
 *
 * The offset is calculated along two axes:
 * - Main axis: The axis running parallel to the placement side (e.g., y-axis for top/bottom)
 * - Cross axis: The axis running perpendicular to the placement side
 *
 * The function handles both simple numeric offsets and complex offset objects with
 * separate main/cross axis values and alignment axis adjustments.
 *
 * @param side - The placement side ("top", "right", "bottom", or "left")
 * @param alignment - Optional alignment ("start" or "end"). Affects how
 *                   alignmentAxis offset is applied
 * @param offsetValue - distance from reference
 *
 * @returns Calculated x/y offset coordinates. The direction and magnitude of the
 *          offset depends on the placement side.
 *
 * @example
 * ```typescript
 * // Simple numeric offset
 * const offset1 = getOffset("top", undefined, 10, false);
 * // { x: 0, y: -10 }
 * ```
 */
export function getOffset(side: Side, offsetValue: number) {
  const isVertical = getAxis(side) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;

  return isVertical
    ? { x: 0, y: offsetValue * mainAxisMulti }
    : { x: offsetValue * mainAxisMulti, y: 0 };
}
