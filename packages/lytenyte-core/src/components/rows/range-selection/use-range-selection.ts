import type { MouseEventHandler } from "react";
import { useEvent } from "../../../internal.js";
import { useGridId } from "../../../root/contexts/grid-id.js";
import {
  getNearestFocusable,
  getPositionFromFocusable,
  rectFromGridCellPositions,
  type PositionGridCell,
} from "@1771technologies/lytenyte-shared";
import { useCellSelectionSettings } from "../../../root/contexts/cell-selection-context.js";
import { useActiveRangeSelection } from "../../../root/contexts/active-range-context.js";

export function useRangeSelection(mouseDown: MouseEventHandler<HTMLDivElement> | undefined) {
  const gridId = useGridId();
  const settings = useCellSelectionSettings();
  const { setActiveRange } = useActiveRangeSelection();

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useEvent((ev) => {
    mouseDown?.(ev);
    if (ev.isPropagationStopped() || ev.isDefaultPrevented() || settings.cellSelectionMode === "none") return;

    const controller = new AbortController();

    const startTarget = ev.target as HTMLElement;
    const cell = getNearestFocusable(gridId, startTarget);
    if (!cell) return;
    const startPosition = getPositionFromFocusable(gridId, cell);
    if (startPosition.kind !== "cell") return;
    let currentPosition: PositionGridCell = startPosition;

    // We are about to clear selection.
    settings.onCellSelectionChange([]);
    setActiveRange(rectFromGridCellPositions(startPosition, currentPosition));

    let frame: number | null = null;
    let previousTarget: HTMLElement | null = null;
    let previousCell: HTMLElement | null = null;

    ev.currentTarget.addEventListener(
      "mousemove",
      (ev) => {
        const target = ev.target as HTMLElement | null;
        if (target === previousTarget || !target) return;

        const cell = getNearestFocusable(gridId, target);
        if (!cell || cell === previousCell) return;
        const position = getPositionFromFocusable(gridId, cell);
        if (position.kind !== "cell") return;
        currentPosition = position;

        previousTarget = target;
        previousCell = cell;

        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          setActiveRange(rectFromGridCellPositions(startPosition, currentPosition));
          frame = null;
        });
      },
      { signal: controller.signal },
    );

    document.addEventListener(
      "mouseup",
      () => {
        controller.abort();
        setActiveRange(null);
        settings.onCellSelectionChange([rectFromGridCellPositions(startPosition, currentPosition)]);
      },
      { signal: controller.signal },
    );
  });

  return onMouseDown;
}
