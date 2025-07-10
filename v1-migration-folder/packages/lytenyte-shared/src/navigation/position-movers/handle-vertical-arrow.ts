import {
  ensureVisible,
  getCellQuery,
  getColIndexFromEl,
  getHeaderRows,
  getRowQuery,
  isFullWidthMap,
  type LayoutMap,
} from "@1771technologies/lytenyte-shared";
import { focusCellVertically } from "./focus-cell-vertically";
import type {
  GridAtom,
  PositionFullWidthRow,
  PositionHeaderCell,
  PositionUnion,
} from "../../+types";
import type { ScrollIntoViewFn } from "../../+types.non-gen";

interface HandleVerticalArrowArgs {
  readonly vp: HTMLElement | null;
  readonly rowCount: number;
  readonly pos: PositionUnion;
  readonly isMeta: boolean;
  readonly isDown: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
  readonly layout: LayoutMap;
}

export function handleVerticalArrow(args: HandleVerticalArrowArgs) {
  const { vp, pos, layout, isDown, isMeta, rowCount, scrollIntoView, focusActive, id } = args;

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

    // We try focus to begin - since it's likely the cell is already visible. If it isn't then we wait
    // for it to be visible and then try focus it.
    const res = focusCellVertically({
      focusActive,
      id,
      layout,
      nextRow,
      pos,
      scrollIntoView,
      vp,
    });

    if (!res)
      setTimeout(
        () =>
          focusCellVertically({
            focusActive,
            id,
            layout,
            nextRow,
            pos,
            scrollIntoView,
            vp,
          }),
        20,
      );
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
  layout,
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
  setTimeout(() => {
    const row = layout.get(0);

    if (!row) return;

    let maybeFocus: HTMLElement | null | undefined = undefined;
    if (isFullWidthMap(row)) {
      maybeFocus = vp?.querySelector(getRowQuery(id, 0));

      ensureVisible(maybeFocus as HTMLElement, scrollIntoView);
      (maybeFocus as HTMLElement).focus();

      focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionFullWidthRow);
      return;
    }

    const cell = row.get(pos.colIndex)!;
    let rootRow: number;
    let rootCol: number;
    if (cell.length === 2) {
      rootRow = 0;
      rootCol = pos.colIndex;
    } else {
      rootRow = cell[1];
      rootCol = cell[2];
    }

    maybeFocus = vp?.querySelector(getCellQuery(id, rootRow, rootCol));
    if (!maybeFocus) if (!maybeFocus) return;

    ensureVisible(maybeFocus as HTMLElement, scrollIntoView);
    (maybeFocus as HTMLElement).focus();
    focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionFullWidthRow);
    return;
  }, 20);
}
