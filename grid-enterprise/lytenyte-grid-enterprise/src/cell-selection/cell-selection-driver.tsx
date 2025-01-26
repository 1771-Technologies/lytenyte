import { useEffect } from "react";
import { useEdgeScroll } from "../use-edge-scroll";
import { useGrid } from "../use-grid";
import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";
import {
  getClientX,
  getClientY,
  getRelativeXPosition,
  getRelativeYPosition,
} from "@1771technologies/js-utils";
import { getHoveredColumnIndex, getHoveredRowIndex } from "@1771technologies/grid-core";
import {
  deselectRectRange,
  updateAdditiveCellSelection,
} from "@1771technologies/grid-core-enterprise";

function isNormalClick(event: MouseEvent) {
  return event.button === 0 && !event.ctrlKey && !event.altKey && !event.metaKey;
}

export function CellSelectionDriver() {
  const { state, api } = useGrid();

  const viewport = state.internal.viewport.use();
  const mode = state.cellSelectionMode.use();

  const { cancelX, cancelY, edgeScrollX, edgeScrollY } = useEdgeScroll(api);

  useEffect(() => {
    if (!viewport || mode === "none" || mode === "single") {
      return;
    }

    const isMultiRange = mode === "multi-range";
    let isAdditive = false;
    let startSelection: CellSelectionRect | null = null;

    let pointerStartX: number | null = 0;
    let pointerStartY: number | null = 0;

    let lastRect: CellSelectionRect | null = null;
    let animFrame: number | null = null;

    const pointerMove = (event: PointerEvent) => {
      if (animFrame) cancelAnimationFrame(animFrame);

      animFrame = requestAnimationFrame(() => {
        animFrame = null;

        const s = api.getState();

        const clientX = getClientX(event);
        const clientY = getClientY(event);

        const columnIndex = getHoveredColumnIndex(api, clientX);
        const rowIndex = getHoveredRowIndex(api, clientY);
        if (rowIndex == null || columnIndex == null) return;

        // Check if we have moved enough to qualify for a drag even.
        if (pointerStartX != null && pointerStartY != null) {
          const moveDeltaX = Math.abs(pointerStartX - clientX);
          const moveDeltaY = Math.abs(pointerStartY - clientY);
          if (moveDeltaX < 20 && moveDeltaY < 20) return;
          pointerStartX = null;
          pointerStartY = null;
        }
        if (!startSelection) return;

        // Handle edge scrolling
        const relativeX = getRelativeXPosition(viewport, clientX);
        const isRtl = s.rtl.peek();
        const visualX = isRtl ? relativeX.right : relativeX.left;

        edgeScrollX(visualX, isRtl);
        const relativeY = getRelativeYPosition(viewport, clientY);
        edgeScrollY(relativeY.top);

        const topCount = s.internal.rowTopCount.peek();
        const centerCount =
          s.internal.rowCount.peek() - topCount - s.internal.rowBottomCount.peek();

        const scrollY = s.internal.viewport.peek()!.scrollTop;
        if (rowIndex < topCount && scrollY > 0) return;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight - 4;
        if (rowIndex > topCount + centerCount - 1 && scrollY < maxScroll) return;

        const startCount = s.columnVisibleStartCount.peek();
        const firstEnd = s.columnVisibleCenterCount.peek() + startCount;

        const scrollX = Math.abs(s.internal.viewport.peek()!.scrollLeft);

        if (columnIndex < startCount && scrollX > 0) return;
        const maxScrollX = viewport.scrollWidth - viewport.clientWidth - 4;
        if (columnIndex >= firstEnd && scrollX < maxScrollX) return;

        const startRow = rowIndex < startSelection.rowStart ? rowIndex : startSelection.rowStart;
        const endRow = rowIndex < startSelection.rowStart ? startSelection.rowEnd : rowIndex + 1;
        const startCol =
          columnIndex < startSelection.columnStart ? columnIndex : startSelection.columnStart;
        const endCol =
          columnIndex < startSelection.columnStart ? startSelection.columnEnd : columnIndex + 1;

        const active: CellSelectionRect[] = [
          { rowStart: startRow, rowEnd: endRow, columnStart: startCol, columnEnd: endCol },
        ];

        if (isAdditive) {
          updateAdditiveCellSelection(api, active[0]);
        } else {
          s.cellSelections.set(active);
        }
        lastRect = active[0];
      });
    };

    const pointerDown = (event: PointerEvent) => {
      if (!isMultiRange && !isNormalClick(event)) {
        document.removeEventListener("pointermove", pointerMove);
        event.preventDefault();
        return;
      }

      const s = api.getState();

      const contextMenuOpen = !!s.internal.contextMenuTarget.peek();
      const columnMenuOpen = !!s.internal.columnMenuColumn.peek();
      const panelFrameOpen = !!s.internal.panelFrameOpen.peek();
      const floatingFrameOpen = !!s.internal.floatingFrameOpen.peek();

      if (contextMenuOpen || columnMenuOpen || panelFrameOpen || floatingFrameOpen) {
        document.removeEventListener("pointermove", pointerMove);
        return;
      }

      isAdditive = isMultiRange && (event.ctrlKey || event.metaKey);

      const clientX = getClientX(event);
      const clientY = getClientY(event);

      const columnIndex = getHoveredColumnIndex(api, clientX);
      const rowIndex = getHoveredRowIndex(api, clientY);

      // If the columnIndex or rowIndex is null then we haven't clicked a valid cell position.
      // This ends the row selection.
      if (columnIndex == null || rowIndex == null) {
        s.cellSelections.set([]);
        return;
      }

      const isDeselect = isAdditive && api.cellSelectionIsSelected(rowIndex, columnIndex);

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
      const pivot = s.internal.cellSelectionPivot.peek();
      if (event.shiftKey && pivot) {
        const active = { ...pivot };

        active.columnStart = Math.min(columnIndex, active.columnStart);
        active.columnEnd = Math.max(columnIndex + 1, active.columnEnd);

        active.rowStart = Math.min(rowIndex, active.rowStart);
        active.rowEnd = Math.max(rowIndex + 1, active.rowEnd);

        s.cellSelections.set([active]);

        // We need to prevent the default otherwise the cell to go to will be
        // focused. This leads to awkward behavior around the cell selection pivot
        event.preventDefault();
        return;
      }

      // We need to prevent the default for multi
      if (mode === "multi-range" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
      }

      s.internal.cellSelectionPivot.set(startSelection);
      s.internal.cellSelectionIsDeselect.set(isDeselect);

      if (isAdditive) {
        updateAdditiveCellSelection(api, startSelection);
      } else {
        s.cellSelections.set([startSelection]);
      }

      lastRect = startSelection;
      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerup", pointerUp);
    };

    const pointerUp = () => {
      startSelection = null;

      if (isAdditive) {
        const s = api.getState();

        const isDeselect = s.internal.cellSelectionIsDeselect.peek();
        const rects = isDeselect
          ? s.cellSelections.peek().flatMap((r) => deselectRectRange(r, lastRect!))
          : [...s.cellSelections.peek(), lastRect!];

        s.cellSelections.set(rects);
        s.internal.cellSelectionAdditiveRects.set(null);
        s.internal.cellSelectionIsDeselect.set(false);
        isAdditive = false;
      }

      cancelX();
      cancelY();
      document.removeEventListener("pointerup", pointerUp);
      document.removeEventListener("pointermove", pointerMove);
    };

    viewport.addEventListener("pointerdown", pointerDown);

    return () => {
      viewport.removeEventListener("pointerdown", pointerDown);
    };
  }, [api, cancelX, cancelY, edgeScrollX, edgeScrollY, mode, viewport]);

  return <></>;
}
