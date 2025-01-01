import { getRootCell } from "@1771technologies/grid-core";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";

export function expandCellSelectionStart<D, E>(
  api: ApiEnterprise<D, E>,
  ref?: CellSelectionRect,
  p?: CellSelectionRect,
) {
  const s = api.getState();

  const rect = ref ?? s.cellSelections.peek().at(-1);
  const pivot = p ?? s.internal.cellSelectionPivot.peek();

  if (!rect || !pivot) return;

  let next: CellSelectionRect;
  if (rect.columnEnd > pivot.columnEnd) {
    let colOffset = 1;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const cell = getRootCell(api, i, rect.columnEnd - 1);
      if (cell) colOffset = Math.max(colOffset, cell.columnSpan);
    }

    next = { ...rect, columnEnd: rect.columnEnd - colOffset };
  } else {
    next = { ...rect, columnStart: rect.columnStart - 1 };
  }

  const nextSelections = [...s.cellSelections.peek()];
  nextSelections[nextSelections.length - 1] = next;

  s.cellSelections.set(nextSelections);
}
