import { useEffect } from "react";
import { useEdgeScroll } from "../use-edge-scroll.js";
import {
  getClientX,
  getClientY,
  getRelativeXPosition,
  getRelativeYPosition,
} from "@1771technologies/lytenyte-shared";
import { getNearestFocusable, getPositionFromFocusable } from "@1771technologies/lytenyte-shared";
import { isHTMLElement } from "@1771technologies/lytenyte-shared";
import { updateAdditiveCellSelection } from "../update-additive-cell-selection.js";
import { deselectRectRange } from "../deselect-rect-range.js";
import { isWithinSelectionRect } from "../is-within-selection-rect.js";
import { useProRoot } from "../../root/context.js";
import { useRoot } from "@1771technologies/lytenyte-core-experimental/internal";
import type { DataRect } from "../../types/api.js";
import { useCellFocusChange } from "./use-cell-focus-change.js";
import { adjustRectForRowAndCellSpan } from "../adjust-rect-for-row-and-cell-span.js";
import { expandSelectionUp } from "../expand-selection-up.js";
import { expandSelectionDown } from "../expand-selection-down.js";
import { expandSelectionStart } from "../expand-selection-start.js";
import { expandSelectionEnd } from "../expand-selection-end.js";

function isNormalClick(event: MouseEvent) {
  return event.button === 0 && !event.altKey;
}

export function CellSelectionDriver() {
  const { rtl, view, source, viewport, focusActive, id } = useRoot();
  const {
    cellSelectionMode: mode,
    onCellSelectionChange,
    api,
    cellSelectionAdditiveRects,
    setCellSelectionAdditiveRects,

    cellSelections,

    cellSelectionIsDeselect,
  } = useProRoot();

  const { excludeMarker, keepSelection } = useProRoot();

  const { cancelX, cancelY, edgeScrollX, edgeScrollY } = useEdgeScroll();

  const topCount = source.useTopCount();
  const rowCount = source.useRowCount();
  const botCount = source.useBottomCount();

  useEffect(() => {
    if (!viewport || mode === "none") return;

    const isMultiRange = mode === "multi-range";
    let isAdditive = false;
    let start: DataRect | null = null as unknown as DataRect;

    let lastRect: DataRect | null = null;
    let animFrame: number | null = null;

    const gridId = id;
    const pointerMove = (event: MouseEvent) => {
      if (animFrame) cancelAnimationFrame(animFrame);

      animFrame = requestAnimationFrame(() => {
        animFrame = null;

        if (!start) return;

        const clientX = getClientX(event);
        const clientY = getClientY(event);

        // Check the target we moved over and ensure it is an HTML element.
        if (!isHTMLElement(event.target)) return;

        // Get the focusable position for the currently hovered cell.
        const focusable = getNearestFocusable(gridId, event.target);
        if (!focusable) return;

        const position = getPositionFromFocusable(gridId, focusable);
        if (position.kind !== "cell" && position.kind !== "full-width") return;

        const startCount = view.startCount;
        const firstEnd = view.centerCount + startCount;

        const centerCount = rowCount - topCount - botCount;
        const firstEndRow = centerCount + topCount;

        const relativeX = getRelativeXPosition(viewport, clientX);
        const isRtl = rtl;

        const visualX = isRtl ? relativeX.right : relativeX.left;

        const rowIndex = position.rowIndex;
        const columnIndex = position.colIndex;

        const startColSection =
          start.columnStart < startCount ? "start" : start.columnStart >= firstEnd ? "end" : "center";
        const colSection = columnIndex < startCount ? "start" : columnIndex >= firstEnd ? "end" : "center";

        const rowSection = rowIndex < topCount ? "top" : rowIndex >= firstEnd ? "bottom" : "center";
        const startRowSection =
          start.rowStart < topCount ? "top" : start.rowStart >= firstEndRow ? "bottom" : "center";

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

        const rowSpan = position.kind === "full-width" || !position.root ? 1 : position.root.rowSpan;
        const colSpan = position.kind === "full-width" || !position.root ? 1 : position.root.colSpan;

        const rs = Math.min(rowIndex, start.rowStart);
        const re = Math.max(rowIndex + rowSpan, start.rowEnd);
        const ce = Math.max(columnIndex + colSpan, start.columnEnd);

        let cs = Math.min(columnIndex, start.columnStart);
        if (excludeMarker) cs = Math.max(cs, 1);

        const active: DataRect = { rowStart: rs, rowEnd: re, columnStart: cs, columnEnd: ce };

        if (isAdditive) {
          updateAdditiveCellSelection(
            api,
            view,
            topCount,
            rowCount,
            botCount,
            active,
            cellSelectionAdditiveRects,
            setCellSelectionAdditiveRects,
          );
        } else {
          onCellSelectionChange([adjustRectForRowAndCellSpan(api.cellRoot, active)]);
        }
        lastRect = active;
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

      if (excludeMarker && columnIndex === 0) return;

      // If the columnIndex or rowIndex is null then we haven't clicked a valid cell position.
      // This ends the row selection.
      if (columnIndex == null || rowIndex == null) {
        onCellSelectionChange([]);
        return;
      }

      const isSelected = cellSelections.some((c) => isWithinSelectionRect(c, rowIndex, columnIndex));

      const isDeselect = isAdditive && isSelected;

      const rowSpan = position.kind === "full-width" || !position.root ? 1 : position.root.rowSpan;
      const colSpan = position.kind === "full-width" || !position.root ? 1 : position.root.colSpan;

      start = {
        columnStart: columnIndex,
        columnEnd: columnIndex + colSpan,
        rowStart: rowIndex,
        rowEnd: rowIndex + rowSpan,
      };

      // If shift key down we select an area. We can only select an area if a pivot has been established.
      // The pivot will always expand the last cell selection rect if there are multiple ones.
      if (event.shiftKey) {
        const position = focusActive.get();

        if (position?.kind !== "cell") return;

        const pivot: DataRect = {
          rowStart: position.root ? position.root.rowIndex : position.rowIndex,
          rowEnd: position.root ? position.root.rowIndex + position.root.rowSpan : position.rowIndex + 1,
          columnStart: position.root ? position.root.colIndex : position.colIndex,
          columnEnd: position.root ? position.root.colIndex + position.root.colSpan : position.colIndex,
        };

        const active = { ...pivot };

        active.columnStart = Math.min(columnIndex, active.columnStart);
        active.columnEnd = Math.max(columnIndex + 1, active.columnEnd);

        active.rowStart = Math.min(rowIndex, active.rowStart);
        active.rowEnd = Math.max(rowIndex + 1, active.rowEnd);

        onCellSelectionChange([active]);

        // We need to prevent the default otherwise the cell to go to will be
        // focused. This leads to awkward behavior around the cell selection pivot
        event.preventDefault();

        return;
      }

      // We need to prevent the default for multi
      if (mode === "multi-range" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
      }

      cellSelectionIsDeselect.current = isDeselect;

      if (isAdditive) {
        updateAdditiveCellSelection(
          api,
          view,
          topCount,
          rowCount,
          botCount,
          start,
          cellSelectionAdditiveRects,
          setCellSelectionAdditiveRects,
        );
      } else {
        onCellSelectionChange([adjustRectForRowAndCellSpan(api.cellRoot, start)]);
      }

      lastRect = start;
      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("contextmenu", pointerUp);
      document.addEventListener("pointerup", pointerUp);
    };

    const pointerUp = () => {
      start = null;

      if (isAdditive) {
        const isDeselect = cellSelectionIsDeselect.current;
        const rects = isDeselect
          ? cellSelections.flatMap((r) => deselectRectRange(r, lastRect!))
          : [...cellSelections, lastRect!];

        onCellSelectionChange(rects);
        setCellSelectionAdditiveRects(null);
        cellSelectionIsDeselect.current = false;
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
      const start = rtl ? "ArrowRight" : "ArrowLeft";
      const end = rtl ? "ArrowLeft" : "ArrowRight";

      const position = focusActive.get();

      if (!ev.shiftKey || position?.kind !== "cell") return;

      let handled = false;
      if (ev.key === "ArrowUp") {
        expandSelectionUp(api, cellSelections, onCellSelectionChange, ev.ctrlKey || ev.metaKey, position);
        handled = true;
      } else if (ev.key === "ArrowDown") {
        expandSelectionDown(
          api,
          cellSelections,
          onCellSelectionChange,
          ev.ctrlKey || ev.metaKey,
          position,
          rowCount,
        );
        handled = true;
      } else if (ev.key === start) {
        expandSelectionStart(
          api,
          cellSelections,
          onCellSelectionChange,
          ev.ctrlKey || ev.metaKey,
          position,
          excludeMarker,
        );
        handled = true;
      } else if (ev.key === end) {
        expandSelectionEnd(
          api,
          cellSelections,
          onCellSelectionChange,
          ev.ctrlKey || ev.metaKey,
          position,
          view,
        );
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
  }, [
    api,
    botCount,
    cancelX,
    cancelY,
    cellSelectionAdditiveRects,
    cellSelectionIsDeselect,
    cellSelections,
    edgeScrollX,
    edgeScrollY,
    excludeMarker,
    focusActive,
    id,
    mode,
    onCellSelectionChange,
    rowCount,
    rtl,
    setCellSelectionAdditiveRects,
    topCount,
    view,
    viewport,
  ]);

  useCellFocusChange(
    focusActive,
    excludeMarker,
    keepSelection,
    onCellSelectionChange,
    setCellSelectionAdditiveRects,
    api,
  );

  return <></>;
}
