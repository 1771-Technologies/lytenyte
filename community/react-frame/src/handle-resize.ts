import { getClientX, getClientY } from "@1771technologies/js-utils";
import type { FrameAxeProps } from "./frame.js";

/**
 * Handles the resizing behavior of a frame element using pointer events.
 * Manages live resizing with window boundary constraints and accessibility announcements.
 *
 * @internal
 * @param el - The initial pointer event that triggered the resize
 * @param announcer - HTML element used for accessibility announcements
 * @param axe - Accessibility props containing resize-related announcement text
 * @param x - Current horizontal position of the frame
 * @param y - Current vertical position of the frame
 * @param w - Current width of the frame
 * @param h - Current height of the frame
 * @param ref - Reference to the frame element being resized
 * @param sizeChange - Callback function invoked when frame dimensions change
 * @param sizeSync - Function to synchronize the frame size after resizing
 *
 * @remarks
 * The function implements the following behavior:
 * - Tracks pointer movement to update frame dimensions in real-time
 * - Constrains maximum dimensions to prevent overflow outside window bounds
 * - Provides accessibility announcements at start and end of resize operation
 * - Uses getBoundingClientRect for accurate final dimensions
 * - Cleans up event listeners on resize completion
 *
 * @example
 * ```typescript
 * handleResize(
 *   pointerEvent,
 *   announcerElement,
 *   axeProps,
 *   100, // x position
 *   100, // y position
 *   400, // current width
 *   300, // current height
 *   frameRef.current,
 *   (width, height) => console.log(`Resized to ${width}x${height}`),
 *   () => syncFrameSize()
 * );
 * ```
 */
export function handleResize(
  el: PointerEvent,
  announcer: HTMLDivElement,
  axe: FrameAxeProps,
  x: number,
  y: number,
  w: number,
  h: number,
  ref: HTMLElement,
  sizeChange: (w: number, h: number) => void,
  sizeSync: () => void,
) {
  const startX = getClientX(el);
  const startY = getClientY(el);

  announcer.textContent = axe.axeResizeStartText(w, h);

  const controller = new AbortController();
  window.addEventListener(
    "pointermove",
    (ev) => {
      const currentX = getClientX(ev);
      const currentY = getClientY(ev);
      const xDelta = currentX - startX;
      const yDelta = currentY - startY;

      const maxWidth = window.innerWidth - x;
      const maxHeight = window.innerHeight - y;

      const newWidth = Math.min(w! + xDelta, maxWidth);
      const newHeight = Math.min(h! + yDelta, maxHeight);

      Object.assign(ref!.style, { width: `${newWidth}px`, height: `${newHeight}px` });
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    "pointerup",
    () => {
      const bb = ref!.getBoundingClientRect();

      sizeChange(bb.width, bb.height);
      setTimeout(sizeSync);

      announcer.textContent = axe.axeResizeEndText(w, h);
      controller.abort();
    },
    { signal: controller.signal },
  );
}
