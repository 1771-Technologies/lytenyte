import type { Alignment, Dimensions, Side } from "./types";
import { getAxis, getOppositePlacement } from "./utils";

/**
 * Calculates the position of an arrow element relative to a floating element based on
 * placement side and alignment.
 *
 * The arrow position is determined by:
 * - For y-axis placements (top/bottom): Centers the arrow horizontally by default, or
 *   aligns it to the start/end. Arrow is placed outside the floating element vertically.
 * - For x-axis placements (left/right): Centers the arrow vertically by default, or
 *   aligns it to the start/end. Arrow is placed outside the floating element horizontally.
 *
 * @param side - The placement side of the floating element relative to its reference
 *               element ("top", "right", "bottom", or "left")
 * @param alignment - Optional alignment of the floating element on its placement axis
 *                   ("start" or "end"). If undefined, the element is centered
 * @param x - The base x-coordinate position
 * @param y - The base y-coordinate position
 * @param floating - The dimensions of the floating element
 * @param arrow - The dimensions of the arrow element
 *
 * @returns Coordinates for positioning the arrow element relative to the floating element
 *
 * @example
 * ```typescript
 * const arrowPosition = getArrowPosition(
 *   "top",
 *   "start",
 *   100,
 *   200,
 *   { width: 200, height: 100 },
 *   { width: 12, height: 8 }
 * );
 * // Returns { x: 0, y: -8 }
 * ```
 */
export function getArrowPosition(
  side: Side,
  alignment: Alignment | undefined,
  x: number,
  y: number,
  floating: Dimensions,
  arrow: Dimensions,
) {
  const arrowPlacement = getOppositePlacement(side);
  let arrowX = x;
  let arrowY = y;

  // Center the arrow on its axis
  if (getAxis(arrowPlacement) === "y") {
    if (alignment === "start") arrowX = 0;
    else if (alignment === "end") arrowX = floating.width - arrow.width;
    else arrowX = Math.floor(floating.width / 2 - arrow.width / 2);

    if (arrowPlacement === "top") arrowY = -arrow.height;
    else arrowY = floating.height;
  } else {
    if (alignment === "start") arrowY = 0;
    else if (alignment === "end") arrowY = floating.height - arrow.height;
    else arrowY = Math.floor(floating.height / 2 - arrow.height / 2);

    if (arrowPlacement === "left") arrowX = -arrow.width;
    else arrowX = floating.width;
  }

  return { x: arrowX, y: arrowY };
}
