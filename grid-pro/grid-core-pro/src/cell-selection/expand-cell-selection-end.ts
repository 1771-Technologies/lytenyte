import { getRootCell } from "@1771technologies/grid-core";
import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function expandCellSelectionEnd<D, E>(
  api: ApiPro<D, E>,
  ref?: CellSelectionRectPro,
  p?: CellSelectionRectPro,
) {
  const sx = api.getState();

  const rect = ref ?? sx.cellSelections.peek().at(-1);
  const pivot = p ?? sx.internal.cellSelectionPivot.peek();

  if (!rect || !pivot) return;

  let next: CellSelectionRectPro;
  if (rect.columnStart < pivot.columnStart) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(api, i, rect.columnStart);
      if (cell) colOffset = Math.max(colOffset, cell.columnSpan);
    }

    next = { ...rect, columnStart: rect.columnStart + colOffset };
  } else {
    next = { ...rect, columnEnd: rect.columnEnd + 1 };
  }

  const nextSelections = [...sx.cellSelections.peek()];
  nextSelections[nextSelections.length - 1] = next;

  sx.cellSelections.set(nextSelections);
}
