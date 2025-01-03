// https://github.com/floating-ui/floating-ui/blob/master/packages/core/src/computeCoordsFromPlacement.ts
/**
MIT License

Copyright (c) 2021-present Floating UI contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { getAlignmentAxis, getAxis, getAxisLength } from "./utils.js";
import type { Alignment, Coords, Dimensions, Rect, Side } from "./types.js";

/**
 * Calculates the coordinates for positioning a floating element relative to a reference element
 * based on placement side, alignment, and RTL context.
 *
 * The function determines coordinates by:
 * 1. For vertical placements (top/bottom): Centers horizontally by default
 * 2. For horizontal placements (left/right): Centers vertically by default
 * 3. Adjusts final position based on:
 *    - Alignment (start/end) if specified
 *    - RTL context for vertical alignments
 *
 * @param reference - The reference element's dimensions and coordinates
 * @param floating - The floating element's dimensions
 * @param side - The preferred placement side relative to the reference element
 *               ("top", "right", "bottom", or "left")
 * @param alignment - Optional alignment along the cross axis
 *                   ("start" or "end"). If undefined, the element is centered
 * @param rtl - Whether the context is right-to-left. Affects alignment
 *              calculations for vertical placements
 *
 * @returns The calculated x/y coordinates for the floating element
 *
 * @example
 * ```typescript
 * const coords = getCoordsFromPlacement(
 *   { x: 100, y: 100, width: 200, height: 100 }, // reference
 *   { width: 100, height: 50 }, // floating
 *   "top",
 *   "start",
 *   false
 * );
 * // Returns coordinates for floating element positioned above reference,
 * // aligned to start
 * ```
 */
export function getCoordsFromPlacement(
  reference: Rect,
  floating: Dimensions,
  side: Side,
  alignment: Alignment | undefined,
  rtl: boolean,
) {
  const sideAxis = getAxis(side);
  const alignmentAxis = getAlignmentAxis(side);
  const alignLength = getAxisLength(alignmentAxis);
  const isVertical = sideAxis === "y";

  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;

  let coords: Coords;
  switch (side) {
    case "top":
      coords = { x: commonX, y: reference.y - floating.height };
      break;
    case "bottom":
      coords = { x: commonX, y: reference.y + reference.height };
      break;
    case "right":
      coords = { x: reference.x + reference.width, y: commonY };
      break;
    case "left":
      coords = { x: reference.x - floating.width, y: commonY };
      break;
    default:
      coords = { x: reference.x, y: reference.y };
  }

  switch (alignment) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    default:
  }

  return coords;
}
