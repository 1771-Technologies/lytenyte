/* eslint-disable react-refresh/only-export-components */
import { useDialogRoot } from "../components-headless/dialog/context.js";
import { Dialog as D } from "../components-headless/dialog/dialog.js";
import { useMemo, useRef, type ComponentProps, type TouchEvent } from "react";
import { buttonStyles, type ButtonProps } from "./button.js";
import { tw } from "./tw.js";
import { cva } from "../external/cva.js";

const SWIPE_THRESHOLD = 100; // Minimum distance (px) for a swipe
const SWIPE_TIME_THRESHOLD = 500; // Maximum time (ms) allowed to perform the swipe

interface SwipePoint {
  x: number;
  y: number;
  time: number;
}

export interface DrawerProps {
  readonly side?: "top" | "bottom" | "end" | "start";
  readonly swipeToClose?: boolean;
}

const drawerStyles = cva(
  tw(
    "bg-gray-100 max-h-[unset] max-w-[unset] transition-transform shadow",
    "ln-opening:backdrop:opacity-0 ln-closing:backdrop:opacity-0 backdrop:bg-gray-100/30 backdrop:transition-opacity start-[unset] end-[unset] top-[unset] bottom-[unset]",
  ),
  {
    variants: {
      side: {
        start:
          "border-e border-gray-300/50 h-screen ln-opening:-translate-x-full ln-closing:-translate-x-full start-0 bottom-0",
        end: "border-s border-gray-300/50 h-screen ln-opening:translate-x-full ln-closing:translate-x-full end-0 bottom-0",
        top: "border-b border-gray-300/50 w-screen ln-opening:-translate-y-full ln-closing:-translate-y-full top-0 start-0",
        bottom:
          "border-t border-gray-300/50 w-screen ln-opening:translate-y-full ln-closing:translate-y-full bottom-0 start-0",
      },
    },
  },
);

const Container = ({
  side = "start",
  swipeToClose = true,
  onTouchStart,
  onTouchEnd,
  ...props
}: ComponentProps<typeof D.Container> & DrawerProps) => {
  const startPoint = useRef<SwipePoint | null>(null);

  const dialog = useDialogRoot();
  const events = useMemo(() => {
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
      const endPoint: SwipePoint = { x: touch.clientX, y: touch.clientY, time: 0 };

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

    const closeDialog = () => dialog.onOpenChange(false);
    const onSwipeFromStart = () => closeDialog();
    const onSwipeFromEnd = () => closeDialog();
    const onSwipeFromTop = () => closeDialog();
    const onSwipeFromBottom = () => closeDialog();

    return { onTouchStart: onTouchStartInternal, onTouchEnd: onTouchEndInternal };
  }, [dialog, onTouchEnd, onTouchStart, side, swipeToClose]);

  return (
    <D.Container
      {...props}
      {...events}
      className={tw(drawerStyles({ side }), props.className)}
      data-ln-drawer-side={side}
    />
  );
};

const Trigger = ({
  kind = "primary",
  size = "default",
  ...props
}: ComponentProps<typeof D.Trigger> & ButtonProps) => {
  return <D.Trigger {...props} className={tw(buttonStyles({ kind, size }), props.className)} />;
};

const Close = ({
  kind = "tertiary",
  size = "default",
  ...props
}: ComponentProps<typeof D.Close> & ButtonProps) => {
  return <D.Close {...props} className={tw(buttonStyles({ kind, size }), props.className)} />;
};

export const Drawer = {
  Container,
  Root: D.Root,
  Close,
  Trigger,
};
