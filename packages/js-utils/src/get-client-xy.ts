/**
 * Gets the X-coordinate relative to the client viewport from various event types.
 * Handles both touch events (using the first touch point) and mouse/pointer/drag events.
 *
 * @param ev - The event object. Can be a MouseEvent, TouchEvent, PointerEvent, or DragEvent.
 * @returns The clientX coordinate. For touch events, returns the first touch point's clientX.
 *
 * @example
 * ```typescript
 * // Mouse event
 * element.addEventListener('mousemove', (e) => {
 *   const x = getClientX(e);
 *   console.log('Mouse X position:', x);
 * });
 *
 * // Touch event
 * element.addEventListener('touchstart', (e) => {
 *   const x = getClientX(e);
 *   console.log('Touch X position:', x);
 * });
 * ```
 */
export function getClientX(ev: MouseEvent | TouchEvent | PointerEvent | DragEvent) {
  if ("touches" in ev) return ev.touches[0].clientX;
  return ev.clientX;
}

/**
 * Gets the Y-coordinate relative to the client viewport from various event types.
 * Handles both touch events (using the first touch point) and mouse/pointer/drag events.
 *
 * @param ev - The event object. Can be a MouseEvent, TouchEvent, PointerEvent, or DragEvent.
 * @returns The clientY coordinate. For touch events, returns the first touch point's clientY.
 *
 * @example
 * ```typescript
 * // Mouse event
 * element.addEventListener('mousemove', (e) => {
 *   const y = getClientY(e);
 *   console.log('Mouse Y position:', y);
 * });
 *
 * // Touch event
 * element.addEventListener('touchstart', (e) => {
 *   const y = getClientY(e);
 *   console.log('Touch Y position:', y);
 * });
 * ```
 */
export function getClientY(ev: MouseEvent | TouchEvent | PointerEvent | DragEvent) {
  if ("touches" in ev) return ev.touches[0].clientY;
  return ev.clientY;
}
