import { getCoordsFromPlacement } from "./get-coords-from-placement.js";
import { getOffset } from "./get-offset.js";
import type { Dimensions, Placement, Rect, Side } from "./types.js";
import { getAlignment, getAxis, getOppositeAxis, getSide } from "./utils.js";

/**
 * Arguments for calculating the optimal position of a floating element relative to a reference element.
 */
export interface GetPositionArguments {
  /**
   * The reference element's dimensions and coordinates.
   * This is the element that the floating element will be positioned relative to.
   */
  reference: Rect;

  /**
   * The dimensions of the floating element to be positioned.
   * This element will be positioned relative to the reference element.
   */
  floating: Dimensions;

  /**
   * Desired placement of the floating element relative to the reference element.
   * Can be a simple side ("top", "right", "bottom", "left") or include an alignment
   * modifier (e.g., "top-start", "right-end").
   *
   * @example
   * "top" // Places floating element above reference
   * "bottom-start" // Places below reference, aligned to start edge
   */
  placement: Placement;
  /**
   * Distance between reference and floating elements.
   *
   * @default 4
   */
  offset?: number;
}

/**
 * Calculates the optimal position for a floating element relative to a reference element,
 * with collision detection and automatic repositioning.
 *
 * The positioning algorithm works as follows:
 * 1. Determines initial placement using the provided side and alignment
 * 2. Checks for viewport collisions and repositions using predefined collision paths:
 *    - Left: [left → right → bottom → top → left]
 *    - Right: [right → left → bottom → top → right]
 *    - Top: [top → bottom → right → left → top]
 *    - Bottom: [bottom → top → right → left → bottom]
 * 3. Applies offset adjustments to maintain the specified gap
 * 4. Performs edge detection and shifts to keep the element within viewport bounds
 *
 * @param options - Positioning options
 * @param options.reference - The reference element's dimensions and coordinates
 * @param options.floating - The floating element's dimensions
 * @param options.placement - Desired placement of floating element (e.g., "top", "bottom-start")
 * @param options.offset - Distance in pixels between reference and floating elements
 *                        @default 4
 *
 * @returns An object containing:
 *          - x: Final x coordinate
 *          - y: Final y coordinate
 *          - width: Floating element width
 *          - height: Floating element height
 *          - placement: Final placement after collision resolution
 *
 * @example
 * ```typescript
 * const position = getPosition({
 *   reference: { x: 100, y: 100, width: 200, height: 100 },
 *   floating: { width: 150, height: 80 },
 *   placement: "top-start",
 *   offset: 8
 * });
 * // Returns: { x: 100, y: 12, width: 150, height: 80, placement: "top-start" }
 * ```
 */
export function getPosition({ reference, floating, placement, offset = 4 }: GetPositionArguments) {
  const alignment = getAlignment(placement);
  let side = getSide(placement);

  const paths = collisionPaths[side];

  // We start by checking if we can place the item on the sides without it going out of view.
  // The we check the starting side, then its opposite side then the other sides. If none fit
  // we default to the starting side.
  let x!: number;
  let y!: number;
  for (const path of paths) {
    side = path;
    const res = getCoordsFromPlacement(reference, floating, side, alignment);
    x = res.x;
    y = res.y;

    if (offset) {
      const off = getOffset(side, offset);
      x += off.x;
      y += off.y;
    }

    const endX = x + floating.width;
    const endY = y + floating.height;

    if (side === "left" && x >= 0) break;
    if (side === "right" && endX <= window.innerWidth) break;
    if (side === "top" && y >= 0) break;
    if (side === "bottom" && endY <= window.innerHeight) break;
  }

  // now we perform shifts if necessary. We only shift on the alignment axis.
  const axis = getOppositeAxis(getAxis(side));
  if (axis === "x") {
    // check the left and right bounds
    if (x < 0) x = 0;
    if (x + floating.width > window.innerWidth) x -= x + floating.width - window.innerWidth;
  }

  if (axis === "y") {
    // check the top and bottom bounds
    if (y < 0) y = 0;
    if (y + floating.height > window.innerHeight) y -= y + floating.height - window.innerHeight;
  }

  return {
    x,
    y,
    width: floating.width,
    height: floating.height,
    placement: `${side}${alignment ? "-" + alignment : ""}` as Placement,
  };
}

const collisionPathsLeft: Side[] = ["left", "right", "bottom", "top", "left"];
const collisionPathsRight: Side[] = ["right", "left", "bottom", "top", "right"];
const collisionPathsTop: Side[] = ["top", "bottom", "right", "left", "top"];
const collisionPathsBottom: Side[] = ["bottom", "top", "right", "left", "bottom"];

const collisionPaths: Record<Side, Side[]> = {
  left: collisionPathsLeft,
  right: collisionPathsRight,
  top: collisionPathsTop,
  bottom: collisionPathsBottom,
};
