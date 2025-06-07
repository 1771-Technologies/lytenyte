import type { LayoutMap, RowPredicate, SpanFn, SpanLayout } from "../+types.layout.js";
import { applyLayoutForRows } from "./apply-layout-for-rows.js";
import { areLayoutsEqual } from "./are-layouts-equal.js";

export interface ApplyLayoutArgs {
  /** Previous layout configuration to compare against */
  prevLayout: SpanLayout;
  /** New layout configuration to apply */
  nextLayout: SpanLayout;
  /** The layout map to update, which tracks cell positions and spans */
  layoutMap: LayoutMap;
  /** Flag indicating whether the layout needs to be recalculated regardless of layout equality */
  invalidated: boolean;
  /** Function to compute column spans for given row/column positions */
  computeColSpan: SpanFn;
  /** Function to compute row spans for given row/column positions */
  computeRowSpan: SpanFn;
  /** Predicate to determine if a row spans the full width */
  isFullWidth: RowPredicate;
  /** Predicate to determine if a row cannot be spanned across */
  isRowCutoff: RowPredicate;
  /** Number of rows to look backward when calculating layout */
  rowScanDistance: number;
  /** Number of columns to look backward when calculating layout */
  colScanDistance: number;
}

/**
 * Updates the layout map based on changes in grid configuration.
 *
 * This function is responsible for efficiently updating the cell layout information
 * when the grid's visible area changes. It handles optimization by:
 *
 * 1. Skipping recalculation when the layout hasn't changed and isn't invalidated
 * 2. Processing each row section (top, center, bottom) separately
 * 3. Supporting scan distances to handle spans that might originate outside the visible area
 *
 * The function divides the grid into three row sections:
 * - Top pinned rows (fixed at the top)
 * - Center scrollable rows (main content area)
 * - Bottom pinned rows (fixed at the bottom)
 *
 * Each section is processed with appropriate boundaries to ensure spans
 * don't cross between incompatible areas.
 */
export function applyLayoutUpdate({
  computeColSpan,
  computeRowSpan,
  prevLayout,
  nextLayout,
  invalidated,
  layoutMap,
  isFullWidth,
  isRowCutoff,
  rowScanDistance,
  colScanDistance,
}: ApplyLayoutArgs) {
  // Skip recalculation if layout hasn't changed and isn't invalidated
  // This optimization preserves the existing layout map when no update is needed
  if (areLayoutsEqual(prevLayout, nextLayout) && !invalidated) return layoutMap;

  // Process TOP pinned rows section
  // These rows are fixed at the top of the grid and always visible
  applyLayoutForRows({
    start: nextLayout.rowTopStart,
    end: nextLayout.rowTopEnd,
    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
    layout: nextLayout,
    map: layoutMap,
    maxRowBound: nextLayout.rowTopEnd, // Spans can't exceed top section
    colScanDistance,
  });

  // Process CENTER rows section (scrollable content)
  // Include rows slightly before the visible area (rowScanDistance) to handle spans
  // that might start outside but extend into the visible area
  applyLayoutForRows({
    start: Math.max(nextLayout.rowTopEnd, nextLayout.rowCenterStart - rowScanDistance),
    end: nextLayout.rowCenterEnd,
    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
    layout: nextLayout,
    map: layoutMap,
    maxRowBound: nextLayout.rowCenterLast, // Limit spans to the center area
    colScanDistance,
  });

  // Process BOTTOM pinned rows section
  // These rows are fixed at the bottom of the grid and always visible
  applyLayoutForRows({
    start: nextLayout.rowBotStart,
    end: nextLayout.rowBotEnd,
    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
    layout: nextLayout,
    map: layoutMap,
    maxRowBound: nextLayout.rowBotEnd, // Spans can't exceed bottom section
    colScanDistance,
  });
}
