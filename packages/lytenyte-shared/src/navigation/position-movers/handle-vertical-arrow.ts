import { focusCellVertically } from "./focus-cell-vertically.js";
import type {
  GridAtom,
  PositionFullWidthRow,
  PositionHeaderCell,
  PositionUnion,
} from "../../+types.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import { getCellRootRowAndColIndex } from "./get-cell-root-row-and-col-index.js";
import { getHeaderRows } from "../getters/get-header-rows.js";
import { getColIndexFromEl } from "../getters/get-col-index-from-el.js";
import { ensureVisible } from "../ensure-visible.js";
import { getRowQuery } from "../getters/get-row-query.js";
import { getCellQuery } from "../getters/get-cell-query.js";

interface HandleVerticalArrowArgs {
  readonly vp: HTMLElement | null;
  readonly rowCount: number;
  readonly pos: PositionUnion;
  readonly isMeta: boolean;
  readonly isDown: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;
  readonly id: string;
}

export function handleVerticalArrow(args: HandleVerticalArrowArgs) {
  const { vp, pos, getRootCell, isDown, isMeta, rowCount, scrollIntoView, focusActive, id } = args;

  if (pos.kind === "full-width" || pos.kind === "cell") {
    let nextRow = pos.rowIndex + (isDown ? 1 : -1);
    if (pos.kind === "cell") {
      if (isDown) nextRow = (pos.root?.rowIndex ?? pos.rowIndex + 1) + (pos.root?.rowSpan ?? 0);
      else nextRow = (pos.root?.rowIndex ?? pos.rowIndex) - 1;
    }

    if (isMeta && isDown) nextRow = rowCount - 1;
    if (isMeta && !isDown) nextRow = 0;

    // This means we are at the top of the view. Hence we should move up to the header level
    if (nextRow < 0) {
      const rows = getHeaderRows(vp!);
      if (!rows) return;

      let el: HTMLElement | null = null;
      for (let i = rows.length - 1; i >= 0; i--) {
        const children = Array.from(rows[i].childNodes) as HTMLElement[];

        for (const c of children) {
          if (getColIndexFromEl(c) === pos.colIndex) el = c;
        }
        if (el) break;
      }

      if (el) el.focus();
      return;
    }

    scrollIntoView({ row: nextRow, behavior: "instant" });

    const run = () => {
      return focusCellVertically({
        focusActive,
        id,
        getRootCell,
        nextRow,
        pos,
        scrollIntoView,
        vp,
      });
    };

    runWithBackoff(run, [8, 20]);
  } else {
    if (isDown) {
      const rows = getHeaderRows(vp!);
      if (!rows) return;
      const index = rows?.findIndex((r) => r.contains(document.activeElement));

      // We are on the last level of our header rows, so we should try focus our first row.
      if (index === rows.length - 1) {
        focusFirstRowCell(args);
        return;
      }

      let nextIndex = index + 1;
      let match: HTMLElement | null | undefined;
      while (nextIndex < rows.length) {
        const headers = Array.from(
          rows[nextIndex].querySelectorAll("[data-ln-header-range]"),
        ) as HTMLElement[];

        match = headers.find((c) => {
          const [colStartStr, colEndStr] = c.getAttribute("data-ln-header-range")!.split(",");
          const colStart = Number.parseInt(colStartStr);
          const colEnd = Number.parseInt(colEndStr);

          return colStart <= pos.colIndex && pos.colIndex < colEnd;
        });

        if (match) break;
        nextIndex++;
      }

      if (match) {
        ensureVisible(match, scrollIntoView);
        match.focus();
        focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
      } else {
        focusFirstRowCell(args);
      }
    } else {
      const rows = getHeaderRows(vp!);
      if (!rows) return;
      const index = rows?.findIndex((r) => r.contains(document.activeElement));
      if (index === 0) return;

      let nextIndex = index - 1;
      let match: HTMLElement | null | undefined;
      while (nextIndex >= 0) {
        const headers = Array.from(
          rows[nextIndex].querySelectorAll("[data-ln-header-range]"),
        ) as HTMLElement[];

        match = headers.find((c) => {
          const [colStartStr, colEndStr] = c.getAttribute("data-ln-header-range")!.split(",");
          const colStart = Number.parseInt(colStartStr);
          const colEnd = Number.parseInt(colEndStr);

          return colStart <= pos.colIndex && pos.colIndex < colEnd;
        });

        if (match) break;
        nextIndex--;
      }

      if (match) {
        ensureVisible(match, scrollIntoView);
        match.focus();
        focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
      }
    }
  }
}

function focusFirstRowCell({
  pos,
  vp,
  id,
  getRootCell,
  scrollIntoView,
  focusActive,
}: HandleVerticalArrowArgs) {
  // Ensure the position in view
  scrollIntoView({ row: 0, column: pos.colIndex, behavior: "instant" });

  // Here we have some possible situations the code needs to cover.
  // If there are no rows we focus noting
  // If there is a full width row we focus it and maintain the column index
  // If there is a cell with spans we need to ensure we focus the correct position
  // If there is a normal cell we focus that.

  const run = () => {
    const cell = getRootCell(0, pos.colIndex);

    if (!cell) return false;

    let el: HTMLElement | null | undefined = undefined;
    if (cell.kind === "full-width") {
      el = vp?.querySelector(getRowQuery(id, 0));

      ensureVisible(el as HTMLElement, scrollIntoView);
      if (!el) return false;

      (el as HTMLElement).focus();

      focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionFullWidthRow);
      return true;
    }

    const [rootRow, rootCol] = getCellRootRowAndColIndex(cell);

    el = vp?.querySelector(getCellQuery(id, rootRow, rootCol));
    if (!el) return false;

    ensureVisible(el as HTMLElement, scrollIntoView);
    (el as HTMLElement).focus();
    focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionFullWidthRow);
    return true;
  };

  runWithBackoff(run, [8, 20]);
}
