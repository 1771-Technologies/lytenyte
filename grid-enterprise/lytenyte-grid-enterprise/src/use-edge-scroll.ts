import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useCallback, useRef } from "react";

export function useEdgeScroll<D>(api: ApiEnterpriseReact<D>) {
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
      const s = api.getState();
      const viewportClientHeight = s.internal.viewportInnerHeight.peek();
      const viewport = s.internal.viewport.peek()!;
      const viewportHeight = Math.min(viewportClientHeight * 0.1, 100);

      const buffer = viewportHeight;
      const topBound = buffer + s.internal.viewportHeaderHeight.peek();
      const botBound = viewportClientHeight - buffer;

      const speed = 3;
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
    [api, cancelY],
  );

  const edgeScrollX = useCallback(
    (visualPositionX: number, isRtl: boolean) => {
      const s = api.getState();

      const viewportClientWidth = s.internal.viewportInnerWidth.peek();
      const viewport = s.internal.viewport.peek()!;
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
    [api, cancelX],
  );

  return { cancelX, edgeScrollX, cancelY, edgeScrollY };
}
