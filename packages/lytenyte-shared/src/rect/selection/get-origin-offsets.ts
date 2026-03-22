import type { GridSections } from "../../types";

/**
 * Returns the origin offsets based on the grid sections. The origin offset are the areas of the grid that
 * will result in auto scrolling as the user drags.
 */
export function getOriginOffsets(
  gridSections: GridSections,
  startMouseY: number,
  startMouseX: number,
  rtl: boolean,
  vpStartH: number,
  vpStartW: number,
) {
  const originTop = startMouseY < gridSections.topOffset;
  const originBottom = startMouseY > vpStartH - gridSections.bottomOffset;
  const originStart = rtl
    ? startMouseX > vpStartW - gridSections.startOffset
    : startMouseX < gridSections.startOffset;
  const originEnd = rtl
    ? startMouseX < gridSections.endOffset
    : startMouseX > vpStartW - gridSections.endOffset;

  return { originTop, originBottom, originStart, originEnd };
}
