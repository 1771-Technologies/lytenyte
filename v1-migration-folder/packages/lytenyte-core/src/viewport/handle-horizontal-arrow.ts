import { getLastTabbable, getTabbables } from "@1771technologies/lytenyte-dom-utils";
import { getNearestFocusable } from "../navigation/getters/get-nearest-focusable";
import { ensureVisible } from "../navigation/ensure-visible";
import type { GridRootContext } from "../context";
import type { PositionGridCell, PositionUnion } from "../state/+types";
import { getCellQuery } from "../navigation/get-cell-query";
import { getNearestHeaderRow } from "../navigation/getters/get-nearest-header-row";
import { getHeaderRows } from "../navigation/getters/get-header-rows";

export function handleHorizontalArrow(
  ctx: GridRootContext,
  pos: PositionUnion,
  isForward: boolean,
) {
  const vp = ctx.grid.state.viewport.get();
  const i = ctx.grid.internal;

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
    const layout = i.layout.get();

    const nextIndex = isForward
      ? pos.root
        ? pos.root.columnIndex + pos.root.colSpan
        : pos.columnIndex + 1
      : pos.root
        ? pos.root.columnIndex - 1
        : pos.columnIndex - 1;

    const row = layout.get(pos.rowIndex);
    const cell = row?.get(nextIndex);

    if (!cell) return;

    let rootRow: number;
    let rootCol: number;
    if (cell.length === 2) {
      rootRow = pos.rowIndex;
      rootCol = nextIndex;
    } else {
      rootRow = cell[1];
      rootCol = cell[2];
    }

    const id = ctx.grid.state.gridId.get();
    const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;

    if (!el) return;

    ensureVisible(el, ctx.grid.api.scrollIntoView);

    if (isForward) el.focus();
    else {
      const last = getLastTabbable(el, "if-empty");
      last?.focus();
    }

    i.focusActive.set((p) => ({ ...p, rowIndex: pos.rowIndex }) as PositionGridCell);
  } else {
    const headerRow = getNearestHeaderRow();
    if (!headerRow) return;

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

          return colStart <= pos.columnIndex && pos.columnIndex < colEnd;
        });

        if (match) {
          const tabbables = getTabbables(rows[nextIndex]);
          const matchIndex = tabbables.indexOf(match);
          alt = isForward ? tabbables[matchIndex + 1] : tabbables[matchIndex - 1];
        }

        if (alt) break;
        nextIndex--;
      }

      if (!alt) return;
      ensureVisible(alt, ctx.grid.api.scrollIntoView);
      alt.focus();
    } else {
      ensureVisible(el, ctx.grid.api.scrollIntoView);
      el.focus();
    }
  }
}
