import { useCallback, useRef } from "react";
import type { Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";

export function useEdgeScroll(grid: Grid<any> & { internal: InternalAtoms }) {
  const intervalIdX = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervalIdY = useRef<ReturnType<typeof setInterval> | null>(null);

  const cancelX = useCallback(() => {
    if (intervalIdX.current) {
      clearInterval(intervalIdX.current);
      intervalIdX.current = null;
    }
  }, []);

  const cancelY = useCallback(() => {
    if (intervalIdY.current) {
      clearInterval(intervalIdY.current);
      intervalIdY.current = null;
    }
  }, []);

  const edgeScrollY = useCallback(
    (visualPositionY: number) => {
      const viewport = grid.state.viewport.get();

      if (!viewport) return;

      const viewportClientHeight = grid.state.viewportHeightInner.get();
      const viewportHeight = Math.min(viewportClientHeight * 0.1, 100);

      const buffer = viewportHeight;
      const topBound = buffer + grid.internal.headerHeightTotal.get();
      const botBound = viewportClientHeight - buffer;

      const speed = 6;
      if (visualPositionY < topBound && !intervalIdY.current) {
        intervalIdY.current = setInterval(() => {
          viewport.scrollBy({ top: -speed });
        }, 6);
      } else if (visualPositionY > botBound && !intervalIdY.current) {
        intervalIdY.current = setInterval(() => {
          viewport.scrollBy({ top: speed });
        }, 6);
      }

      if (intervalIdY.current && visualPositionY > topBound && visualPositionY < botBound) {
        cancelY();
      }
    },
    [cancelY, grid.internal.headerHeightTotal, grid.state.viewport, grid.state.viewportHeightInner],
  );

  const edgeScrollX = useCallback(
    (visualPositionX: number, isRtl: boolean) => {
      const viewport = grid.state.viewport.get();
      if (!viewport) return;

      const viewportClientWidth = grid.state.viewportWidthInner.get();
      const viewportWidth = Math.min(viewportClientWidth * 0.1, 100);

      const buffer = viewportWidth;
      const leftBound = buffer;
      const rightBound = viewportClientWidth - buffer;

      const speed = 3;
      if (visualPositionX < leftBound && !intervalIdX.current) {
        intervalIdX.current = setInterval(() => {
          viewport.scrollBy({ left: isRtl ? speed : -speed });
        }, 6);
      } else if (visualPositionX > rightBound && !intervalIdX.current) {
        intervalIdX.current = setInterval(() => {
          viewport.scrollBy({ left: isRtl ? -speed : speed });
        }, 6);
      }

      if (intervalIdX.current && visualPositionX > leftBound && visualPositionX < rightBound) {
        cancelX();
      }
    },
    [cancelX, grid.state.viewport, grid.state.viewportWidthInner],
  );

  return { cancelX, edgeScrollX, cancelY, edgeScrollY };
}
