const ZONE = 50;

export function computeScrollDirection(
  x: number,
  y: number,
  w: number,
  h: number,
  topOffset: number,
  bottomOffset: number,
  startOffset: number,
  endOffset: number,
  rtl: boolean,
  originTop: boolean,
  originBottom: boolean,
  originInStart: boolean,
  originInEnd: boolean,
): { dirX: number; dirY: number } {
  // scrollBy(startScrollDir, 0) scrolls toward the start-pin side
  const startScrollDir = rtl ? 1 : -1;

  let dirX = 0;
  let dirY = 0;

  // Y axis
  // Top-pin origin scrolls toward the bottom boundary; bottom-pin origin scrolls
  // toward the top boundary; center origin scrolls toward whichever boundary the
  // mouse is near. All trigger zones are ZONE px inside the center area.
  if (originTop) {
    if (y > h - bottomOffset - ZONE) dirY = 1;
  } else if (originBottom) {
    if (y < topOffset + ZONE) dirY = -1;
  } else {
    if (y < topOffset + ZONE) dirY = -1;
    else if (y > h - bottomOffset - ZONE) dirY = 1;
  }

  // X axis — same pattern, mirrored for RTL
  const nearStartBoundary = rtl ? x > w - startOffset - ZONE : x < startOffset + ZONE;
  const nearEndBoundary = rtl ? x < endOffset + ZONE : x > w - endOffset - ZONE;

  if (originInStart) {
    if (nearEndBoundary) dirX = -startScrollDir;
  } else if (originInEnd) {
    if (nearStartBoundary) dirX = startScrollDir;
  } else {
    if (nearStartBoundary) dirX = startScrollDir;
    else if (nearEndBoundary) dirX = -startScrollDir;
  }

  return { dirX, dirY };
}
