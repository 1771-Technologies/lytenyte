import { useEffect } from "react";
import { useGridRoot } from "../context.js";
import { useEdgeScroll } from "./use-edge-scroll.js";
import type { DataRect, PositionUnion } from "../+types";
import {
  equal,
  getClientX,
  getClientY,
  getRelativeXPosition,
  getRelativeYPosition,
} from "@1771technologies/lytenyte-shared";
import { getNearestFocusable, getPositionFromFocusable } from "@1771technologies/lytenyte-shared";
import { isHTMLElement } from "@1771technologies/lytenyte-shared";
import { updateAdditiveCellSelection } from "./update-additive-cell-selection.js";
import { deselectRectRange } from "./deselect-rect-range.js";
import { isWithinSelectionRect } from "./is-within-selection-rect.js";
import { expandCellSelectionStart } from "./expand-cell-selection-start.js";
import { expandCellSelectionEnd } from "./expand-cell-selection-end.js";
import { expandCellSelectionDown } from "./expand-cell-selection-down.js";
import { expandCellSelectionUp } from "./expand-cell-selection-up.js";

function isNormalClick(event: MouseEvent) {
  return event.button === 0 && !event.altKey;
}

export function CellSelectionDriver() {
  const cx = useGridRoot();
  const grid = cx.grid;

  const viewport = cx.grid.state.viewport.useValue();
  const mode = cx.grid.state.cellSelectionMode.useValue();

  const { cancelX, cancelY, edgeScrollX, edgeScrollY } = useEdgeScroll(cx.grid);

  useEffect(() => {
    if (!viewport || mode === "none") return;

    const isMultiRange = mode === "multi-range";
    let isAdditive = false;
    let startSelection: DataRect | null = null as unknown as DataRect;

    let pointerStartX: number | null = 0;
    let pointerStartY: number | null = 0;

    let lastRect: DataRect | null = null;
    let animFrame: number | null = null;

    const gridId = grid.state.gridId.get();
    const pointerMove = (event: MouseEvent) => {
      if (animFrame) cancelAnimationFrame(animFrame);

      animFrame = requestAnimationFrame(() => {
        animFrame = null;

        const clientX = getClientX(event);
        const clientY = getClientY(event);

        const target = event.target;
        if (!isHTMLElement(target)) return;
        const focusable = getNearestFocusable(gridId, target);
        if (!focusable) return;
        const position = getPositionFromFocusable(gridId, focusable);
        if (position.kind !== "cell" && position.kind !== "full-width") return;
        const rowIndex = position.rowIndex;
        const columnIndex = position.colIndex;

        if (pointerStartX != null && pointerStartY != null) {
          const moveDeltaX = Math.abs(pointerStartX - clientX);
          const moveDeltaY = Math.abs(pointerStartY - clientY);
          if (moveDeltaX < 20 && moveDeltaY < 20) return;
          pointerStartX = null;
          pointerStartY = null;
        }
        if (!startSelection) return;

        const meta = grid.state.columnMeta.get();
        const startCount = meta.columnVisibleStartCount;
        const firstEnd = meta.columnVisibleCenterCount + startCount;

        const ds = grid.state.rowDataStore;
        const topCount = ds.rowTopCount.get();
        const centerCount = ds.rowCenterCount.get();
        const firstEndRow = centerCount + topCount;

        const relativeX = getRelativeXPosition(viewport, clientX);
        const isRtl = grid.state.rtl.get();

        const visualX = isRtl ? relativeX.right : relativeX.left;

        const startColSection =
          startSelection.columnStart < startCount
            ? "start"
            : startSelection.columnStart >= firstEnd
              ? "end"
              : "center";
        const colSection =
          columnIndex < startCount ? "start" : columnIndex >= firstEnd ? "end" : "center";

        const rowSection = rowIndex < topCount ? "top" : rowIndex >= firstEnd ? "bottom" : "center";
        const startRowSection =
          startSelection.rowStart < topCount
            ? "top"
            : startSelection.rowStart >= firstEndRow
              ? "bottom"
              : "center";

        const isSameColPin = startColSection === colSection;
        const isSameRowPin = startRowSection === rowSection;

        edgeScrollX(visualX, isRtl);
        const relativeY = getRelativeYPosition(viewport, clientY);
        edgeScrollY(relativeY.top);
        const scrollY = viewport.scrollTop;

        if (!isSameRowPin && rowIndex < topCount && scrollY > 0) return;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight - 4;
        if (!isSameRowPin && rowIndex > topCount + centerCount - 1 && scrollY < maxScroll) return;

        const scrollX = Math.abs(viewport.scrollLeft);

        if (!isSameColPin && columnIndex < startCount && scrollX > 0) return;
        const maxScrollX = viewport.scrollWidth - viewport.clientWidth - 4;
        if (!isSameColPin && columnIndex >= firstEnd && scrollX < maxScrollX) return;

        const startRow = rowIndex < startSelection.rowStart ? rowIndex : startSelection.rowStart;
        const endRow = rowIndex < startSelection.rowStart ? startSelection.rowEnd : rowIndex + 1;

        const startCol =
          columnIndex < startSelection.columnStart ? columnIndex : startSelection.columnStart;
        const endCol =
          columnIndex < startSelection.columnStart ? startSelection.columnEnd : columnIndex + 1;

        const active: DataRect[] = [
          { rowStart: startRow, rowEnd: endRow, columnStart: startCol, columnEnd: endCol },
        ];

        if (isAdditive) {
          updateAdditiveCellSelection(grid, active[0]);
        } else {
          grid.state.cellSelections.set(active);
        }
        lastRect = active[0];
      });
    };

    const pointerDown = (event: PointerEvent) => {
      if (!isNormalClick(event)) {
        document.removeEventListener("pointermove", pointerMove);

        // Prevent the default for the context menu, otherwise the cell
        // right clicked will be focused,
        // resulting in the cell selection changing.
        if (event.button == 2) event.preventDefault();
        return;
      }

      isAdditive = isMultiRange && (event.ctrlKey || event.metaKey);

      const target = event.target;
      if (!isHTMLElement(target)) return;
      const focusable = getNearestFocusable(gridId, target);
      if (!focusable) return;
      const position = getPositionFromFocusable(gridId, focusable);
      if (position.kind !== "cell" && position.kind !== "full-width") return;
      const rowIndex = position.rowIndex;
      const columnIndex = position.colIndex;

      // If the columnIndex or rowIndex is null then we haven't clicked a valid cell position.
      // This ends the row selection.
      if (columnIndex == null || rowIndex == null) {
        grid.state.cellSelections.set([]);
        grid.internal.cellSelectionPivot.set(null);
        return;
      }

      const isSelected = grid.state.cellSelections
        .get()
        .some((c) => isWithinSelectionRect(c, rowIndex, columnIndex));

      const isDeselect = isAdditive && isSelected;

      pointerStartX = event.clientX;
      pointerStartY = event.clientY;

      startSelection = {
        columnStart: columnIndex,
        columnEnd: columnIndex + 1,
        rowStart: rowIndex,
        rowEnd: rowIndex + 1,
      };

      // If shift key down we select an area. We can only select an area if a pivot has been established.
      // The pivot will always expand the last cell selection rect if there are multiple ones.
      const pivot = grid.internal.cellSelectionPivot.get();
      if (event.shiftKey && pivot) {
        const active = { ...pivot };

        active.columnStart = Math.min(columnIndex, active.columnStart);
        active.columnEnd = Math.max(columnIndex + 1, active.columnEnd);

        active.rowStart = Math.min(rowIndex, active.rowStart);
        active.rowEnd = Math.max(rowIndex + 1, active.rowEnd);

        grid.state.cellSelections.set([active]);

        // We need to prevent the default otherwise the cell to go to will be
        // focused. This leads to awkward behavior around the cell selection pivot
        event.preventDefault();

        document.addEventListener("mousemove", pointerMove);
        document.addEventListener("contextmenu", pointerUp);
        document.addEventListener("pointerup", pointerUp);
        return;
      }

      // We need to prevent the default for multi
      if (mode === "multi-range" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
      }

      if (!isDeselect && grid.state.cellSelections.get().length <= 1)
        grid.internal.cellSelectionPivot.set({ ...startSelection, isUnit: true });

      grid.internal.cellSelectionIsDeselect.set(isDeselect);

      if (isAdditive) {
        updateAdditiveCellSelection(grid, startSelection);
      } else {
        grid.state.cellSelections.set([startSelection]);
      }

      lastRect = startSelection;
      document.addEventListener("mousemove", pointerMove);
      document.addEventListener("contextmenu", pointerUp);
      document.addEventListener("pointerup", pointerUp);
    };

    const pointerUp = () => {
      startSelection = null;

      if (isAdditive) {
        const isDeselect = grid.internal.cellSelectionIsDeselect.get();
        const rects = isDeselect
          ? grid.state.cellSelections.get().flatMap((r) => deselectRectRange(r, lastRect!))
          : [...grid.state.cellSelections.get(), lastRect!];

        grid.state.cellSelections.set(rects);
        grid.internal.cellSelectionAdditiveRects.set(null);
        grid.internal.cellSelectionIsDeselect.set(false);
        isAdditive = false;
      }

      cancelX();
      cancelY();
      document.removeEventListener("pointerup", pointerUp);
      document.removeEventListener("contextmenu", pointerUp);
      document.removeEventListener("pointermove", pointerMove);
    };
    viewport.addEventListener("pointerdown", pointerDown);

    const handleKey = (ev: KeyboardEvent) => {
      const rtl = grid.state.rtl.get();
      const start = rtl ? "ArrowRight" : "ArrowLeft";
      const end = rtl ? "ArrowLeft" : "ArrowRight";

      if (!ev.shiftKey) return;

      let handled = false;
      if (ev.key === start) {
        expandCellSelectionStart(grid, ev.ctrlKey || ev.metaKey);
        handled = true;
      } else if (ev.key === end) {
        expandCellSelectionEnd(grid, ev.ctrlKey || ev.metaKey);
        handled = true;
      } else if (ev.key === "ArrowDown") {
        expandCellSelectionDown(grid, ev.ctrlKey || ev.metaKey);
        handled = true;
      } else if (ev.key === "ArrowUp") {
        expandCellSelectionUp(grid, ev.ctrlKey || ev.metaKey);
        handled = true;
      }

      if (handled) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    };

    viewport.addEventListener("keydown", handleKey);

    return () => {
      viewport.removeEventListener("pointerdown", pointerDown);
      viewport.removeEventListener("keydown", handleKey);
    };
  }, [cancelX, cancelY, edgeScrollX, edgeScrollY, grid, mode, viewport]);

  useEffect(() => {
    let prev: PositionUnion | null = null;
    return grid.internal.focusActive.watch(() => {
      const focus = grid.internal.focusActive.get();

      // If the focus is null, then we should just return. This keeps the existing selection
      // in place - for things like copy and paste.
      if (!focus) return;

      if (equal(prev, focus)) return;

      prev = focus;

      if (focus?.kind !== "cell" && focus?.kind !== "full-width") {
        grid.state.cellSelections.set([]);
        grid.internal.cellSelectionPivot.set(null);
        grid.internal.cellSelectionAdditiveRects.set([]);
      } else {
        grid.state.cellSelections.set([
          {
            rowStart: focus.rowIndex,
            rowEnd: focus.rowIndex + 1,
            columnStart: focus.colIndex,
            columnEnd: focus.colIndex + 1,
          },
        ]);
        grid.internal.cellSelectionPivot.set({
          rowStart: focus.rowIndex,
          rowEnd: focus.rowIndex + 1,
          columnStart: focus.colIndex,
          columnEnd: focus.colIndex + 1,
          isUnit: true,
        });
      }
    });
  }, [
    grid.internal.cellSelectionAdditiveRects,
    grid.internal.cellSelectionPivot,
    grid.internal.focusActive,
    grid.state.cellSelections,
  ]);

  return <></>;
}
