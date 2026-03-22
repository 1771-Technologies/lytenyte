import type { GridSections, PositionGridCell } from "../../types.js";
import { clampRectToAccessible } from "./clamp-rect-to-accessible.js";
import { rectFromGridCellPositions } from "./rect-from-grid-cell-positions.js";
import type { ForceSettings } from "./get-access-forcing.js";
import { getRangeAccess } from "./get-range-access.js";

/**
 * Returns the current drag rect. This is the select rect the user is creating,
 * but it hsa not yet been committed to the selections.
 */
export function computeActiveRect(
  anchorPosition: PositionGridCell,
  currentPosition: PositionGridCell,
  gridSections: GridSections,
  viewport: HTMLElement,
  force: ForceSettings,
) {
  return clampRectToAccessible(
    rectFromGridCellPositions(anchorPosition, currentPosition),
    gridSections,
    getRangeAccess(gridSections, viewport, force),
  );
}
