import type { Alignment, OffsetValue, Side } from "./types.js";
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
 * @param offsetValue - Either a number (applied to main axis) or an object with:
 *                     - mainAxis: Offset along the main axis
 *                     - crossAxis: Offset along the cross axis
 *                     - alignmentAxis: Optional offset that can override crossAxis
 *                       for aligned placements
 *
 * @returns Calculated x/y offset coordinates. The direction and magnitude of the
 *          offset depends on the placement side.
 *
 * @example
 * ```typescript
 * // Simple numeric offset
 * const offset1 = getOffset("top", undefined, 10, false);
 * // { x: 0, y: -10 }
 *
 * // Complex offset with alignment
 * const offset2 = getOffset("right", "start", {
 *   mainAxis: 10,
 *   crossAxis: 5,
 *   alignmentAxis: 8
 * }, false);
 * // Returns offset with main axis applied horizontally
 * // and alignment-adjusted cross axis vertically
 * ```
 */
export function getOffset(side: Side, alignment: Alignment | undefined, offsetValue: OffsetValue) {
  const isVertical = getAxis(side) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;

  // eslint-disable-next-line prefer-const
  let { mainAxis, crossAxis, alignmentAxis } =
    typeof offsetValue === "number"
      ? { mainAxis: offsetValue, crossAxis: 0, alignmentAxis: null }
      : {
          mainAxis: offsetValue.mainAxis || 0,
          crossAxis: offsetValue.crossAxis || 0,
          alignmentAxis: offsetValue.alignmentAxis,
        };

  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }

  return isVertical
    ? { x: crossAxis, y: mainAxis * mainAxisMulti }
    : { x: mainAxis * mainAxisMulti, y: crossAxis };
}
