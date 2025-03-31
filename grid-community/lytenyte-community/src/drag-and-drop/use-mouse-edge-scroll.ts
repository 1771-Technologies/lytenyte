import { useCallback, useEffect, useRef, useState } from "react";

interface UseMouseEdgeScrollParams {
  isActive: boolean;
  threshold?: number; // Distance (in px) to start scrolling when mouse near edges
  direction?: "horizontal" | "vertical" | "both"; // Scrolling direction
  maxSpeed?: number; // Maximum scroll speed
  acceleration?: number; // Acceleration factor
}

export const useEdgeScroll = ({
  isActive,
  threshold = 50,
  direction = "both",
  maxSpeed = 20,
  acceleration = 0.5,
}: UseMouseEdgeScrollParams) => {
  const [container, ref] = useState<HTMLElement | null>(null);

  const scrollIntervalX = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollIntervalY = useRef<ReturnType<typeof setInterval> | null>(null);

  const speedX = useRef<number>(0);
  const speedY = useRef<number>(0);

  const stopScrollX = useCallback(() => {
    if (scrollIntervalX.current) {
      clearInterval(scrollIntervalX.current);
      scrollIntervalX.current = null;
      speedX.current = 0;
    }
  }, []);
  const stopScrollY = useCallback(() => {
    if (scrollIntervalY.current) {
      clearInterval(scrollIntervalY.current);
      scrollIntervalY.current = null;
      speedY.current = 0;
    }
  }, []);
  const stopScrolling = useCallback((): void => {
    stopScrollX();
    stopScrollY();
  }, [stopScrollX, stopScrollY]);

  const startScrollingXLeft = useCallback(() => {
    if (!scrollIntervalX.current) {
      scrollIntervalX.current = setInterval(() => {
        speedX.current = Math.min(speedX.current + acceleration, maxSpeed);
        container?.scrollBy({ left: speedX.current * -1 });
      }, 16);
    }
  }, [acceleration, container, maxSpeed]);
  const startScrollingXRight = useCallback(() => {
    if (!scrollIntervalX.current) {
      scrollIntervalX.current = setInterval(() => {
        speedX.current = Math.min(speedX.current + acceleration, maxSpeed);
        container?.scrollBy({ left: speedX.current });
      }, 16);
    }
  }, [acceleration, container, maxSpeed]);

  const startScrollTop = useCallback(() => {
    if (!scrollIntervalY.current) {
      scrollIntervalY.current = setInterval(() => {
        speedY.current = Math.min(speedY.current + acceleration, maxSpeed);
        container?.scrollBy({ top: speedY.current * -1 });
      }, 16);
    }
  }, [acceleration, container, maxSpeed]);
  const startScrollBottom = useCallback(() => {
    if (!scrollIntervalY.current) {
      scrollIntervalY.current = setInterval(() => {
        speedY.current = Math.min(speedY.current + acceleration, maxSpeed);
        container?.scrollBy({ top: speedY.current });
      }, 16);
    }
  }, [acceleration, container, maxSpeed]);

  const controllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!isActive) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      stopScrolling();
      return;
    }

    if (!container) return;

    const handleMouseMove = (event: PointerEvent) => {
      const containerRect = container.getBoundingClientRect();

      const distanceToTop = Math.abs(event.clientY - containerRect.top);
      const distanceToBottom = Math.abs(event.clientY - containerRect.bottom);
      const distanceToLeft = Math.abs(event.clientX - containerRect.left);
      const distanceToRight = Math.abs(event.clientX - containerRect.right);

      if (direction === "both" || direction === "horizontal") {
        if (distanceToLeft < threshold) {
          startScrollingXLeft();
        } else if (distanceToRight < threshold) {
          startScrollingXRight();
        } else {
          stopScrollX();
        }
      }
      if (direction === "both" || direction === "vertical") {
        if (distanceToTop < threshold) {
          startScrollTop();
        } else if (distanceToBottom < threshold) {
          startScrollBottom();
        } else {
          stopScrollY();
        }
      }
    };

    const controller = new AbortController();
    controllerRef.current = controller;

    container.addEventListener("pointermove", handleMouseMove, {
      passive: false,
      capture: true,
      signal: controller.signal,
    });
    container.addEventListener("pointerleave", stopScrolling);

    return () => {
      controller.abort();
      stopScrolling();
    };
  }, [
    isActive,
    threshold,
    direction,
    maxSpeed,
    acceleration,
    container,
    stopScrolling,
    startScrollingXLeft,
    startScrollingXRight,
    stopScrollX,
    startScrollTop,
    startScrollBottom,
    stopScrollY,
  ]);

  return ref;
};
