import type { PositionFullWidthRow } from "../+types";
import { runWithBackoff } from "../js-utils/index.js";
import type { PositionState, RootCellFn, ScrollIntoViewFn } from "./+types";
import { queryCell, queryFullWidthRow } from "./query.js";

interface FocusCellArgs {
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly getRootCell: RootCellFn;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly vp: HTMLElement | null;
  readonly id: string;
  readonly focusActive: PositionState;

  readonly postFocus?: () => void;
}

export function focusCell({
  focusActive,
  id,
  vp,
  rowIndex,
  colIndex,
  getRootCell,
  scrollIntoView,
  postFocus,
}: FocusCellArgs) {
  scrollIntoView({ row: rowIndex, column: colIndex, behavior: "instant" });

  if (!vp) return false;

  const run = () => {
    const root = getRootCell(rowIndex, colIndex);
    if (!root) return false;
    if (root.kind === "full-width") {
      const el = queryFullWidthRow(id, root.rowIndex, vp);
      if (!el) return false;

      el.focus();
      if (postFocus) queueMicrotask(postFocus);

      focusActive.set((prev) => ({ ...prev, colIndex }) as PositionFullWidthRow);

      return true;
    }

    const el = queryCell(id, rowIndex, colIndex, vp);
    if (!el) return false;

    el.focus();
    if (postFocus) queueMicrotask(postFocus);
    return true;
  };

  runWithBackoff(run, [8, 20]);
  return true;
}
