import type { Alignment, Dimensions, Side } from "./types";
import { getAxis, getOppositePlacement } from "./utils";

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
