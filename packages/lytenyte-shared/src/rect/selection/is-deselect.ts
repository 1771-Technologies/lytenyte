import type { PositionGridCell } from "../../types.js";
import type { DataRect } from "../types.js";

/**
 * Determines if the current selection is a deselection. This will only work for multi-range
 * selections that are additive.
 */
export function isDeselect(
  startPosition: PositionGridCell,
  selectionsAtStart: DataRect[],
  isMultiRange: boolean,
  ctrlOnly: boolean,
  ignoreFirst: boolean,
) {
  if (!ctrlOnly || !isMultiRange) return false;

  const startCol = startPosition.root?.colIndex ?? startPosition.colIndex;
  const startRow = startPosition.root?.rowIndex ?? startPosition.rowIndex;

  let deselect = false;
  const effectiveColStart = ignoreFirst ? 1 : 0;
  if (startCol >= effectiveColStart) {
    deselect = selectionsAtStart.some(
      (r) =>
        startCol >= r.columnStart && startCol < r.columnEnd && startRow >= r.rowStart && startRow < r.rowEnd,
    );
  }

  return deselect;
}
