import { getCoordsFromPlacement } from "./get-coords-from-placement";
import { getOffset } from "./get-offset";
import type { Dimensions, OffsetValue, Placement, Rect, Side } from "./types";
import { getAlignment, getAxis, getOppositeAxis, getOppositePlacement, getSide } from "./utils";

export interface GetPositionArguments {
  reference: Rect;
  floating: Dimensions;
  placement: Placement;
  arrow?: Dimensions;
  arrowOffset?: number;
  offset?: OffsetValue;
  rtl?: boolean;
}

export function getPosition({
  reference,
  floating,
  placement,
  offset = 4,
  arrowOffset = 0,
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

  // Calculate arrow position
  const arrowPlacement = getOppositePlacement(side);
  let arrowX = x;
  let arrowY = y;

  // Center the arrow on its axis
  if (getAxis(arrowPlacement) === "y") {
    // For left/right placement, center arrow vertically
    arrowX = arrowPlacement === "left" ? x - arrow.width : x + floating.width;
    arrowY = y + floating.height / 2 - arrow.height / 2;

    // Constrain arrow to stay within floating element bounds
    const minY = y + arrowOffset;
    const maxY = y + floating.height - arrow.height - arrowOffset;
    arrowY = Math.max(minY, Math.min(maxY, arrowY));
  } else {
    // For top/bottom placement, center arrow horizontally
    arrowX = x + floating.width / 2 - arrow.width / 2;
    arrowY = arrowPlacement === "top" ? y - arrow.height : y + floating.height;

    // Constrain arrow to stay within floating element bounds
    const minX = x + arrowOffset;
    const maxX = x + floating.width - arrow.width - arrowOffset;
    arrowX = Math.max(minX, Math.min(maxX, arrowX));
  }

  return {
    x,
    y,
    width: floating.width,
    height: floating.height,
    arrow: {
      x: arrowX,
      y: arrowY,
      placement: arrowPlacement,
    },
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
