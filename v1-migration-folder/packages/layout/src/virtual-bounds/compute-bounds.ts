import type { ScrollBoundsCore } from "@1771technologies/grid-types/core";
import { getBoundEnd } from "./get-bound-end.js";
import { getBoundStart } from "./get-bound-start.js";
import { COL_OVERSCAN, ROW_OVERSCAN_END, ROW_OVERSCAN_START } from "../+constants.layout.js";

/**
 * Parameters required to calculate viewport bounds for virtualized content
 */
export interface ComputeBoundsArgs {
  /** Width of the visible viewport area in pixels */
  viewportWidth: number;
  /** Height of the visible viewport area in pixels */
  viewportHeight: number;
  /** Current vertical scroll position in pixels */
  scrollTop: number;
  /** Current horizontal scroll position in pixels */
  scrollLeft: number;

  /** Array of cumulative column widths/positions */
  xPositions: Uint32Array;
  /** Array of cumulative row heights/positions */
  yPositions: Uint32Array;

  /** Number of pinned rows at the top */
  topCount: number;
  /** Number of pinned rows at the bottom */
  bottomCount: number;
  /** Number of pinned columns at the start (left) */
  startCount: number;
  /** Number of pinned columns at the end (right) */
  endCount: number;
}

/**
 * Calculates the visible range of rows and columns in a virtualized grid.
 *
 * This function determines which rows and columns should be rendered based on:
 * 1. Current scroll position
 * 2. Viewport dimensions
 * 3. Pinned rows/columns configuration
 * 4. Overscan settings for smoother scrolling
 *
 * The returned bounds include overscan areas (extra rows/columns rendered outside
 * the visible area) to mitigate flickering during scrolling.
 *
 * The bounds returned are of the scrollable rows. The bounds for pinned rows are
 * always visible and do not need to be computed.
 */
export function computeBounds({
  viewportWidth,
  viewportHeight,
  scrollTop,
  scrollLeft,
  xPositions,
  yPositions,

  topCount,
  bottomCount,
  startCount,
  endCount,
}: ComputeBoundsArgs): ScrollBoundsCore {
  // Calculate the maximum index for non-pinned rows
  // (total rows minus pinned bottom rows)
  const maxCenterRowCount = Math.max(0, yPositions.length - 1 - bottomCount);

  // Adjust vertical scroll position to account for pinned top rows
  const topOffset = scrollTop + yPositions[topCount];

  // Determine the first visible row index (including overscan)
  const rowStart = getBoundStart(
    yPositions,
    topOffset,
    ROW_OVERSCAN_START, // Extra rows to render above visible area
    topCount, // Respect pinned top rows
    maxCenterRowCount, // Upper bound for scrollable rows
  );

  // Determine the last visible row index (including overscan)
  const rowEnd = getBoundEnd(
    yPositions,
    topOffset,
    maxCenterRowCount, // Upper bound for scrollable rows
    viewportHeight, // Visible height
    ROW_OVERSCAN_END, // Extra rows to render below visible area
  );

  // Calculate the maximum index for non-pinned columns
  // (total columns minus pinned end columns)
  const maxCenterColCount = Math.max(0, xPositions.length - 1 - endCount);

  // Adjust horizontal scroll position to account for pinned start columns
  const leftOffset = scrollLeft + xPositions[startCount];

  // Determine the first visible column index (including overscan)
  const columnStart = getBoundStart(
    xPositions,
    leftOffset,
    COL_OVERSCAN, // Extra columns to render to the left
    startCount, // Respect pinned start columns
    maxCenterColCount, // Upper bound for scrollable columns
  );

  // Determine the last visible column index (including overscan)
  const columnEnd = getBoundEnd(
    xPositions,
    leftOffset,
    maxCenterColCount, // Upper bound for scrollable columns
    viewportWidth, // Visible width
    COL_OVERSCAN, // Extra columns to render to the right
  );

  return { rowStart, rowEnd, columnStart, columnEnd };
}
