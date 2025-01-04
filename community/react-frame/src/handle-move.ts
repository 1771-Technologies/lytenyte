import { clamp, getClientX, getClientY } from "@1771technologies/js-utils";
import type { RefObject } from "react";
import type { FrameAxeProps } from "./frame.js";

/**
 * Handles the dragging/moving behavior of a frame element with pointer events.
 * Includes accessibility announcements and bounds checking to keep the frame within the window.
 *
 * @internal
 * @param el - The initial pointer event that triggered the move
 * @param announcer - HTML element used for accessibility announcements
 * @param axe - Accessibility props containing move-related announcement text
 * @param ref - Reference to the frame element being moved
 * @param raf - Reference to track requestAnimationFrame ID for cleanup
 * @param onMove - Callback function invoked when the frame position changes
 * @param w - Current width of the frame
 * @param h - Current height of the frame
 * @param sizeSync - Function to synchronize the frame size after movement
 *
 * @remarks
 * The function implements the following behavior:
 * - Prevents default pointer event handling
 * - Sets up pointer move tracking with a small delay
 * - Temporarily disables pointer events on the frame during movement
 * - Uses requestAnimationFrame for smooth movement
 * - Clamps the frame position to keep it within window bounds
 * - Provides accessibility announcements at start and end of movement
 * - Cleans up event listeners and restores pointer events on completion
 *
 * @example
 * ```typescript
 * handleMove(
 *   pointerEvent,
 *   announcerElement,
 *   axeProps,
 *   frameRef.current,
 *   rafRef,
 *   (x, y) => console.log(`Moved to ${x},${y}`),
 *   400, // width
 *   300, // height
 *   () => syncFrameSize()
 * );
 * ```
 */
export function handleMove(
  el: PointerEvent,
  announcer: HTMLElement,
  axe: FrameAxeProps,
  ref: HTMLElement,
  raf: RefObject<number | null>,
  onMove: (x: number, h: number) => void,
  w: number,
  h: number,
  sizeSync: () => void,
) {
  el.preventDefault();
  let prevX = getClientX(el);
  let prevY = getClientY(el);

  const controller = new AbortController();
  const prevPointerEvents = ref!.style.pointerEvents;

  const t = setTimeout(() => {
    ref!.style.pointerEvents = "none";

    announcer.textContent = axe.axeMoveStartText(prevX, prevY);
    window.addEventListener(
      "pointermove",
      (el) => {
        if (raf.current) cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
          const currentX = getClientX(el);
          const currentY = getClientY(el);

          const deltaX = currentX - prevX;
          const deltaY = currentY - prevY;

          const s = getComputedStyle(ref!);
          const x = Number.parseInt(s.left);
          const y = Number.parseInt(s.top);

          const newX = clamp(0, x + deltaX, window.innerWidth - w!);
          const newY = clamp(0, y + deltaY, window.innerHeight - h!);

          Object.assign(ref!.style, { top: `${newY}px`, left: `${newX}px` });

          prevX = currentX;
          prevY = currentY;
        });
      },
      { signal: controller.signal },
    );
  }, 40);

  window.addEventListener("pointerup", () => {
    controller.abort();
    Object.assign(ref!.style, { pointerEvents: prevPointerEvents });

    const s = getComputedStyle(ref!);
    const x = Number.parseInt(s.left);
    const y = Number.parseInt(s.top);

    announcer.textContent = axe.axeMoveEndText(x, y);
    onMove?.(x, y);

    setTimeout(sizeSync);
    raf.current = null;
    clearTimeout(t);
  });
}
