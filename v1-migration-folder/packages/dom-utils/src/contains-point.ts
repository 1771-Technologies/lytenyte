/**
 * Checks if a coordinate point (x, y) lies within the boundaries of an HTML element.
 * Uses the element's bounding client rectangle to determine if the point intersects
 * with the element's visible area in the viewport.
 *
 * @param element - The HTML element to check against
 * @param clientX - The x-coordinate relative to the client viewport
 * @param clientY - The y-coordinate relative to the client viewport
 * @returns `true` if the coordinate point is within the element's boundaries, `false` otherwise
 *
 * @example
 * ```typescript
 * // Check if a mouse event's coordinates are within an element
 * element.addEventListener('mousemove', (e) => {
 *   const isInside = containsPoint(targetElement, e.clientX, e.clientY);
 *   console.log('Cursor is inside element:', isInside);
 * });
 *
 * // Check if a touch event's coordinates are within an element
 * element.addEventListener('touchstart', (e) => {
 *   const touch = e.touches[0];
 *   const isInside = containsPoint(targetElement, touch.clientX, touch.clientY);
 *   console.log('Touch is inside element:', isInside);
 * });
 * ```
 *
 * @remarks
 * - Uses `getBoundingClientRect()` which returns coordinates relative to the viewport
 * - The check is inclusive of the element's borders (>= left, <= right, etc.)
 * - The coordinates should be in the same coordinate space as getBoundingClientRect()
 *   (i.e., relative to the viewport)
 */
export function containsPoint(element: HTMLElement, clientX: number, clientY: number) {
  const rect = element.getBoundingClientRect();
  return (
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  );
}
