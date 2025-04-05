import { getRootCell } from "@1771technologies/grid-core";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/pro";

export function expandCellSelectionUp<D, E>(
  api: ApiEnterprise<D, E>,
  ref?: CellSelectionRect,
  p?: CellSelectionRect,
) {
  const s = api.getState();

  const rect = ref ?? s.cellSelections.peek().at(-1);
  const pivot = p ?? s.internal.cellSelectionPivot.peek();

  if (!rect || !pivot) return;

  let next: CellSelectionRect;
  if (rect.rowEnd > pivot.rowEnd) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(api, rect.rowEnd - 1, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }
    next = { ...rect, rowEnd: rect.rowEnd - rowOffset };
  } else {
    next = { ...rect, rowStart: rect.rowStart - 1 };
  }

  const nextSelections = [...s.cellSelections.peek()];
  nextSelections[nextSelections.length - 1] = next;

  s.cellSelections.set(nextSelections);
}
