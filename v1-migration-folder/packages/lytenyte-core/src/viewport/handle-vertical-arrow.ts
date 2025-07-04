import { isFullWidthMap } from "@1771technologies/lytenyte-shared";
import type { GridRootContext } from "../context";
import type {
  PositionFullWidthRow,
  PositionGridCell,
  PositionHeaderCell,
  PositionUnion,
} from "../state/+types";
import { ensureVisible } from "../navigation/ensure-visible";
import { getRowQuery } from "../navigation/get-row-query";
import { getCellQuery } from "../navigation/get-cell-query";
import { getHeaderRows } from "../navigation/getters/get-header-rows";
import { getColIndexFromEl } from "../navigation/getters/get-col-index-from-el";

export function handleVerticalArrow(ctx: GridRootContext, pos: PositionUnion, isDown: boolean) {
  const vp = ctx.grid.state.viewport.get();
  const i = ctx.grid.internal;

  if (pos.kind === "full-width" || pos.kind === "cell") {
    const layout = i.layout.get();

    let nextRow = pos.rowIndex + (isDown ? 1 : -1);
    if (pos.kind === "cell") {
      if (isDown) nextRow = (pos.root?.rowIndex ?? pos.rowIndex + 1) + (pos.root?.rowSpan ?? 0);
      else nextRow = (pos.root?.rowIndex ?? pos.rowIndex) - 1;
    }

    // This means we are at the top of the view. Hence we should move up to the header level
    if (nextRow < 0) {
      const rows = getHeaderRows(vp!);
      if (!rows) return;

      let el: HTMLElement | null = null;
      for (let i = rows.length - 1; i >= 0; i--) {
        const children = Array.from(rows[i].childNodes) as HTMLElement[];

        for (const c of children) {
          if (getColIndexFromEl(c) === pos.columnIndex) el = c;
        }
        if (el) break;
      }

      if (el) el.focus();
      return;
    }

    const row = layout.get(nextRow);

    if (!row) return;

    const id = ctx.grid.state.gridId.get();
    if (isFullWidthMap(row)) {
      // Just focus the next
      const el = vp?.querySelector(getRowQuery(id, nextRow)) as HTMLElement;
      if (!el) return;

      ensureVisible(el, ctx.grid.api.scrollIntoView);
      el.focus();

      i.focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionFullWidthRow);

      return;
    }

    const cell = row.get(pos.columnIndex)!;
    let rootRow: number;
    let rootCol: number;
    if (cell.length === 2) {
      rootRow = nextRow;
      rootCol = pos.columnIndex;
    } else {
      rootRow = cell[1];
      rootCol = cell[2];
    }

    const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
    if (!el) return;

    ensureVisible(el, ctx.grid.api.scrollIntoView);
    el.focus();
    i.focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionGridCell);
  } else {
    if (isDown) {
      const rows = getHeaderRows(vp!);
      if (!rows) return;
      const index = rows?.findIndex((r) => r.contains(document.activeElement));

      // We are on the last level of our header rows, so we should try focus our first row.
      if (index === rows.length - 1) {
        focusFirstRowCell(ctx, pos);
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

          return colStart <= pos.columnIndex && pos.columnIndex < colEnd;
        });

        if (match) break;
        nextIndex++;
      }

      if (match) {
        ensureVisible(match, ctx.grid.api.scrollIntoView);
        match.focus();
        i.focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionHeaderCell);
      } else {
        focusFirstRowCell(ctx, pos);
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

          return colStart <= pos.columnIndex && pos.columnIndex < colEnd;
        });

        if (match) break;
        nextIndex--;
      }

      if (match) {
        ensureVisible(match, ctx.grid.api.scrollIntoView);
        match.focus();
        i.focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionHeaderCell);
      }
    }
  }
}

function focusFirstRowCell(ctx: GridRootContext, pos: PositionUnion) {
  const vp = ctx.grid.state.viewport.get();
  const i = ctx.grid.internal;

  const id = ctx.grid.state.gridId.get();

  // Ensure the position in view
  ctx.grid.api.scrollIntoView({ row: 0, column: pos.columnIndex });

  // Here we have some possible situations the code needs to cover.
  // If there are no rows we focus noting
  // If there is a full width row we focus it and maintain the column index
  // If there is a cell with spans we need to ensure we focus the correct position
  // If there is a normal cell we focus that.
  setTimeout(() => {
    const layout = i.layout.get();
    const row = layout.get(0);

    if (!row) return;

    let maybeFocus: HTMLElement | null | undefined = undefined;
    if (isFullWidthMap(row)) {
      maybeFocus = vp?.querySelector(getRowQuery(id, 0));

      ensureVisible(maybeFocus as HTMLElement, ctx.grid.api.scrollIntoView);
      (maybeFocus as HTMLElement).focus();

      i.focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionFullWidthRow);
      return;
    }

    const cell = row.get(pos.columnIndex)!;
    let rootRow: number;
    let rootCol: number;
    if (cell.length === 2) {
      rootRow = 0;
      rootCol = pos.columnIndex;
    } else {
      rootRow = cell[1];
      rootCol = cell[2];
    }

    maybeFocus = vp?.querySelector(getCellQuery(id, rootRow, rootCol));
    if (!maybeFocus) if (!maybeFocus) return;

    ensureVisible(maybeFocus as HTMLElement, ctx.grid.api.scrollIntoView);
    (maybeFocus as HTMLElement).focus();

    i.focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionFullWidthRow);
    return;
  }, 4);
}
