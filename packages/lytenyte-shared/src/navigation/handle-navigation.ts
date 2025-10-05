import type { RootCellFn, ScrollIntoViewFn } from "../+types.non-gen.js";
import { isCell } from "./predicates/is-cell.js";
import type { GridAtom, PositionUnion } from "../+types.js";
import { isFullWidthRow } from "./predicates/is-full-width-row.js";
import { isDetailCell } from "./predicates/is-detail-cell.js";
import { isColumnHeader } from "./predicates/is-column-header.js";
import { isColumnGroupHeader } from "./predicates/is-column-group-header.js";
import { handleHorizontalMove } from "./position-movers/handle-horizontal-move.js";
import { handleVerticalMove } from "./position-movers/handle-vertical-move.js";
import { handleHomeEnd } from "./position-movers/handle-home-end.js";
import { handlePageUpDown } from "./position-movers/handle-page-up-down.js";
import { getActiveElement, getNearestMatching } from "../dom-utils/index.js";

interface Event {
  readonly key: string;
  readonly preventDefault: () => void;
  readonly stopPropagation: () => void;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
}

interface HandleNavigationArgs {
  readonly gridId: string;
  readonly viewport: HTMLElement;
  readonly event: Event;
  readonly rtl: boolean;

  readonly columnCount: number;
  readonly rowCount: number;

  readonly centerCount: number;
  readonly topCount: number;

  readonly getRootCell: RootCellFn;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly isRowDetailExpanded: (rowIndex: number) => boolean;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;
}

export function handleNavigation({
  gridId,
  event: e,
  viewport,
  rtl,
  columnCount,
  rowCount,
  topCount,
  centerCount,

  getRootCell,
  scrollIntoView,
  focusActive,
  isRowDetailExpanded,
}: HandleNavigationArgs) {
  // If the user is pressing tab, then we should skip the remaining cells and move to the next
  // element. This is slightly different than what may be expected, but makes the most sense.
  // A grid will have 1000s of cells, tabbing through them is not feasible.
  if (e.key === "Tab") {
    viewport.inert = true;
    setTimeout(() => (viewport.inert = false));
    return;
  }

  const startKey = rtl ? "ArrowRight" : "ArrowLeft";
  const endKey = rtl ? "ArrowLeft" : "ArrowRight";
  const upKey = "ArrowUp";
  const downKey = "ArrowDown";

  const keys = [startKey, endKey, upKey, downKey, "Home", "End", "PageDown", "PageUp"];
  const key = e.key;

  // If pressed key is not in the included navigation keys, then we can simply ignore the
  // key being pressed.
  if (!keys.includes(key)) return;

  // We need to know what our current focus position. There will definitely be an active element,
  // otherwise how is this event listener being called.
  const active = getActiveElement(document)!;
  const nearest = getNearestMatching(
    active,
    (el) =>
      isCell(el) ||
      isFullWidthRow(el) ||
      isDetailCell(el) ||
      isColumnHeader(el) ||
      isColumnGroupHeader(el),
  );

  // If we don't find a matching position, then we should just return and let the event happen as normal.
  // The developer must've placed a special div in some part of the grid that is not within a grid row/header
  if (!nearest) return;

  // This key is going to have an action. Since it will have an actions we prevent it
  // and stop the propagation any further. This function should be attached to the viewport,
  // hence it should still allow elements within the grid to handle keys.
  e.preventDefault();
  e.stopPropagation();

  const pos = focusActive.get()!;

  const isHorizontal = key === startKey || key === endKey;
  const isModified = e.ctrlKey || e.metaKey;

  if (key === "PageDown" || key === "PageUp") {
    handlePageUpDown({
      pos,
      centerCount,
      topCount,
      focusActive: focusActive,
      getRootCell,
      id: gridId,
      isUp: key === "PageUp",
      scrollIntoView,
      vp: viewport,
    });
  }

  if (key === "Home" || key === "End") {
    handleHomeEnd({
      columnCount,
      focusActive,
      getRootCell,
      id: gridId,
      isMeta: isModified,
      isStart: key === "Home",
      pos,
      rowCount,
      scrollIntoView,
      vp: viewport,
    });
    return;
  }

  if (isHorizontal) {
    handleHorizontalMove({
      gridId,
      active,
      nearest,
      columnCount,
      focusActive,
      getRootCell,
      isBackward: key === startKey,
      isModified,
      isRowDetailExpanded,
      position: pos,
      scrollIntoView,
      viewport,
    });
  } else {
    handleVerticalMove({
      isUp: key === upKey,
      isModified,
      focusActive,
      getRootCell,
      gridId,
      isRowDetailExpanded,
      nearest,
      position: pos,
      rowCount,
      scrollIntoView,
      viewport,
    });
  }
}
