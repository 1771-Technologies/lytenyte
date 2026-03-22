import type { GridSections, PositionGridCell, PositionUnion } from "../../types.js";
import { clampRectToAccessible } from "./clamp-rect-to-accessible.js";
import { rectFromGridCellPositions } from "./rect-from-grid-cell-positions.js";
import type { ForceSettings } from "./get-access-forcing.js";
import { getRangeAccess } from "./get-range-access.js";
import { expandRectToFullSpans } from "../expand-rect-to-full-spans.js";

/**
 * Returns the current drag rect. This is the select rect the user is creating,
 * but it has not yet been committed to the selections.
 */
export function computeActiveRect(
  anchorPosition: PositionGridCell,
  currentPosition: PositionGridCell,
  gridSections: GridSections,
  viewport: HTMLElement,
  force: ForceSettings,
  cellRoot: (row: number, column: number) => PositionUnion | null,
) {
  const raw = rectFromGridCellPositions(anchorPosition, currentPosition);
  const expanded = expandRectToFullSpans(raw, cellRoot);
  return clampRectToAccessible(
    expanded,
    gridSections,
    getRangeAccess(gridSections, viewport, force),
  );
}
