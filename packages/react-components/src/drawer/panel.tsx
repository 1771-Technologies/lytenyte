import { forwardRef, useMemo, useRef, type CSSProperties, type JSX, type TouchEvent } from "react";
import { DialogPanel } from "../dialog/panel.js";
import { useDrawerContext } from "./root.use-drawer.js";

const SWIPE_THRESHOLD = 100; // Minimum distance (px) for a swipe
const SWIPE_TIME_THRESHOLD = 500; // Maximum time (ms) allowed to perform the swipe

interface SwipePoint {
  x: number;
  y: number;
  time: number;
}

export const DrawerPanel = forwardRef<HTMLDialogElement, JSX.IntrinsicElements["dialog"]>(
  function DrawerPanel({ onTouchEnd, onTouchStart, ...props }, forwarded) {
    const { side, offset, onOpenChange, swipeToClose } = useDrawerContext();

    const resolvedOffset = useMemo(() => {
      if (typeof offset === "number") {
        const px = `${offset}px`;
        return {
          "--drawer-offset-inline-start": px,
          "--drawer-offset-inline-end": px,
          "--drawer-offset-block-start": px,
          "--drawer-offset-block-end": px,
        } as CSSProperties;
      }

      if (offset.length === 2) {
        const [block, inline] = offset;
        return {
          "--drawer-offset-inline-start": `${inline}px`,
          "--drawer-offset-inline-end": `${inline}px`,
          "--drawer-offset-block-start": `${block}px`,
          "--drawer-offset-block-end": `${block}px`,
        } as CSSProperties;
      }

      const [top, end, bottom, start] = offset;
      return {
        "--drawer-offset-inline-start": `${start}px`,
        "--drawer-offset-inline-end": `${end}px`,
        "--drawer-offset-block-start": `${top}px`,
        "--drawer-offset-block-end": `${bottom}px`,
      } as CSSProperties;
    }, [offset]);

    const startPoint = useRef<SwipePoint | null>(null);

    const events = useMemo(() => {
      // Can't really test this without having a mobile device.
      /* v8 ignore next 45 */
      const onTouchStartInternal = (e: TouchEvent<HTMLDialogElement>) => {
        onTouchStart?.(e);
        if (!swipeToClose) return;
        const touch = e.changedTouches[0];
        startPoint.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      };
      const onTouchEndInternal = (e: TouchEvent<HTMLDialogElement>) => {
        onTouchEnd?.(e);
        if (!swipeToClose) return;
        if (!startPoint.current) return;

        const touch = e.changedTouches[0];
        const endPoint: SwipePoint = { x: touch.clientX, y: touch.clientY, time: Date.now() };

        const deltaX = endPoint.x - startPoint.current.x;
        const deltaY = endPoint.y - startPoint.current.y;
        const deltaTime = endPoint.time - startPoint.current.time;

        if (deltaTime > SWIPE_TIME_THRESHOLD) {
          startPoint.current = null;
          return;
        }

        const dir = getComputedStyle(e.currentTarget).direction === "rtl";
        const rtlAdjustedSide = side === "start" ? (dir ? "end" : "start") : dir ? "start" : "end";

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > SWIPE_THRESHOLD && rtlAdjustedSide === "end") onSwipeFromStart();
          else if (deltaX < -SWIPE_THRESHOLD && rtlAdjustedSide === "start") onSwipeFromEnd();
        } else {
          if (deltaY < -SWIPE_THRESHOLD && side === "top") onSwipeFromTop();
          else if (deltaY > SWIPE_THRESHOLD && side === "bottom") onSwipeFromBottom();
        }

        startPoint.current = null;
      };

      const closeDialog = () => onOpenChange(false);
      const onSwipeFromStart = () => closeDialog();
      const onSwipeFromEnd = () => closeDialog();
      const onSwipeFromTop = () => closeDialog();
      const onSwipeFromBottom = () => closeDialog();

      return { onTouchStart: onTouchStartInternal, onTouchEnd: onTouchEndInternal };
    }, [onOpenChange, onTouchEnd, onTouchStart, side, swipeToClose]);

    return (
      <DialogPanel
        {...props}
        {...events}
        style={{ ...props.style, ...resolvedOffset }}
        data-ln-drawer-side={side}
        ref={forwarded}
      />
    );
  },
);
