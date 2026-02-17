import { useRoot } from "@1771technologies/lytenyte-core-experimental/internal";
import { useCallback, useRef } from "react";

export function useEdgeScroll() {
  const { viewport, dimensions, totalHeaderHeight, yPositions, source } = useRoot();

  const rowTopCount = source.useTopCount();
  const rowBottomCount = source.useBottomCount();
  const bottomHeight = yPositions.at(-1)! - yPositions.at(-1 - rowBottomCount)!;
  const topHeight = yPositions.at(rowTopCount)!;

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
    (visualPositionY: number, startY: number) => {
      if (!viewport) return;

      const viewportClientHeight = dimensions.innerHeight;

      const topBound = totalHeaderHeight + topHeight;
      const botBound = viewportClientHeight - bottomHeight;

      const scrollTop = startY > topBound && visualPositionY <= totalHeaderHeight + 20;
      const scrollBottom = startY < botBound && visualPositionY >= viewportClientHeight - 20;

      const speed = 6;
      if (scrollTop && !intervalIdY.current) {
        intervalIdY.current = setInterval(() => {
          viewport.scrollBy({ top: -speed });
        }, 6);
      } else if (scrollBottom && !intervalIdY.current) {
        intervalIdY.current = setInterval(() => {
          viewport.scrollBy({ top: speed });
        }, 6);
      }

      if (!scrollBottom && !scrollTop && intervalIdY.current) {
        clearInterval(intervalIdY.current);
        intervalIdY.current = null;
      }
    },
    [bottomHeight, dimensions.innerHeight, topHeight, totalHeaderHeight, viewport],
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
