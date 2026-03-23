import type { GridSections, PositionGridCell } from "../../types.js";

export interface ForceSettings {
  readonly start: boolean;
  readonly end: boolean;
  readonly top: boolean;
  readonly bottom: boolean;
}

/**
 * Returns a set a boolean flags indicating if selection should be allowed in the different pin
 * areas of the viewport. This is used to override the scroll condition for when dragging begins
 * in one of the pinned areas.
 */
export function getAccessForcing(gridSections: GridSections, startPosition: PositionGridCell): ForceSettings {
  const startCol = startPosition.root?.colIndex ?? startPosition.colIndex;
  const startRow = startPosition.root?.rowIndex ?? startPosition.rowIndex;
  const start = gridSections.startCount > 0 && startCol < gridSections.startCutoff;
  const end = gridSections.endCount > 0 && startCol >= gridSections.endCutoff;
  const top = gridSections.topCount > 0 && startRow < gridSections.topCutoff;
  const bottom = gridSections.bottomCount > 0 && startRow >= gridSections.bottomCutoff;

  return {
    start,
    end,
    top,
    bottom,
  };
}
