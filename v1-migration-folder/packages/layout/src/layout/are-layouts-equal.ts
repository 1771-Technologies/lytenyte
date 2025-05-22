import type { SpanLayout } from "../+types.layout.js";

/**
 * Compares two SpanLayout objects for equality.
 *
 * This function performs a deep comparison between two SpanLayout objects
 * by checking if all their properties have the same values. It's used to
 * determine if a layout has changed, which helps avoid unnecessary re-renders
 * or calculations in virtualized grid components.
 *
 * The comparison includes all span boundaries for:
 * - Top pinned rows (rowTop*)
 * - Center rows (rowCenter*)
 * - Bottom pinned rows (rowBot*)
 * - Start pinned columns (colStart*)
 * - Center columns (colCenter*)
 * - End pinned columns (colEnd*)
 */
export function areLayoutsEqual(l: SpanLayout, r: SpanLayout) {
  return (
    // Top pinned rows comparison
    l.rowTopStart === r.rowTopStart &&
    l.rowTopEnd === r.rowTopEnd &&
    // Center (scrollable) rows comparison
    l.rowCenterStart === r.rowCenterStart &&
    l.rowCenterLast === r.rowCenterLast &&
    l.rowCenterEnd === r.rowCenterEnd &&
    // Bottom pinned rows comparison
    l.rowBotStart === r.rowBotStart &&
    l.rowBotEnd === r.rowBotEnd &&
    // Start pinned columns comparison
    l.colStartStart === r.colStartStart &&
    l.colStartEnd === r.colStartEnd &&
    // Center (scrollable) columns comparison
    l.colCenterStart === r.colCenterStart &&
    l.colCenterEnd === r.colCenterEnd &&
    l.colCenterLast === r.colCenterLast &&
    // End pinned columns comparison
    l.colEndStart === r.colEndStart &&
    l.colEndEnd === r.colEndEnd
  );
}
