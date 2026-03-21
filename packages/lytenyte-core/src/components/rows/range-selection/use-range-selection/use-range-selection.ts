import type { MouseEventHandler } from "react";
import { useEvent } from "../../../../internal.js";
import { useGridId } from "../../../../root/contexts/grid-id.js";
import {
  clampRectToAccessible,
  deselectRect,
  getDocument,
  getNearestFocusable,
  getPositionFromFocusable,
  rectFromGridCellPositions,
  type DataRect,
  type PositionGridCell,
} from "@1771technologies/lytenyte-shared";
import {
  useCellSelection,
  useCellSelectionSettings,
} from "../../../../root/contexts/cell-selection-context.js";
import { useActiveRangeSelection } from "../../../../root/contexts/active-range-context.js";
import { useCutoffs } from "../../../../root/contexts/cutoff-context.js";
import { createAutoscroller } from "./autoscroller.js";
import { computeScrollDirection } from "./compute-scroll-direction.js";

// Module-level constants — avoids re-allocation on every render
const MAX_SPEED = 20;
const ACCELERATION = 0.5;

function rectsEqual(a: DataRect | null, b: DataRect | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.columnStart === b.columnStart &&
    a.columnEnd === b.columnEnd &&
    a.rowStart === b.rowStart &&
    a.rowEnd === b.rowEnd
  );
}

export function useRangeSelection(
  mouseDown: MouseEventHandler<HTMLDivElement> | undefined,
  viewport: HTMLElement | null,
  topOffset: number,
  bottomOffset: number,
  startOffset: number,
  endOffset: number,
  rtl: boolean,
) {
  const gridId = useGridId();
  const settings = useCellSelectionSettings();
  const { cellSelections } = useCellSelection();
  const { setActiveRange, setDeselect } = useActiveRangeSelection();
  const cutoffs = useCutoffs();

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useEvent((ev) => {
    if (!viewport) return;

    mouseDown?.(ev);
    if (ev.isPropagationStopped() || ev.isDefaultPrevented() || settings.cellSelectionMode === "none") return;

    // Modifier intent
    const shiftOnly = ev.shiftKey && !ev.ctrlKey && !ev.metaKey;
    const ctrlOnly = (ev.ctrlKey || ev.metaKey) && !ev.shiftKey;
    // shift+ctrl treated as plain

    // Prevent the browser from moving DOM focus on shift-click
    if (shiftOnly) ev.preventDefault();

    // Classify drag origin section from mouse position at mousedown
    const vpRectStart = viewport.getBoundingClientRect();
    const startMouseX = ev.clientX - vpRectStart.left;
    const startMouseY = ev.clientY - vpRectStart.top;
    const vpStartW = vpRectStart.width;
    const vpStartH = vpRectStart.height;

    const originTop = startMouseY < topOffset;
    const originBottom = startMouseY > vpStartH - bottomOffset;
    const originInStart = rtl ? startMouseX > vpStartW - startOffset : startMouseX < startOffset;
    const originInEnd = rtl ? startMouseX < endOffset : startMouseX > vpStartW - endOffset;

    const startTarget = ev.target as HTMLElement;
    const cell = getNearestFocusable(gridId, startTarget);
    if (!cell) return;
    const startPosition = getPositionFromFocusable(gridId, cell);
    if (startPosition.kind !== "cell") return;

    // Pin sections where the drag started remain accessible throughout the drag
    // regardless of scroll position, so selections from pinned cells always work.
    const startCol = startPosition.root?.colIndex ?? startPosition.colIndex;
    const startRow = startPosition.root?.rowIndex ?? startPosition.rowIndex;
    const forceStart = cutoffs.startCount > 0 && startCol < cutoffs.startCutoff;
    const forceEnd = cutoffs.endCount > 0 && startCol >= cutoffs.endCutoff;
    const forceTop = cutoffs.topCount > 0 && startRow < cutoffs.topCutoff;
    const forceBottom = cutoffs.bottomCount > 0 && startRow >= cutoffs.bottomCutoff;

    // Recomputed on every call so pin accessibility updates as the grid scrolls.
    // Math.abs normalises RTL scrollLeft, which Chrome reports as negative values.
    // Direct pixel comparisons ensure grids with no overflow are always fully accessible.
    function getAccess() {
      const sl = Math.abs(viewport!.scrollLeft);
      const st = viewport!.scrollTop;
      const maxScrollX = viewport!.scrollWidth - viewport!.clientWidth;
      const maxScrollY = viewport!.scrollHeight - viewport!.clientHeight;
      return {
        startAccessible: forceStart || cutoffs.startCount === 0 || sl <= 1,
        endAccessible: forceEnd || cutoffs.endCount === 0 || sl >= maxScrollX - 1,
        topAccessible: forceTop || cutoffs.topCount === 0 || st <= 1,
        bottomAccessible: forceBottom || cutoffs.bottomCount === 0 || st >= maxScrollY - 1,
      };
    }

    // Snapshot selections at drag start for additive / deselect logic
    const selectionsAtStart = cellSelections;

    // Detect deselect mode: ctrl+click on an already-selected cell in multi-range
    let isDeselect = false;
    if (ctrlOnly && settings.cellSelectionMode === "multi-range") {
      const effectiveColStart = settings.ignoreFirstColumn ? 1 : 0;
      if (startCol >= effectiveColStart) {
        isDeselect = selectionsAtStart.some(
          (r) =>
            startCol >= r.columnStart &&
            startCol < r.columnEnd &&
            startRow >= r.rowStart &&
            startRow < r.rowEnd,
        );
      }
    }

    // Determine anchor position (shift extends from previous anchor)
    const anchorPosition: PositionGridCell =
      shiftOnly && settings.anchorRef.current ? settings.anchorRef.current : startPosition;

    if (!shiftOnly) settings.anchorRef.current = startPosition;

    let currentPosition: PositionGridCell = startPosition;

    function computeActiveRect() {
      return clampRectToAccessible(
        rectFromGridCellPositions(anchorPosition, currentPosition),
        cutoffs,
        getAccess(),
      );
    }

    // Deduplicated setActiveRange — avoids re-renders when the rect hasn't changed.
    // This matters most during autoscroll at a boundary where the grid can no longer
    // scroll but the rAF loop keeps firing.
    let lastActiveRect: DataRect | null = null;
    function setActiveRangeDeduped(rect: DataRect | null) {
      if (rectsEqual(rect, lastActiveRect)) return;
      lastActiveRect = rect;
      setActiveRange(rect);
    }

    // Initialise active range and committed selection state
    setDeselect(isDeselect);
    setActiveRangeDeduped(computeActiveRect());

    if (shiftOnly) {
      // Strip the last committed selection so only the active range rect is
      // visible during the drag (avoids visual doubling while extending).
      const withoutLast = selectionsAtStart.length > 0 ? selectionsAtStart.slice(0, -1) : [];
      settings.onCellSelectionChange(withoutLast);
    } else if (!ctrlOnly) {
      settings.onCellSelectionChange([]);
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
      setActiveRangeDeduped(computeActiveRect());
    }

    const autoscroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, updateSelectionAtPoint);

    ev.currentTarget.addEventListener(
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
          topOffset,
          bottomOffset,
          startOffset,
          endOffset,
          rtl,
          originTop,
          originBottom,
          originInStart,
          originInEnd,
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

        if (selectionFrame) cancelAnimationFrame(selectionFrame);
        selectionFrame = requestAnimationFrame(() => {
          setActiveRangeDeduped(computeActiveRect());
          selectionFrame = null;
        });
      },
      { signal: controller.signal },
    );

    ownerDoc.addEventListener(
      "mouseup",
      () => {
        controller.abort();
        autoscroller.stop();
        if (selectionFrame) {
          cancelAnimationFrame(selectionFrame);
          selectionFrame = null;
        }

        const finalRect = computeActiveRect();
        setActiveRange(null);
        setDeselect(false);

        if (!finalRect) {
          if (!ctrlOnly && !shiftOnly) settings.onCellSelectionChange([]);
          return;
        }

        if (ctrlOnly && settings.cellSelectionMode === "multi-range") {
          if (isDeselect) {
            const remaining = selectionsAtStart.flatMap((sel) => deselectRect(sel, finalRect));
            settings.onCellSelectionChange(remaining);
          } else {
            settings.onCellSelectionChange([...selectionsAtStart, finalRect]);
          }
        } else if (shiftOnly) {
          const rest = selectionsAtStart.length > 0 ? selectionsAtStart.slice(0, -1) : [];
          settings.onCellSelectionChange([...rest, finalRect]);
        } else {
          settings.onCellSelectionChange([finalRect]);
        }
      },
      { signal: controller.signal },
    );
  });

  return onMouseDown;
}
