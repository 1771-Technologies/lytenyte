import {
  getRowsCenterSection,
  getRowsInSection,
  getRowIndexFromEl,
} from "@1771technologies/lytenyte-shared";
import type { GridAtom, PositionUnion } from "../../+types";
import { focusCellVertically } from "./focus-cell-vertically";
import type { LayoutMap, ScrollIntoViewFn } from "../../+types.non-gen";

interface HandleHomeEndArgs {
  readonly vp: HTMLElement | null;
  readonly pos: PositionUnion;
  readonly isUp: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
  readonly layout: LayoutMap;
  readonly topCount: number;
  readonly centerCount: number;
}

export function handlePageUpDown({
  pos,
  vp,
  topCount,
  centerCount,
  id,
  isUp,
  focusActive,
  layout,
  scrollIntoView,
}: HandleHomeEndArgs) {
  if (pos.kind !== "cell" && pos.kind !== "full-width") return;

  const tc = topCount;
  const cc = centerCount;

  // The current cell is not a centered cell.
  if (pos.rowIndex < tc || pos.rowIndex >= tc + cc) return;

  const rowSection = getRowsCenterSection(vp!);
  if (!rowSection) return;
  const rows = getRowsInSection(rowSection, id);

  const rowIndex = isUp ? getRowIndexFromEl(rows[0]) : getRowIndexFromEl(rows.at(-1)!);

  if (rowIndex === pos.rowIndex) return;

  focusCellVertically({
    id,
    focusActive,
    layout,
    nextRow: rowIndex,
    pos,
    scrollIntoView,
    vp,
  });
}
