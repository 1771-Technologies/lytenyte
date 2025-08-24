import { getLastTabbable, getTabbables } from "@1771technologies/lytenyte-dom-utils";
import type { GridAtom, PositionGridCell, PositionUnion } from "../../+types.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { getCellRootRowAndColIndex } from "./get-cell-root-row-and-col-index.js";
import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import { getNearestFocusable } from "../getters/get-nearest-focusable.js";
import { getNearestHeaderRow } from "../getters/get-nearest-header-row.js";
import { getCellQuery } from "../getters/get-cell-query.js";
import { ensureVisible } from "../ensure-visible.js";
import { getHeaderRows } from "../getters/get-header-rows.js";

interface HandleHorizontalArrowArgs {
  readonly vp: HTMLElement | null;
  readonly columnCount: number;
  readonly pos: PositionUnion;
  readonly isMeta: boolean;
  readonly isForward: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
}

export function handleHorizontalArrow({
  vp,
  columnCount,
  isForward,
  isMeta,
  pos,
  scrollIntoView,
  getRootCell,
  focusActive,
  id,
}: HandleHorizontalArrowArgs) {
  // Start by getting the nearest focusable element that is known to the grid.
  const nearest = getNearestFocusable();
  const tabbables = getTabbables(nearest!, "if-empty");

  const edge = (isForward ? tabbables.at(-1) : tabbables[0]) as HTMLElement;

  if (document.activeElement !== edge) {
    const currentIndex = tabbables.indexOf(document.activeElement! as any);
    const next = tabbables[currentIndex + (isForward ? 1 : -1)];
    next.focus();
    return;
  }

  if (pos.kind === "full-width") return;

  if (pos.kind === "cell") {
    let nextIndex = isForward
      ? pos.root
        ? pos.root.colIndex + pos.root.colSpan
        : pos.colIndex + 1
      : pos.root
        ? pos.root.colIndex - 1
        : pos.colIndex - 1;

    if (isMeta) {
      nextIndex = isForward ? columnCount - 1 : 0;
    }

    scrollIntoView({ column: nextIndex, behavior: "instant" });

    const run = () => {
      const cell = getRootCell(pos.rowIndex, nextIndex);

      if (!cell) return false;

      const [rootRow, rootCol] =
        cell.kind === "full-width" ? [pos.rowIndex, pos.colIndex] : getCellRootRowAndColIndex(cell);

      scrollIntoView({ row: rootRow, column: rootCol, behavior: "instant" });
      const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;

      if (!el) return false;

      ensureVisible(el, scrollIntoView);

      if (isForward) el.focus();
      else {
        const last = getLastTabbable(el, "if-empty");
        last!.focus();
      }
      focusActive.set((p) => ({ ...p, rowIndex: pos.rowIndex }) as PositionGridCell);
      return true;
    };

    runWithBackoff(run, [8, 20]);
  } else {
    const headerRow = getNearestHeaderRow();
    if (!headerRow) return;

    let nextIndex = pos.colIndex;
    if (pos.kind === "header-group-cell") nextIndex = pos.columnStartIndex;

    nextIndex += isForward ? 1 : -1;
    scrollIntoView({ column: nextIndex, behavior: "instant" });

    const run = () => {
      const tabbables = getTabbables(headerRow);
      const index = tabbables.indexOf(document.activeElement as HTMLElement);

      const el = isForward ? tabbables[index + 1] : tabbables[index - 1];

      if (!el) {
        const rows = getHeaderRows(vp!)!;
        const index = rows.indexOf(headerRow);

        let nextIndex = index - 1;
        let alt: HTMLElement | null | undefined;
        while (nextIndex >= 0) {
          const headers = Array.from(
            rows[nextIndex].querySelectorAll("[data-ln-header-range]"),
          ) as HTMLElement[];

          const match = headers.find((c) => {
            const [colStartStr, colEndStr] = c.getAttribute("data-ln-header-range")!.split(",");
            const colStart = Number.parseInt(colStartStr);
            const colEnd = Number.parseInt(colEndStr);

            return colStart <= pos.colIndex && pos.colIndex < colEnd;
          });

          if (match) {
            const tabbables = getTabbables(rows[nextIndex]);
            const matchIndex = tabbables.indexOf(match);
            alt = isForward ? tabbables[matchIndex + 1] : tabbables[matchIndex - 1];
          }

          if (alt) break;
          nextIndex--;
        }

        if (!alt) return false;
        ensureVisible(alt, scrollIntoView);
        alt.focus();
      } else {
        ensureVisible(el, scrollIntoView);
        el.focus();
      }

      return true;
    };

    runWithBackoff(run, [8, 20]);
  }
}
