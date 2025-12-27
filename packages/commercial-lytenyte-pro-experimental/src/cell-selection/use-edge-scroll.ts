import { useRoot } from "@1771technologies/lytenyte-core-experimental/internal";
import { useCallback, useRef } from "react";

export function useEdgeScroll() {
  const { viewport, dimensions, totalHeaderHeight } = useRoot();

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
      if (!viewport) return;

      const viewportClientHeight = dimensions.innerHeight;
      const viewportHeight = Math.min(viewportClientHeight * 0.1, 100);

      const buffer = viewportHeight;
      const topBound = buffer + totalHeaderHeight;
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
    [cancelY, dimensions.innerHeight, totalHeaderHeight, viewport],
  );

  const edgeScrollX = useCallback(
    (visualPositionX: number, isRtl: boolean) => {
      if (!viewport) return;

      const viewportClientWidth = dimensions.innerWidth;
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
    [cancelX, dimensions.innerWidth, viewport],
  );

  return { cancelX, edgeScrollX, cancelY, edgeScrollY };
}
