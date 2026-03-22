import type { PositionGridCell, PositionUnion } from "../../types.js";

/**
 * Determines if the cell selection is a self click. A self click is when the
 * anchor cell is clicked and we don't want to clear the selection.
 */
export function isSelectSelfClick(
  startPosition: PositionGridCell,
  currentFocus: PositionUnion | null,
  clearOnSelfSelect: boolean,
  shiftOnly: boolean,
) {
  const startCol = startPosition.root?.colIndex ?? startPosition.colIndex;
  const startRow = startPosition.root?.rowIndex ?? startPosition.rowIndex;
  const isSelfClick =
    !clearOnSelfSelect &&
    !shiftOnly &&
    currentFocus?.kind === "cell" &&
    (currentFocus.root?.rowIndex ?? currentFocus.rowIndex) === startRow &&
    (currentFocus.root?.colIndex ?? currentFocus.colIndex) === startCol;

  return isSelfClick;
}
