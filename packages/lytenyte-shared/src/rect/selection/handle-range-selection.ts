import {
  computeScrollDirection,
  createAutoscroller,
  equal,
  getDocument,
  getNearestFocusable,
  getPositionFromFocusable,
  type DataRect,
} from "../../index.js";
import type { GridSections, PositionGridCell, PositionUnion } from "../../types.js";
import { deselectRect } from "./deselect-rect.js";
import { computeActiveRect } from "./compute-active-rect.js";
import { getAccessForcing } from "./get-access-forcing.js";
import { getOriginOffsets } from "./get-origin-offsets.js";
import { isDeselect } from "./is-deselect.js";
import { isSelectSelfClick } from "./is-select-self-click.js";

export interface HandleRangeSelectionArgs {
  readonly gridId: string;
  readonly rtl: boolean;
  readonly ev: MouseEvent;
  readonly cellSelections: DataRect[];
  readonly viewport: HTMLElement;
  readonly gridSections: GridSections;
  readonly isMultiRange: boolean;
  readonly ignoreFirst: boolean;

  readonly anchorRef: { get: () => PositionGridCell | null; set: (pos: PositionGridCell | null) => void };
  readonly currentFocus: PositionUnion | null;
  readonly clearOnSelfSelect: boolean;

  readonly onActiveRangeChange: (change: DataRect | null) => void;
  readonly onDeselectChange: (b: boolean) => void;
  readonly onSelectionChange: (change: DataRect[]) => void;
}

/**
 * Handles the range selection for mouse events. This handles both single and multi range selection.
 */
export function handleRangeSelect({
  ev,
  gridId,
  cellSelections,
  viewport,
  rtl,
  gridSections,
  isMultiRange,
  ignoreFirst,
  anchorRef,
  currentFocus,
  clearOnSelfSelect,

  onActiveRangeChange,
  onSelectionChange,
  onDeselectChange,
}: HandleRangeSelectionArgs) {
  const cell = getNearestFocusable(gridId, ev.target as HTMLElement);
  if (!cell) return;
  const startPosition = getPositionFromFocusable(gridId, cell);
  if (startPosition.kind !== "cell") return;

  const startCol = startPosition.colIndex;
  const startRow = startPosition.rowIndex;
  // When the user right clicks a cell, by default the browser will focus that cell. This makes
  // things a bit awkward, since focusing the cell will remove the current cell selections.
  // We need to prevent this focus shift when a cell that is in a selection rect is right clicked.
  // We do this my preventing the default, after detecting if the cell is under cell selection.
  if (ev.button === 2) {
    const inSelection = cellSelections.some(
      (r) =>
        startCol >= r.columnStart && startCol < r.columnEnd && startRow >= r.rowStart && startRow < r.rowEnd,
    );
    if (inSelection) ev.preventDefault();
    return;
  }

  // Shift + Ctrl/Cmd voids the modification, and is treated as a normal selection.
  const shiftOnly = ev.shiftKey && !ev.ctrlKey && !ev.metaKey;
  const ctrlOnly = (ev.ctrlKey || ev.metaKey) && !ev.shiftKey;

  // Prevent focus movement when extending a selection so that focus-tracking hooks
  // don't collapse the existing committed selections in response to the focus change.
  if (shiftOnly) ev.preventDefault();

  // Classify drag origin section from mouse position at mousedown
  const vpRectStart = viewport.getBoundingClientRect();
  const startMouseX = ev.clientX - vpRectStart.left;
  const startMouseY = ev.clientY - vpRectStart.top;
  const vpStartW = vpRectStart.width;
  const vpStartH = vpRectStart.height;

  const origin = getOriginOffsets(gridSections, startMouseY, startMouseX, rtl, vpStartH, vpStartW);
  const force = getAccessForcing(gridSections, startPosition);

  const anchor = anchorRef.get();
  if (!shiftOnly) anchorRef.set(startPosition);

  const anchorPosition: PositionGridCell = shiftOnly && anchor ? anchor : startPosition;
  let currentPosition: PositionGridCell = startPosition;

  const isSelfClick = isSelectSelfClick(startPosition, currentFocus, clearOnSelfSelect, shiftOnly);

  // Deduplicated setActiveRange — avoids re-renders when the rect hasn't changed.
  // This matters most during autoscroll at a boundary where the grid can no longer
  // scroll but the rAF loop keeps firing.
  let lastActiveRect: DataRect | null = null;
  function setActiveRangeDeduped(rect: DataRect | null) {
    if (equal(rect, lastActiveRect)) return;
    lastActiveRect = rect;
    onActiveRangeChange(rect);
  }

  const deselect = isDeselect(startPosition, cellSelections, isMultiRange, ctrlOnly, ignoreFirst);
  onDeselectChange(deselect);

  if (!isSelfClick)
    setActiveRangeDeduped(computeActiveRect(anchorPosition, currentPosition, gridSections, viewport, force));

  if (shiftOnly) {
    // Strip the last committed selection so only the active range rect is
    // visible during the drag (avoids visual doubling while extending).
    const withoutLast = cellSelections.length > 0 ? cellSelections.slice(0, -1) : [];
    onSelectionChange(withoutLast);
  } else if (!ctrlOnly && !isSelfClick) {
    onSelectionChange([]);
  }

  // Use ownerDocument so everything works correctly inside iframes:
  // clientX/clientY from events inside an iframe are in the iframe's
  // coordinate space, which matches ownerDocument.elementFromPoint.
  const ownerDoc = getDocument(viewport);

  const controller = new AbortController();

  let selectionFrame: number | null = null;
  let previousTarget: HTMLElement | null = null;
  let previousCell: HTMLElement | null = null;
  let lastMouseX = ev.clientX;
  let lastMouseY = ev.clientY;
  let hasDragged = false;

  // Called by the autoscroller after each scroll step.
  // Updates currentPosition if the cell under the cursor has changed, then
  // always recomputes the active rect — getAccess() changes as the grid scrolls
  // (e.g. endAccessible becomes true once the grid reaches the right boundary),
  // so the rect must be recomputed even when the hovered cell element is the same.
  // previousTarget is cleared so the next mousemove re-anchors it correctly
  // after the autoscroller has changed previousCell.
  function updateSelectionAtPoint() {
    const el = ownerDoc.elementFromPoint(lastMouseX, lastMouseY) as HTMLElement | null;
    if (el) {
      const hoveredCell = getNearestFocusable(gridId, el);
      if (hoveredCell && hoveredCell !== previousCell) {
        const position = getPositionFromFocusable(gridId, hoveredCell);
        if (position.kind === "cell") {
          currentPosition = position;
          previousCell = hoveredCell;
          previousTarget = null;
        }
      }
    }
    if (!isSelfClick || hasDragged)
      setActiveRangeDeduped(
        computeActiveRect(anchorPosition, currentPosition, gridSections, viewport, force),
      );
  }

  const autoscroller = createAutoscroller(viewport, 20, 0.5, updateSelectionAtPoint);

  (ev.currentTarget as HTMLElement).addEventListener(
    "mousemove",
    (ev) => {
      const mouseEv = ev as MouseEvent;

      lastMouseX = mouseEv.clientX;
      lastMouseY = mouseEv.clientY;

      const vpRect = viewport!.getBoundingClientRect();
      const x = mouseEv.clientX - vpRect.left;
      const y = mouseEv.clientY - vpRect.top;

      const { dirX, dirY } = computeScrollDirection(
        x,
        y,
        vpRect.width,
        vpRect.height,
        gridSections.topOffset,
        gridSections.bottomOffset,
        gridSections.startOffset,
        gridSections.endOffset,
        rtl,
        origin.originTop,
        origin.originBottom,
        origin.originStart,
        origin.originEnd,
      );

      autoscroller.setDirection(dirX, dirY);

      // Update selection from hovered cell
      const target = mouseEv.target as HTMLElement | null;
      if (!target || target === previousTarget) return;

      const hoveredCell = getNearestFocusable(gridId, target);
      if (!hoveredCell || hoveredCell === previousCell) return;
      const position = getPositionFromFocusable(gridId, hoveredCell);
      if (position.kind !== "cell") return;

      currentPosition = position;
      previousTarget = target;
      previousCell = hoveredCell;

      const movedCol = position.colIndex;
      const movedRow = position.rowIndex;
      if (isSelfClick && !hasDragged && (movedCol !== startCol || movedRow !== startRow)) {
        hasDragged = true;
        if (!ctrlOnly) onSelectionChange([]);
        setActiveRangeDeduped(
          computeActiveRect(anchorPosition, currentPosition, gridSections, viewport, force),
        );
      }

      if (!isSelfClick || hasDragged) {
        if (selectionFrame) cancelAnimationFrame(selectionFrame);
        selectionFrame = requestAnimationFrame(() => {
          setActiveRangeDeduped(
            computeActiveRect(anchorPosition, currentPosition, gridSections, viewport, force),
          );
          selectionFrame = null;
        });
      }
    },
    { signal: controller.signal },
  );

  function endDrag() {
    controller.abort();
    autoscroller.stop();
    if (selectionFrame) {
      cancelAnimationFrame(selectionFrame);
      selectionFrame = null;
    }

    const finalRect = computeActiveRect(anchorPosition, currentPosition, gridSections, viewport, force)!;
    onActiveRangeChange(null);
    onDeselectChange(false);

    if (isSelfClick && !hasDragged) return;

    if (ctrlOnly && isMultiRange) {
      if (deselect) {
        const remaining = cellSelections.flatMap((sel) => deselectRect(sel, finalRect));
        onSelectionChange(remaining);
      } else {
        onSelectionChange([...cellSelections, finalRect]);
      }
    } else if (shiftOnly) {
      const rest = cellSelections.length > 0 ? cellSelections.slice(0, -1) : [];
      onSelectionChange([...rest, finalRect]);
    } else {
      onSelectionChange([finalRect]);
    }
  }

  ownerDoc.addEventListener("mouseup", endDrag, { signal: controller.signal });
  ownerDoc.addEventListener("contextmenu", endDrag, { signal: controller.signal });
}
