import { getArrowPosition } from "./get-arrow-position";
import { getCoordsFromPlacement } from "./get-coords-from-placement";
import { getOffset } from "./get-offset";
import type { Dimensions, OffsetValue, Placement, Rect, Side } from "./types";
import { getAlignment, getAxis, getOppositeAxis, getSide } from "./utils";

export interface GetPositionArguments {
  reference: Rect;
  floating: Dimensions;
  placement: Placement;
  arrow?: Dimensions;
  offset?: OffsetValue;
  rtl?: boolean;
}

export function getPosition({
  reference,
  floating,
  placement,
  offset = 4,
  arrow = { width: 0, height: 0 },
  rtl = false,
}: GetPositionArguments) {
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
    const res = getCoordsFromPlacement(reference, floating, side, alignment, rtl);
    x = res.x;
    y = res.y;

    if (offset) {
      const off = getOffset(side, alignment, offset, rtl);
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
    arrow: getArrowPosition(side, alignment, x, y, floating, arrow),
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
