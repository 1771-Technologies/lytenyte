import { getBoundEnd } from "./get-bound-end.js";
import { getBoundStart } from "./get-bound-start.js";
import { COL_OVERSCAN, ROW_OVERSCAN_END, ROW_OVERSCAN_START } from "../+constants.js";
import type { SpanLayout } from "../+types.non-gen.js";

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

  /** Number of additional rows to include when determining top bound */
  rowOverscanTop?: number;
  /** Number of additional rows to include when determining bottom bound */
  rowOverscanBottom?: number;
  /** Number of additional columns to include when determining start bound */
  colOverscanStart?: number;
  /** Number of additional columns to include when determining end bound */
  colOverscanEnd?: number;
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

  rowOverscanTop = ROW_OVERSCAN_START,
  rowOverscanBottom = ROW_OVERSCAN_END,
  colOverscanStart = COL_OVERSCAN,
  colOverscanEnd = COL_OVERSCAN,
}: ComputeBoundsArgs): SpanLayout {
  // Calculate the maximum index for non-pinned rows
  // (total rows minus pinned bottom rows)
  const maxCenterRowCount = Math.max(0, yPositions.length - 1 - bottomCount);

  // Adjust vertical scroll position to account for pinned top rows
  const topOffset = scrollTop + yPositions[topCount];

  // Determine the first visible row index (including overscan)
  const rowStart = getBoundStart(
    yPositions,
    topOffset,
    rowOverscanTop,
    topCount,
    maxCenterRowCount,
  );

  // Determine the last visible row index (including overscan)
  const rowEnd = getBoundEnd(
    yPositions,
    topOffset,
    maxCenterRowCount, // Upper bound for scrollable rows
    viewportHeight, // Visible height
    rowOverscanBottom,
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
    colOverscanStart,
    startCount, // Respect pinned start columns
    maxCenterColCount, // Upper bound for scrollable columns
  );

  // Determine the last visible column index (including overscan)
  const columnEnd = getBoundEnd(
    xPositions,
    leftOffset,
    maxCenterColCount, // Upper bound for scrollable columns
    viewportWidth, // Visible width
    colOverscanEnd,
  );

  return {
    colStartStart: 0,
    colStartEnd: startCount,
    colCenterStart: columnStart,
    colCenterEnd: columnEnd,
    colCenterLast: maxCenterColCount,
    colEndStart: maxCenterColCount,
    colEndEnd: maxCenterColCount + endCount,

    rowTopStart: 0,
    rowTopEnd: topCount,
    rowCenterStart: rowStart,
    rowCenterEnd: rowEnd,
    rowCenterLast: maxCenterRowCount,
    rowBotStart: maxCenterRowCount,
    rowBotEnd: maxCenterRowCount + bottomCount,
  };
}
