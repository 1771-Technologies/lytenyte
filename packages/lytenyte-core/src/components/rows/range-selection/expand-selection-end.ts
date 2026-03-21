import {
  isFullyWithinRect,
  rectFromGridCellPosition,
  rectsOverlap,
  type ColumnView,
  type DataRect,
  type PositionGridCell,
  type PositionUnion,
} from "@1771technologies/lytenyte-shared";

export function expandSelectionEnd(
  scrollIntoView: (params: { row?: number; column?: number }) => void,
  cellRoot: (row: number, column: number) => PositionUnion | null,
  selections: DataRect[],
  setSelections: (d: DataRect[]) => void,
  meta: boolean,
  position: PositionGridCell,
  view: ColumnView,
) {
  const pos = rectFromGridCellPosition(position);
  const rect = selections.at(-1);
  if (!rect || !rectsOverlap(rect, pos) || isFullyWithinRect(pos, rect)) return;

  if (meta) {
    const next: DataRect = {
      ...rect,
      columnStart: pos.columnStart,
      columnEnd: view.visibleColumns.length,
    };
    const nextSelections = [...selections];
    nextSelections[nextSelections.length - 1] = next;
    setSelections(nextSelections);

    if (pos.columnStart !== 0) scrollIntoView({ column: view.visibleColumns.length - 1 });

    return;
  }

  const isAtEdge = pos.columnStart == rect.columnStart || pos.columnEnd === rect.columnEnd;

  let pivotStart = pos.columnStart;
  let pivotEnd = pos.columnEnd;

  // Our cell some how is spanned over. so for the current rowIndex, find the maximum span along the columns
  if (!isAtEdge) {
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(pos.columnStart, i) as PositionGridCell);
      pivotStart = Math.min(pivotStart, cell.columnStart);
      pivotEnd = Math.max(pivotEnd, cell.columnEnd);
    }
  }

  let next: DataRect;

  if (rect.columnStart < pivotStart) {
    let highestColEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, rect.columnStart + 1) as PositionGridCell);
      if (cell.columnStart > highestColEnd) {
        highestColEnd = cell.columnStart;
        setCell = cell;
      }
    }

    next = {
      ...rect,
      columnStart: highestColEnd,
      rowStart: Math.min(setCell!.rowStart, rect.rowStart),
      rowEnd: Math.max(setCell.rowEnd, rect.rowEnd),
    };

    scrollIntoView({ column: highestColEnd });
  } else {
    if (rect.columnEnd === view.visibleColumns.length) return;

    let highestColEnd = -Infinity;
    let setCell: DataRect = rect;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = rectFromGridCellPosition(cellRoot(i, rect.columnEnd) as PositionGridCell);
      if (cell.columnStart > highestColEnd) {
        highestColEnd = cell.columnStart;
        setCell = cell;
      }
    }
    next = {
      ...rect,
      columnEnd: highestColEnd + 1,
      rowStart: Math.min(setCell!.rowStart, rect.rowStart),
      rowEnd: Math.max(setCell.rowEnd, rect.rowEnd),
    };
    scrollIntoView({ column: highestColEnd - 1 });
  }

  const nextSelections = [...selections];
  nextSelections[nextSelections.length - 1] = next;
  setSelections(nextSelections);
  return;
}
