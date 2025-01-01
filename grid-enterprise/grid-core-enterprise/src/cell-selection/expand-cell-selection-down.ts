import { getRootCell } from "@1771technologies/grid-core";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";

export function expandCellSelectionDown<D, E>(
  api: ApiEnterprise<D, E>,
  ref?: CellSelectionRect,
  p?: CellSelectionRect,
) {
  const s = api.getState();

  const rect = ref ?? s.cellSelections.peek().at(-1);
  const pivot = p ?? s.internal.cellSelectionPivot.peek();

  if (!rect || !pivot) return;

  let next: CellSelectionRect;
  if (rect.rowStart < pivot.rowStart) {
    let rowOffset = 1;
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const cell = getRootCell(api, rect.rowStart, i);
      if (cell) rowOffset = Math.max(rowOffset, cell.rowSpan);
    }

    next = { ...rect, rowStart: rect.rowStart + rowOffset };
  } else {
    next = { ...rect, rowEnd: rect.rowEnd + 1 };
  }

  const nextSelections = [...s.cellSelections.peek()];
  nextSelections[nextSelections.length - 1] = next;

  s.cellSelections.set(nextSelections);
}
