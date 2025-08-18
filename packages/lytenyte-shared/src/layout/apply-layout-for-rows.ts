import { FULL_WIDTH_MAP } from "../+constants.js";
import type { Row, SpanLayout, LayoutMap, SpanFn } from "../+types.non-gen.js";
import { applyCellLayoutForRow } from "./apply-cell-layout-for-row.js";

export interface ApplyLayoutForRows {
  /** The first row index to compute from.  */
  readonly start: Row;
  /** The last row index to compute to (exclusive). */
  readonly end: Row;
  /** The max row index that may be spanned. Cells that span more than the row index will be cut. */
  readonly maxRowBound: Row;
  /** The layout specific bounds */
  readonly layout: SpanLayout;
  /** The layout map which tracks which cells are empty on a per row basis. This will be mutated by this function. */
  readonly map: LayoutMap;
  /** A function to compute the column span for a given row and column index pair. */
  readonly computeColSpan: SpanFn;
  /** A function to compute the row span for a given row and column index pair. */
  readonly computeRowSpan: SpanFn;
  /** A predicate that returns true if the given row is a cut off row, meaning it can not be spanned over. */
  readonly isRowCutoff: (row: Row) => boolean;
  /** A predicate that returns true if the given row is a full width row, meaning it can not be spanned over. */
  readonly isFullWidth: (row: Row) => boolean;
  /** The number of columns to look backward when calculating the span layout */
  readonly colScanDistance: number;
}

/**
 * Computes and applies cell layout for a range of rows in a grid with pinned sections.
 *
 * This function processes multiple rows in a grid, handling the complex layout calculations
 * required for virtualized grids with pinned areas. It divides the grid into nine logical
 * sections based on the combination of:
 *
 * - Row regions: top (pinned), center (scrollable), bottom (pinned)
 * - Column regions: start (pinned), center (scrollable), end (pinned)
 *
 * For each row in the specified range, it processes all three column regions separately,
 * accounting for special cases like full-width rows. The function respects layout boundaries
 * and handles cell spanning across these boundaries appropriately.
 *
 * The colScanDistance parameter allows looking backward into previous columns to handle cases
 * where cells might span from outside the current visible range.
 */
export function applyLayoutForRows({
  start,
  end,
  isFullWidth,
  maxRowBound,
  layout,
  map,
  computeColSpan,
  computeRowSpan,
  isRowCutoff,
  colScanDistance,
}: ApplyLayoutForRows) {
  // Combine both cutoff conditions (regular cutoff rows and full-width rows)
  // into a single predicate for simplified handling

  // Process each row in the specified range
  for (let row = start; row < end; row++) {
    // Check if the row has already been processed or is a full-width row
    // Full-width rows span across all columns and can't contain regular cells
    const colMap = map.get(row);
    if (colMap === FULL_WIDTH_MAP) continue;

    // If this is a full-width row, mark it and skip detailed processing
    if (isFullWidth(row)) {
      map.set(row, FULL_WIDTH_MAP);
      continue;
    }

    // Process each of the three column regions for the current row:

    // 1. Process pinned START columns (left-most fixed area)
    // These columns are always visible regardless of horizontal scroll position
    applyCellLayoutForRow({
      row,
      start: layout.colStartStart,
      end: layout.colStartEnd,
      computeColSpan,
      computeRowSpan,
      isRowCutoff,
      isFullWidth,
      map,
      maxColBound: layout.colStartEnd, // Spans can't exceed the start section boundary
      maxRowBound,
    });

    // 2. Process CENTER columns (scrollable area)
    // Include columns slightly before the visible area (colScanDistance) to handle spans
    // that might start outside but extend into the visible area
    applyCellLayoutForRow({
      row,
      start: Math.max(layout.colStartEnd, layout.colCenterStart - colScanDistance),
      end: layout.colCenterEnd,
      computeColSpan,
      computeRowSpan,
      isRowCutoff,
      isFullWidth,
      map,
      maxColBound: layout.colCenterLast, // Limit spans to the scrollable area
      maxRowBound,
    });

    // 3. Process pinned END columns (right-most fixed area)
    // These columns are always visible regardless of horizontal scroll position
    applyCellLayoutForRow({
      row,
      start: layout.colEndStart,
      end: layout.colEndEnd,
      computeColSpan,
      computeRowSpan,
      isRowCutoff,
      isFullWidth,
      map,
      maxColBound: layout.colEndEnd, // Spans can't exceed the end section boundary
      maxRowBound,
    });
  }
}
