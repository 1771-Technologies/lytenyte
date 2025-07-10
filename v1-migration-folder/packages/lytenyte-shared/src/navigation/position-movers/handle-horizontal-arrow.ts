import { getLastTabbable, getTabbables } from "@1771technologies/lytenyte-dom-utils";
import type { GridAtom, PositionGridCell, PositionUnion } from "../../+types";
import {
  getNearestFocusable,
  getCellQuery,
  ensureVisible,
  getNearestHeaderRow,
  getHeaderRows,
} from "@1771technologies/lytenyte-shared";
import type { LayoutMap, ScrollIntoViewFn } from "../../+types.non-gen";

interface HandleHorizontalArrowArgs {
  readonly vp: HTMLElement | null;
  readonly columnCount: number;
  readonly pos: PositionUnion;
  readonly isMeta: boolean;
  readonly isForward: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
  readonly layout: LayoutMap;
}

export function handleHorizontalArrow({
  vp,
  columnCount,
  isForward,
  isMeta,
  pos,
  layout,
  scrollIntoView,
  focusActive,
  id,
}: HandleHorizontalArrowArgs) {
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
      const row = layout.get(pos.rowIndex);
      const cell = row?.get(nextIndex);

      if (!cell) return false;

      let rootRow: number;
      let rootCol: number;
      if (cell.length === 2) {
        rootRow = pos.rowIndex;
        rootCol = nextIndex;
      } else {
        rootRow = cell[1];
        rootCol = cell[2];
      }

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

    const res = run();
    if (!res) setTimeout(() => run(), 20);
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

    // Try 3 times without backoff
    const res = run();
    if (!res)
      setTimeout(() => {
        const res = run();
        if (!res) setTimeout(() => run(), 20);
      }, 8);
  }
}
